import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddWeatherModal({ visible, onClose, onSearch }) {
  const [inputText, setInputText] = useState('');

  const handlePress = () => {
    if (inputText.trim()) {
      onSearch(inputText);
      setInputText(''); // Clear input
    }
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={true} 
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Top Drag Handle Indicator */}
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.title}>Add City</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#A0A0B0" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Search for a location</Text>
          
          <TextInput 
            style={styles.input}
            placeholder="e.g. New York, London"
            placeholderTextColor="#666677"
            value={inputText}
            onChangeText={setInputText}
            autoFocus={true}
            keyboardAppearance="dark"
          />

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
    justifyContent: 'flex-end', // Pushes the modal to the bottom
  },
  modalContent: {
    backgroundColor: '#1C1C22', // Dark background matching your UI image
    borderTopLeftRadius: 32, // Large rounded corners at the top
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, // Extra padding for iOS home indicator
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#383842',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF', // White text for dark mode
  },
  closeButton: {
    backgroundColor: '#2A2A35',
    padding: 6,
    borderRadius: 20,
  },
  label: {
    marginBottom: 12,
    color: '#A0A0B0', // Subtle gray
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2A2A35', // Darker input field background
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF', // White text for typing
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4E90FF', // The vibrant blue from the image UI
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#4E90FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});