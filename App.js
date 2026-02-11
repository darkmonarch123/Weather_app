import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons , FontAwesome} from '@expo/vector-icons';
import PrimaryButton from './components/PrimaryButton';
import AddWeatherModal from './components/AddWeatherModal';


export default function App() {
const [isModalOpen , setIsModalOpen] = useState(false);


function handleWeather(){
  setIsModalOpen(true);
}

function handleCloseModal(){
  setIsModalOpen(false);
}
  return (
  <View>
   <SafeAreaView>
    <StatusBar style='auto'></StatusBar>
     <View >
      <PrimaryButton onPress={handleWeather}>
        <Ionicons name='add-outline' size={24}></Ionicons>
        <Text style={{fontSize:24}}>Add Weather</Text>
      </PrimaryButton>
    </View>
    <View>
      {isModalOpen && <AddWeatherModal open={isModalOpen} onClose={handleCloseModal}></AddWeatherModal>}
    </View>
   </SafeAreaView>
  </View>
  );
}

const styles = StyleSheet.create({

});
