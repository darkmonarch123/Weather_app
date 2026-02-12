import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react'; // FIXED: Added import

import PrimaryButton from './components/PrimaryButton';
import AddWeatherModal from './components/AddWeatherModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleWeather() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    // SafeAreaView usually acts as the root container
    <SafeAreaView style={styles.rootContainer}>
      <StatusBar style='dark' />
      
      <View style={styles.mainContent}>
        <Text style={styles.welcomeText}>Weather App</Text>
        
        <PrimaryButton onPress={handleWeather}>
          <Ionicons name='add-outline' size={24} color="white" />
          <Text style={styles.buttonText}>Add Weather</Text>
        </PrimaryButton>
      </View>

      {/* Conditional rendering isn't strictly necessary with Modal 'visible' prop,
        but it helps performance to unmount it when closed.
      */}
      {isModalOpen && (
        <AddWeatherModal open={isModalOpen} onClose={handleCloseModal} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1, // Fill the whole screen
    backgroundColor: '#ffffff',
  },
  mainContent: {
    flex: 1, // Fill available space inside SafeAreaView
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20, // Add space between text and button
    color: '#333',
  },
  buttonText: {
    fontSize: 18,
    color: 'white', // Text inside the purple button should be white
    marginLeft: 8, // Space between Icon and Text
  },
});