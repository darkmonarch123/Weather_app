import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherCard({ weather, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.main}>
        <View>
          <Text style={styles.cityText}>{weather.city}</Text>
          <Text style={styles.typeText}>{weather.type}</Text>
        </View>
        <Text style={styles.tempText}>{Math.round(weather.temperature)}°</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.infoText}>Wind: {weather.wind} km/h</Text>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="close-circle-outline" size={22} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  main: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cityText: { fontSize: 22, fontWeight: '700', color: 'white' },
  typeText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tempText: { fontSize: 44, fontWeight: '200', color: 'white' },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 15, 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.1)' 
  },
  infoText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }
});