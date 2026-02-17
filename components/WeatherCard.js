import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

export default function WeatherCard({ weather, onDelete }) {
  const getIcon = (type) => {
    switch(type) {
      case 'Sunny': return 'sunny';
      case 'Rainy': return 'rainy';
      case 'Cloudy': return 'cloudy';
      default: return 'partly-sunny';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.city}>{weather.city}</Text>
          <Text style={styles.type}>{weather.type}</Text>
        </View>
        <Text style={styles.temp}>{Math.round(weather.temperature)}°</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <View style={styles.info}>
          <Ionicons name={getIcon(weather.type)} size={16} color="white" />
          <Text style={styles.infoText}>Wind: {weather.wind} km/h</Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  city: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  type: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },
  temp: { color: 'white', fontSize: 42, fontWeight: '300' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: 'white', fontSize: 14 }
});