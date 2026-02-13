import { Modal, Text, View, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "./PrimaryButton";
import { Ionicons } from '@expo/vector-icons';

// Assuming you have a utils folder, otherwise hardcode a number like 24
import { fontSize } from "../utils/fontSize"; 
import { Colors } from "../utils/colors";
// const fontSize = { icon1: 24 }; 

export default function AddWeatherModal({ open, onClose }) {
  return (
    <Modal visible={open} animationType="slide">
      {/* SafeAreaView ensures we don't overlap the notch/status bar on iOS 11+ */}
      <SafeAreaView style={styles.container}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Location</Text>
          {/* We wrap the close button to control its size */}
          <View style={styles.closeButtonWrapper}>
            <PrimaryButton onPress={onClose} style={styles.smallButton}>
               <Ionicons name='close-outline' size={12} color="white" />
            </PrimaryButton>
          </View>
        </View>

        {/* Body Section */}
        <View style={styles.content}>
           <Text style={styles.placeholderText}>Search input goes here...</Text>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full height of the Modal
    backgroundColor: Colors.primary, // Light grey background
  },
  header: {
    padding: 16,
    flexDirection: 'row', // Align title and button horizontally
    justifyContent: 'space-between', // Push them to opposite edges
    alignItems: 'center', // Vertically center them
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButtonWrapper: {
    // We can restrict the button size here if needed
  },
  smallButton: {
    // We can override PrimaryButton styles here!
    borderRadius: 100, 
    width:55,
    height:45,
    elevation: 0, // Remove shadow for a flatter look if desired
    backgroundColor: Colors.icon, // Red close button
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  }
});