import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from './utils/colors';
import WeatherCard from './components/WeatherCard';
import AddWeatherModal from './components/AddWeatherModal';
import PrimaryButton from './components/PrimaryButton';

const STORAGE_KEY = '@weather_app_data_v1';

export default function App() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Load data from storage on launch
  useEffect(() => {
    async function loadStoredData() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setWeatherList(JSON.parse(saved));
        }
      } catch (e) {
        console.log("Error loading data:", e);
      } finally {
        setIsInitialLoad(false);
      }
    }
    loadStoredData();
  }, []);

  // 2. Save data whenever list changes
  useEffect(() => {
    if (!isInitialLoad) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(weatherList));
    }
  }, [weatherList, isInitialLoad]);

  // 3. MAIN FETCH FUNCTION
  const fetchWeather = async (lat, lon, providedName = null) => {
    setLoading(true);
    try {
      // API URLs
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

      const [wRes, rRes] = await Promise.all([fetch(weatherUrl), fetch(reverseUrl)]);
      const wData = await wRes.json();
      const rData = await rRes.json();

      if (!wData.current_weather) throw new Error("Weather data missing");

      const cityName = providedName || rData.city || rData.locality || "Unknown City";

      const newWeatherEntry = {
        id: Date.now().toString(),
        city: cityName,
        temperature: wData.current_weather.temperature,
        wind: wData.current_weather.windspeed,
        type: mapWeatherCode(wData.current_weather.weathercode),
        utcOffset: wData.utc_offset_seconds,
        humidity: 65, // Note: Open-Meteo requires extra params for humidity, defaulting for now
      };

      setWeatherList(prev => {
        const filtered = prev.filter(item => item.city !== newWeatherEntry.city);
        return [newWeatherEntry, ...filtered];
      });

    } catch (err) {
      console.log("Fetch Error:", err);
      Alert.alert("Error", "Could not fetch weather. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // 4. BUTTON HANDLER: Auto-Detect
  const handleAutoDetect = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Please enable location to use this feature.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await fetchWeather(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      Alert.alert("Location Error", "Could not detect your current position.");
    } finally {
      setLoading(false);
    }
  };

  // 5. MODAL HANDLER: Search by Name
  const handleSearchCity = async (cityName) => {
    setLoading(true);
    try {
      const gUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
      const gRes = await fetch(gUrl);
      const gData = await gRes.json();

      if (!gData.results || gData.results.length === 0) {
        Alert.alert("Not Found", "We couldn't find that city.");
        return;
      }

      const { latitude, longitude, name } = gData.results[0];
      await fetchWeather(latitude, longitude, name);
      setIsModalOpen(false);
    } catch (err) {
      Alert.alert("Error", "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const mapWeatherCode = (code) => {
    if (code === 0) return "Sunny";
    if (code <= 3) return "Cloudy";
    if (code >= 51) return "Rainy";
    return "Partly Sunny";
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Weatherly</Text>
              <Text style={styles.sub}>Blue Theme</Text>
            </View>
            <View style={styles.headerButtons}>
              {/* NEW AUTO-DETECT BUTTON */}
              <PrimaryButton onPress={handleAutoDetect} style={styles.locBtn}>
                <Ionicons name="location" size={20} color={Colors.darkBlue} />
              </PrimaryButton>
              
              <PrimaryButton onPress={() => setIsModalOpen(true)}>
                <Ionicons name="add" size={24} color={Colors.darkBlue} />
              </PrimaryButton>
            </View>
          </View>

          {loading && <ActivityIndicator size="large" color="white" style={styles.loader} />}

          <FlatList
            data={weatherList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <WeatherCard 
                weather={item} 
                onDelete={() => setWeatherList(prev => prev.filter(c => c.id !== item.id))} 
              />
            )}
            ListEmptyComponent={
              !loading && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="cloud-outline" size={80} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.emptyText}>Tap the + to add a city or use the location button.</Text>
                </View>
              )
            }
          />

          <AddWeatherModal 
            open={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSearch={handleSearchCity}
          />

        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButtons: { flexDirection: 'row', gap: 10 },
  title: { fontSize: 32, fontWeight: '900', color: 'white' },
  sub: { color: 'white', opacity: 0.7, fontWeight: '600' },
  loader: { marginVertical: 20 },
  locBtn: { marginRight: 5 },
  emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { textAlign: 'center', color: 'white', fontSize: 16, opacity: 0.7, marginTop: 15 }
});