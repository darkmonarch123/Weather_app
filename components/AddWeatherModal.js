import { Modal, Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../utils/colors";

// Theme constants to match your main screen
const Theme = {
  primaryBlue: '#4facfe',
  darkBlue: '#003366',
  accentYellow: '#FFD700',
  white: '#FFFFFF',
  inputBg: '#F5F7FA'
};

export default function AddWeatherModal({ open, onClose }) {
  return (
    <Modal visible={open} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Location</Text>
          <Pressable onPress={onClose} style={styles.closeCircle}>
            <Ionicons name='close' size={24} color={Theme.darkBlue} />
          </Pressable>
        </View>

        {/* Body Section */}
        <View style={styles.content}>
          <Text style={styles.label}>Search City</Text>
          <View style={styles.searchSection}>
            <Ionicons style={styles.searchIcon} name="search-outline" size={20} color="#999"/>
            <TextInput 
              style={styles.input}
              placeholder="e.g. London, Tokyo..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Add Button - Yellow Accent */}
          <Pressable 
            style={({pressed}) => [styles.addButton, pressed && styles.pressed]}
            onPress={() => {
                // Handle logic here
                onClose();
            }}
          >
            <Text style={styles.addButtonText}>Add to List</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white, // Clean white modal background
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.darkBlue,
  },
  closeCircle: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.inputBg,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Theme.darkBlue,
  },
  addButton: {
    backgroundColor: Theme.accentYellow,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for the button
    shadowColor: Theme.accentYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.darkBlue,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  }
});