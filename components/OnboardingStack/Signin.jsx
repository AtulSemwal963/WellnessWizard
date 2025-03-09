import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal'; // Importing modal library
import Logo from '../../assets/images/logo.png';
import { Auth0Manager,UserManager } from '../HelperComponents/UtilityClasses/CloudServicesManager';

const googleIcon = require('../../assets/images/google.png');
const facebookIcon = require('../../assets/images/facebookBlue.png');

export default function Signin() {
  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
  });

  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  if (!loaded && !error) {
    return null;
  }

  const GoogleSignin = async() => {
    if(await Auth0Manager.handleGoogleSignin(setModalVisible,UserManager.checkUserExists)){
          try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'QuestionnaireComponent' }],
          });
        } catch (navigationError) {
          console.error('Navigation error:', navigationError);
          Alert.alert(
            'Navigation Error',
            'There was an error navigating to the questionnaire. Please try again.'
          );
        }
  }
  else{
    Alert.alert(
      'Navigation Error',
      'There was an error navigating to the questionnaire. Please try again.'
    );
  }
}

const FacebookSignin = async() => {
  //Auth0Manager.handleGoogleSignin(setModalVisible,UserManager.checkUserExists);
  if(await Auth0Manager.handleFacebookSignin(setModalVisible,UserManager.checkUserExists)){
        try {
        navigation.reset({
          index: 0,
          routes: [{ name: 'QuestionnaireComponent' }],
        });
      } catch (navigationError) {
        console.error('Navigation error:', navigationError);
        Alert.alert(
          'Navigation Error',
          'There was an error navigating to the questionnaire. Please try again.'
        );
      }
}
else{
  Alert.alert(
    'Navigation Error',
    'There was an error navigating to the questionnaire. Please try again.'
  );
}
}

  const SocialButton = ({ provider, icon, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#D5D5D5',
        }}
        onPress={onPress}
      >
        <Image source={icon} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-gray-300">
      <TouchableOpacity>
        <AntDesign name="close" color="black" size={25} style={{ padding: "3%" }} onPress={() => navigation.goBack()} />
      </TouchableOpacity>

      <Text className="text-4xl text-left p-3 text-gray-700" style={{ fontFamily: "Gabarito-SemiBold", marginTop: "1%" }}>Welcome Back!</Text>
      <View className="h-full w-full self-center flex-col bg-gray-100 rounded-3xl top-2" style={{ width: "96%", marginTop: "2%", borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
        <Image source={Logo} className="h-36 w-36 rounded-2xl self-center top-4 bg-gray-500" style={{ elevation: 10, borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)', shadowOffset: { width: 10, height: 10 }, }} />
        <View className="flex-row self-center items-center" style={{ marginTop: "15%", marginBottom: "5%" }}>
          <View className="rounded-full" style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }}></View>
          <Text className="mx-2 text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>Enter Your Details</Text>
          <View className="rounded-full" style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }}></View>
        </View>

        <TextInput className="bg-gray-200 self-center text-lg p-1 px-3 rounded-md" placeholder='Email' style={{ width: "70%", fontFamily: "Gabarito-Regular", borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)' }}></TextInput>

        <View className="flex-row w-full justify-between self-center p-5">
          <TouchableOpacity className="rounded-lg" style={{ width: "40%" }}>
            <Text className="p-3 text-center text-lg" style={{ fontFamily: "Gabarito-Regular" }}>
              Forgot Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg" style={{ backgroundColor: "rgb(117, 141, 163)", width: "35%" }} onPress={()=> navigation.reset({
        index: 0,
        routes: [{ name: 'AppNavigator' }],
      })}>
            <Text className="p-3 text-center text-lg text-white" style={{ fontFamily: "Gabarito-Regular" }}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row self-center items-center" style={{ marginTop: "-2%", marginBottom: "5%" }}>
          <View className="rounded-full" style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }}></View>
          <Text className="mx-2 text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>or Sign in With</Text>
          <View className="rounded-full" style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }}></View>
        </View>

        <View className="flex-row justify-between self-center" style={{ width: "70%" }}>
          <SocialButton provider="google-oauth2" icon={googleIcon} onPress={()=>GoogleSignin()}/>
          <SocialButton provider="facebook" icon={facebookIcon} onPress={()=>FacebookSignin()} />
        </View>

        <Text className="mx-2 text-gray-500 top-6 text-center" style={{ fontFamily: "Gabarito-Regular" }}>Don't have an account?</Text>
        <TouchableOpacity className="self-center top-10" onPress={() => navigation.replace('Signup')}>
          <Text className="mx-2 text-gray-500 underline" style={{ fontFamily: "Gabarito-Regular" }}>Sign up instead</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for User Not Found */}
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} animationIn={"bounceIn"} animationOut={"bounceOut"}>
        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <AntDesign name="exclamationcircleo" size={60} color="#d1d5db" />
          <Text style={{ fontFamily:"Gabarito-SemiBold" }} className="text-2xl my-2">User Not Found</Text>
          <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-lg text-gray-500 text-center" >It seems you don't have an account. Please sign up to create one.</Text>
          <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false); 
                    navigation.replace('Signup'); 
                  }}
                  style={{
                    backgroundColor: 'rgb(117, 141, 163)',
                    borderRadius: 5,
                    padding: 10,
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Go to Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Cancel</Text>
                </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
