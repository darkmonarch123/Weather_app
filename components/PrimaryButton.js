import { Pressable, StyleSheet, View } from "react-native";

// We pass 'style' as a prop so we can override defaults from the parent if needed
export default function PrimaryButton({ children, onPress, style }) {
  return (
    <View style={[styles.outerContainer, style]}>
      {/* On Android, the ripple effect needs a View wrapper with 
         overflow: 'hidden' to respect rounded corners 
      */}
      <Pressable
        style={({ pressed }) => [
          styles.innerContainer,
          pressed ? styles.pressed : null, // iOS feedback effect
        ]}
        onPress={onPress}
        android_ripple={{ color: "#dddddd" }} // Android ripple effect
      >
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 28, // Rounded pill shape
    margin: 4,
    overflow: "hidden", // Clips the ripple effect to the border radius
    
    // SHADOWS (Elevation for Android, Shadow props for iOS)
    elevation: 4, 
    backgroundColor: 'white', // Shadow needs a background color to be visible
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  innerContainer: {
    backgroundColor: "#4e0eff", // A nice vibrant purple
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75, // Dim button on press for iOS
  },
});