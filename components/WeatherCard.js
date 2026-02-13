import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

export default function WeatherCard({ weather, onDelete }) {
  
  const formatTime = (offset) => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const local = new Date(utc + (offset * 1000));
    return local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View>
          <Text style={styles.timeText}>{formatTime(weather.utcOffset)}</Text>
          <Text style={styles.cityText}>{weather.city}</Text>
        </View>
        <Text style={styles.tempText}>{Math.round(weather.temperature)}°</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottom}>
        <View style={styles.badge}>
          <Text style={styles.typeText}>{weather.type}</Text>
        </View>
        <View style={styles.actions}>
          <Text style={styles.windText}>{weather.wind} km/h</Text>
          <Pressable onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#FF5252" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#999', fontWeight: 'bold' },
  cityText: { fontSize: 22, fontWeight: 'bold', color: Colors.darkBlue },
  tempText: { fontSize: 38, fontWeight: '300', color: Colors.darkBlue },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: Colors.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 12, fontWeight: 'bold', color: Colors.darkBlue },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  windText: { fontSize: 12, color: '#666' }
});