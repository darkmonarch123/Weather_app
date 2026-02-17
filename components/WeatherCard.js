import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherCard({ weather, onDelete }) {
  // Added colors to the icons to make them pop against the dark background
  const getIconConfig = (type) => {
    switch(type) {
      case 'Sunny': 
        return { name: 'sunny', color: '#FFD700' }; // Golden Yellow
      case 'Rainy': 
        return { name: 'rainy', color: '#4E90FF' }; // Vibrant Blue
      case 'Cloudy': 
        return { name: 'cloudy', color: '#A0A0B0' }; // Gray
      default: 
        return { name: 'partly-sunny', color: '#FFD700' };
    }
  };

  const iconConfig = getIconConfig(weather.type);

  return (
    <View style={styles.card}>
      {/* Left Side: Icon + City/Type text */}
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconConfig.name} size={36} color={iconConfig.color} />
        </View>
        <View style={styles.textInfo}>
          <Text style={styles.city}>{weather.city}</Text>
          <Text style={styles.type}>{weather.type}</Text>
        </View>
      </View>
      
      {/* Right Side: Temperature + Delete Button */}
      <View style={styles.rightSection}>
        <Text style={styles.temp}>{Math.round(weather.temperature)}°</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color="#666677" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2A35', // Deep dark grey matching the image UI
    borderRadius: 24, // Soft rounded corners
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    width: 40,
    alignItems: 'center',
  },
  textInfo: {
    justifyContent: 'center',
  },
  city: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  type: {
    color: '#A0A0B0', // Muted gray for secondary text
    fontSize: 14,
    fontWeight: '400',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    marginRight: 12,
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.15)', // Very subtle background for the touch target
    borderRadius: 12,
  }
});