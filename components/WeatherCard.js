import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';

// Define our specific palette here for easy usage
const Theme = {
  textPrimary: '#003366', // Dark Blue for text
  cardBg: 'white',
  accent: '#FFD700',      // Yellow
  iconColor: '#FDB813',   // Sun/Icon Yellow
};

export default function WeatherCard({ weather }) {
  // Helper to pick icon based on weather type
  const getIconName = (type) => {
    switch (type?.toLowerCase()) {
      case 'sunny': return 'sunny';
      case 'rainy': return 'rainy';
      case 'cloudy': return 'cloudy';
      default: return 'partly-sunny';
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Section: Icon and Temperature */}
      <View style={styles.topRow}>
        <View style={styles.mainInfo}>
            <Ionicons name={getIconName(weather.type)} size={50} color={Theme.iconColor} />
            <View style={styles.textContainer}>
                <Text style={styles.cityText}>{weather.city}</Text>
                <Text style={styles.typeText}>{weather.type}</Text>
            </View>
        </View>
        <Text style={styles.tempText}>{weather.temperature}°</Text>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Bottom Section: Humidity and Action Button */}
      <View style={styles.bottomRow}>
        <View style={styles.detailItem}>
           <Ionicons name="water-outline" size={20} color="#4F8EF7" />
           <Text style={styles.humidityText}>{weather.humdity}% Humidity</Text>
        </View>

        {/* Custom Yellow Accent Button */}
        <Pressable 
          style={({pressed}) => [styles.button, pressed && styles.pressed]}
        >
           <Text style={styles.buttonText}>See Forecast</Text>
           <Ionicons name="arrow-forward" size={16} color={Theme.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBg,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 20,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Space between icon and text
  },
  textContainer: {
    justifyContent: 'center',
  },
  cityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.textPrimary,
  },
  typeText: {
    fontSize: 14,
    color: '#888',
    textTransform: 'capitalize',
  },
  tempText: {
    fontSize: 42,
    fontWeight: '300',
    color: Theme.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  humidityText: {
    color: '#666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: Theme.accent, // Yellow Background
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25, // Pill shape
    alignItems: 'center',
    gap: 5,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: Theme.textPrimary, // Dark Blue Text
    fontWeight: 'bold',
    fontSize: 14,
  }
});