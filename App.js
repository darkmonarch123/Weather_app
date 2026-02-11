import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons , FontAwesome} from '@expo/vector-icons';


export default function App() {
  return (
  <View>
   <SafeAreaView>
    <StatusBar style='auto'></StatusBar>
     <View style={styles.buttonContainer}>
      <Button title=''></Button>
      <Ionicons name='add-outline' size={24} color='black'>
        Add weather
      </Ionicons>
      {/* <FontAwesome name='cloud' size={24} color='black'></FontAwesome> */}
    </View>
   </SafeAreaView>
  </View>
  );
}

const styles = StyleSheet.create({
 buttonContainer:{
  margin:20,
 }
});
