import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from './utils/colors';
import WeatherCard from './components/WeatherCard';
import AddWeatherModal from './components/AddWeatherModal';
import PrimaryButton from './components/PrimaryButton';

// Changed key to v2 to clear old corrupted data
const STORAGE_KEY = '@weather_app_data_v2';

export default function App() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      // Step 1: Fetch Weather
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();

      if (!wData.current_weather) throw new Error("Weather data missing");

      // Step 2: Determine City Name
      // We separate this so if naming fails, we still get weather
      let cityName = providedName;
      
      if (!cityName) {
        try {
          const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
          const rRes = await fetch(reverseUrl);
          const rData = await rRes.json();
          cityName = rData.city || rData.locality || "Unknown Location";
        } catch (geoError) {
          console.log("Geocoding failed, defaulting name");
          cityName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        }
      }

      const newWeatherEntry = {
        id: Date.now().toString(), // Unique ID
        city: cityName,
        temperature: wData.current_weather.temperature,
        wind: wData.current_weather.windspeed,
        type: mapWeatherCode(wData.current_weather.weathercode),
        utcOffset: wData.utc_offset_seconds,
      };

      setWeatherList(prev => {
        // Remove duplicates if city already exists
        const filtered = prev.filter(item => item.city !== newWeatherEntry.city);
        return [newWeatherEntry, ...filtered];
      });

    } catch (err) {
      console.log("Fetch Error:", err);
      Alert.alert("Error", "Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Auto-Detect Location
  const handleAutoDetect = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Please allow location access in settings.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await fetchWeather(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      Alert.alert("Error", "Could not get current location.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Search by City Name
  const handleSearchCity = async (searchText) => {
    setLoading(true);
    try {
      const gUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}&count=1&language=en&format=json`;
      const gRes = await fetch(gUrl);
      const gData = await gRes.json();

      if (!gData.results || gData.results.length === 0) {
        Alert.alert("Not Found", "City not found.");
        return;
      }

      const { latitude, longitude, name } = gData.results[0];
      await fetchWeather(latitude, longitude, name);
      setIsModalVisible(false);
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
              <Text style={styles.sub}>Forecast</Text>
            </View>
            <View style={styles.headerButtons}>
              <PrimaryButton onPress={handleAutoDetect} style={styles.locBtn}>
                <Ionicons name="location-sharp" size={22} color={Colors.darkBlue} />
              </PrimaryButton>
              
              <PrimaryButton onPress={() => setIsModalVisible(true)}>
                <Ionicons name="add" size={26} color={Colors.darkBlue} />
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
                  <Text style={styles.emptyText}>Tap + to search or use the location button.</Text>
                </View>
              )
            }
          />

          <AddWeatherModal 
            visible={isModalVisible} 
            onClose={() => setIsModalVisible(false)} 
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
  header: { 
    padding: 20, 
    paddingTop: 50, // Added padding for top notch
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerButtons: { flexDirection: 'row' },
  title: { fontSize: 32, fontWeight: '900', color: 'white' },
  sub: { color: 'white', opacity: 0.7, fontWeight: '600' },
  loader: { marginVertical: 20 },
  locBtn: { marginRight: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { textAlign: 'center', color: 'white', fontSize: 16, opacity: 0.7, marginTop: 15 }
});