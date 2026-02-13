import { View ,Text, StyleSheet, Button } from "react-native"
import { Colors } from "../utils/colors"
import { Ionicons } from '@expo/vector-icons';

export default function WeatherCard({weather}){
     return(
          <View style={styles.card}>
               <Ionicons name={weather.type}  size={64}></Ionicons>
             <View>
               <Text>City:{weather.city}</Text>
               <Text>Temperature:{weather.temperature}</Text>
               <Text>Humdity:{weather.humdity}</Text>
               <Text>Type:{weather.type}</Text>
             </View>
              <View style={styles.buttonContainer}>
                <Button title="See foreCast" style={styles.button}></Button>
              </View>
          </View>
     )    
}

const styles =StyleSheet.create({
    card: {
    flex: 1,
    height: 250,
    borderRadius: 20,
    backgroundColor: "skyblue",
    margin: 15,
    padding: 15,
    elevation: 4,
  },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 30,
  },
 button:{
          padding:20,
          justifyContent:'center',
          alignItems:'center',
          borderRadius:12,
          backgroundColor:'white', 
     }
})