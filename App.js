import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import PrimaryButton from './components/PrimaryButton';
import AddWeatherModal from './components/AddWeatherModal';
import { WeatherData } from './utils/initialData';
import WeatherCard from './components/WeatherCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Blue Theme Colors
  const appColors = {
    gradientStart: '#4facfe', // Light Blue
    gradientEnd: '#00f2fe',   // Cyan/Bright Blue
    text: 'white',
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar style='light' />
      
      {/* Background Gradient */}
      <LinearGradient 
        colors={[appColors.gradientStart, appColors.gradientEnd]} 
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Text style={styles.dateText}>Today</Text>
              <Text style={styles.welcomeText}>Weather App</Text>
            </View>
            
            {/* Add Button - Styled transparently or white */}
            <PrimaryButton onPress={() => setIsModalOpen(true)}>
              <View style={styles.addButtonContent}>
                 <Ionicons name='add' size={24} color="#005ea2" />
                 <Text style={styles.addButtonText}>Add</Text>
              </View>
            </PrimaryButton>
          </View>

          {/* Main List */}
          <View style={styles.listContainer}>
            <FlatList 
              data={WeatherData} 
              renderItem={({item}) => <WeatherCard weather={item} />} 
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </View>

        </SafeAreaView>
      </LinearGradient>

      {isModalOpen && (
        <AddWeatherModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // White button against blue background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 4
  },
  addButtonText: {
    color: '#005ea2', // Match the blue theme
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  }
});