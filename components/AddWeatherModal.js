import { Modal , Text } from "react-native";
import PrimaryButton from "./PrimaryButton";
import {Ionicons , FontAwesome} from '@expo/vector-icons';
import { fontSize } from "../utils/fontSize";


export default function AddWeatherModal({open,onClose}) {


     return(
          <Modal visible={open} animationType="slide">
               <PrimaryButton onPress={onClose}>
                    <Ionicons name='close-outline' size={fontSize.icon1}></Ionicons>
                    <Text>Close</Text>
               </PrimaryButton>
               <View>
                    
               </View>
          </Modal>
     )
}