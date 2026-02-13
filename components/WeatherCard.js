import { View ,Text, StyleSheet, Button } from "react-native"
import { Colors } from "../utils/colors"

export default function WeatherCard({weather}){
     return(
          <View style={styles.card}>
               <Text>City:{weather.city}</Text>
               <Text>Temperature:{weather.temperature}</Text>
               <Text>Humdity:{weather.humdity}</Text>
               <Text>Type:{weather.type}</Text>
              <View style={styles.ButtonContainer}>
                <Button title="See foreCast" style={styles.Button}></Button>
              </View>
          </View>
     )    
}

const styles =StyleSheet.create({
     card:{
          // flex:1,
          height:150,
          borderRadius:12,
          backgroundColor:Colors.icon,
          color:'white',
          margin:15,
          overflow:'hidden',
     },
     ButtonContainer:{
          padding:10,
          alignItems:'center',
          overflow:'hidden',
          borderRadius:12,
          marginTop:10,
     },
     Button:{
          padding:20,
          justifyContent:'center',
          alignItems:'center',
          borderRadius:12,
          backgroundColor:'white', 
     }
})