import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function PrimaryButton({ onPress, children, style }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  }
});