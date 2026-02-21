import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, Alert, 
  ActivityIndicator, SafeAreaView, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import WeatherCard from './components/WeatherCard';
import AddWeatherModal from './components/AddWeatherModal';
import PrimaryButton from './components/PrimaryButton';

const STORAGE_KEY = '@weather_app_data_v2';

export default function App() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setWeatherList(JSON.parse(saved));
      } catch (e) {
        console.log("Error loading data:", e);
      } finally {
        setIsInitialLoad(false);
      }
    }
    loadStoredData();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(weatherList));
    }
  }, [weatherList, isInitialLoad]);

  const mapWeatherCode = (code) => {
    if (code === 0) return "Sunny";
    if (code <= 3) return "Cloudy";
    if (code >= 51) return "Rainy";
    return "Partly Sunny";
  };

  const fetchWeather = async (lat, lon, providedName = null) => {
    setLoading(true);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();

      let cityName = providedName;
      if (!cityName) {
        const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const rRes = await fetch(reverseUrl);
        const rData = await rRes.json();
        cityName = rData.city || rData.locality || "Unknown Location";
      }

      const newEntry = {
        id: Date.now().toString(),
        city: cityName,
        temperature: Math.round(wData.current_weather.temperature),
        wind: wData.current_weather.windspeed,
        type: mapWeatherCode(wData.current_weather.weathercode),
      };

      setWeatherList(prev => [newEntry, ...prev.filter(item => item.city !== newEntry.city)]);
    } catch (err) {
      Alert.alert("Error", "Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Allow location access to get local weather.");
      return;
    }
    setLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    await fetchWeather(location.coords.latitude, location.coords.longitude);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Weatherly</Text>
            <Text style={styles.subText}>Personal Forecast</Text>
          </View>
          <View style={styles.headerButtons}>
            <PrimaryButton onPress={handleGetCurrentLocation} style={styles.iconButton}>
              <Ionicons name="location" size={22} color="white" />
            </PrimaryButton>
            <PrimaryButton onPress={() => setIsModalVisible(true)} style={styles.iconButton}>
              <Ionicons name="add" size={28} color="white" />
            </PrimaryButton>
          </View>
        </View>

        {loading && <ActivityIndicator color="#4E90FF" style={{ marginBottom: 20 }} />}

        <FlatList
          data={weatherList}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WeatherCard 
              weather={item} 
              onDelete={() => setWeatherList(prev => prev.filter(c => c.id !== item.id))} 
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cloud-outline" size={70} color="#2A2A35" />
              <Text style={styles.emptyText}>No cities added yet</Text>
            </View>
          }
        />

        <AddWeatherModal 
          visible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          onSearch={(city) => {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
              .then(res => res.json())
              .then(data => {
                if (data.results) {
                  const res = data.results[0];
                  fetchWeather(res.latitude, res.longitude, res.name);
                } else {
                  Alert.alert("Not Found", "City not found.");
                }
              });
            setIsModalVisible(false);
          }} 
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121214' // Matches the "Dark" vibe of the modal
  },
  safeArea: { flex: 1 },
  header: { 
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'android' ? 40 : 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    letterSpacing: -0.5 
  },
  subText: { 
    color: '#A0A0B0', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  headerButtons: { 
    flexDirection: 'row',
    gap: 12
  },
  iconButton: {
    backgroundColor: '#1C1C22',
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A35'
  },
  listContainer: { 
    paddingHorizontal: 24, 
    paddingBottom: 40 
  },
  emptyContainer: { 
    alignItems: 'center', 
    marginTop: 120 
  },
  emptyText: { 
    color: '#666677', 
    fontSize: 16, 
    marginTop: 16, 
    fontWeight: '500' 
  }
});