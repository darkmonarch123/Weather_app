import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react'; // FIXED: Added import

import PrimaryButton from './components/PrimaryButton';
import AddWeatherModal from './components/AddWeatherModal';
import { Colors } from './utils/colors';
import { WeatherData } from './utils/initialData';
import WeatherCard from './components/WeatherCard';
import { LinearGradient } from 'expo-linear-gradient';

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
     <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.screen}>
       <StatusBar style='light' />
      
      <View style={styles.mainContent}>
        {/* <Ionicons name="cloudy-night-outline" style={styles.icons} size={32}></Ionicons> */}
          <Ionicons name='cloudy-night-outline' size={64} color={Colors.icon} />
        <Text style={styles.welcomeText}>Weather App</Text>
        
        <PrimaryButton onPress={handleWeather}>
          <Ionicons name='add-circle-outline' size={24} color="white" />
          <Text style={styles.buttonText}>Add Weather</Text>
        </PrimaryButton>
      </View>

      {/* Conditional rendering isn't strictly necessary with Modal 'visible' prop,
        but it helps performance to unmount it when closed.
      */}
      <View>
        {isModalOpen && (
        <AddWeatherModal open={isModalOpen} onClose={handleCloseModal} />
      )}
      </View>
      <View>
        <FlatList data={WeatherData} renderItem={(itemData)=>{return <WeatherCard weather={itemData.item} />}} keyExtractor={(item)=> item.id}></FlatList>
      </View>
     </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex:1
  },
  rootContainer: {
    flex: 1, // Fill the whole screen
    backgroundColor: Colors.primary,
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
  icon:{
    color: Colors.secondary,
    marginBottom: 16, // Space between icon and text
  }
});