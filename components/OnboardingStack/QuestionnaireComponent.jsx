import React,{useMemo, useState,useCallback} from 'react';
import {View,Text,TouchableOpacity,BackHandler,ToastAndroid} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useFonts } from 'expo-font';
import Constants from 'expo-constants'
import { useNavigation,useFocusEffect } from '@react-navigation/native';


export default function QuestionnaireComponent(){
    const navigation= useNavigation();
    const [backPressCount, setBackPressCount] = useState(0);
    const [loaded, error] = useFonts({
      'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
      'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
      'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
      'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
    });

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
            if (backPressCount === 0) {
              ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
              setBackPressCount(1);
  
              // Reset the backPressCount after a short delay to wait for double back press
              setTimeout(() => setBackPressCount(0), 2000);
              return true;
            } else if (backPressCount === 1) {
              BackHandler.exitApp();
              return true;
          }
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
      }, [backPressCount])
    );

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: `I'm just checking.`,
            value: 'option1'
        },
        {
            id: '2',
            label: `I don't feel well.`,
            value: 'option2'
        },
        {
            id:'3',
            label:`I have a fever.`,
            value:`option3`
        },
        {
            id:'4',
            label:`I have a cough.`,
            value:`option4`
        },
        {
            id:'5',
            label:`I have a headache`,
            value:`option5`
        }
    ]), []);

    const [selectedId, setSelectedId] = useState();
    const [selectedMessage, setSelectedMessage] = useState('');

    if (!loaded && !error) {
    return null;
  }

    const handleRadioSelect = (id) => {
        setSelectedId(id);
        const selectedButton = radioButtons.find(button => button.id === id);
        setSelectedMessage(id === '1' ? null : selectedButton?.label || '');
    };

    return(
        <View className="h-full w-full">
            <AntDesign name="close" color="black" size={25} style={{margin:15}} onPress={()=> navigation.reset({
        index: 0,
        routes: [{ name: 'AppNavigator' }],
      })}/>
            <Text className="text-3xl" style={{fontFamily:"Gabarito-SemiBold",marginLeft:15,marginTop:15}}>What brings you in today?</Text>
            <Text className="text-xl text-gray-500" style={{fontFamily:"Gabarito-Regular",marginLeft:15,marginTop:10}}>Select whichever applies </Text>
            <View>
                
            </View>
              <RadioGroup labelStyle={{width:"90%",fontFamily:"Gabarito-Regular", padding:"4%",borderWidth:1,borderColor:"rgba(117, 141, 163, 0.4)",borderRadius:6,fontSize:20}}
              containerStyle={{
                display:"flex",
                flexDirection:"column",
                margin:15
              }}
            radioButtons={radioButtons} 
            onPress={handleRadioSelect}
            selectedId={selectedId}
            
        />   

        {selectedId && <TouchableOpacity className=" w-4/5 self-center top-5 rounded-lg"style={{"backgroundColor":"rgb(117, 141, 163)"}} onPress={() => navigation.reset({
        index: 0,
        routes: [{ 
            name: 'AppNavigator',
            params: { message: selectedMessage }
        }],
      })}>
          <Text className="text-2xl p-3 text-center text-white" style={{fontFamily:"Gabarito-SemiBold"}}>
            Next
          </Text>
        </TouchableOpacity>}
           
            </View>
    )
}