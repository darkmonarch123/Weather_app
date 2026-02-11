import { Pressable ,StyleSheet} from "react-native";
// import { Button } from "react-native/types_generated/index";

export default function PrimaryButton({children , onPress , style}) {
     return(
          <Pressable android_ripple={{color : 'yellow'}} onPress={onPress} style={style.buttonContainer}>
               {children}
          </Pressable>
     )

}


const styles = StyleSheet.create({
     buttonContainer:{
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center',
          padding :15,
          margin :20,
          backgroundColor : 'blue',
     }
})