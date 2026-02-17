import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './utils/colors';
import WeatherCard from './components/WeatherCard';
import AddWeatherModal from './components/AddWeatherModal';
import PrimaryButton from './components/PrimaryButton';

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

  const onRefresh = async () => {
    setLoading(true);
    try {
      for (let w of weatherList) {
        // In a real app, you'd fetch by coordinates stored in the object
        // For this demo, we'll trigger the refresh logic
      }
      await handleAutoDetect(); 
    } catch (err) {
      console.log("Error refreshing:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchWeather = async (lat, lon, providedName = null) => {
    setLoading(true);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();

      if (!wData.current_weather) throw new Error("Weather data missing");

      let cityName = providedName;
      if (!cityName) {
        const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const rRes = await fetch(reverseUrl);
        const rData = await rRes.json();
        cityName = rData.city || rData.locality || "Unknown Location";
      }

      const newWeatherEntry = {
        id: Date.now().toString(),
        city: cityName,
        temperature: wData.current_weather.temperature,
        wind: wData.current_weather.windspeed,
        type: mapWeatherCode(wData.current_weather.weathercode),
      };

      setWeatherList(prev => {
        const filtered = prev.filter(item => item.city !== newWeatherEntry.city);
        return [newWeatherEntry, ...filtered];
      });

    } catch (err) {
      Alert.alert("Error", "Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Please allow location access.");
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

  const handleSearchCity = async (searchText) => {
    setLoading(true);
    try {
      const gUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}&count=1&language=en&format=json`;
      const gRes = await fetch(gUrl);
      const gData = await gRes.json();

      if (!gData.results) {
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
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Weatherly</Text>
            <Text style={styles.sub}>Popular Cities</Text>
          </View>
          <View style={styles.headerButtons}>
            <PrimaryButton onPress={handleAutoDetect} style={styles.locBtn}>
              <Ionicons name="location-sharp" size={22} color="white" />
            </PrimaryButton>
            
            <PrimaryButton onPress={() => setIsModalVisible(true)}>
              <Ionicons name="add" size={26} color="white" />
            </PrimaryButton>
          </View>
        </View>

        {loading && <ActivityIndicator size="small" color="#4E90FF" style={styles.loader} />}

        <FlatList
          data={weatherList}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#4E90FF" />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <WeatherCard 
              weather={item} 
              onDelete={() => setWeatherList(prev => prev.filter(c => c.id !== item.id))} 
            />
          )}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={60} color="#383842" />
                <Text style={styles.emptyText}>Add a city to see the forecast</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121217' // Solid dark background matching the UI
  },
  safeArea: { flex: 1 },
  header: { 
    padding: 24, 
    paddingTop: 40,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerButtons: { flexDirection: 'row' },
  title: { fontSize: 28, fontWeight: '800', color: 'white' },
  sub: { color: '#A0A0B0', fontSize: 16, fontWeight: '500', marginTop: 4 },
  loader: { marginVertical: 10 },
  locBtn: { marginRight: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', color: '#A0A0B0', fontSize: 16, marginTop: 15 }
});