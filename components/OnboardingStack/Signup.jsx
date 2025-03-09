import React, { useState} from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { enableFreeze } from 'react-native-screens';
import Modal from 'react-native-modal';
import {Auth0Manager,UserManager} from '../HelperComponents/UtilityClasses/CloudServicesManager';
import Logo from '../../assets/images/logo.png';
const googleIcon = require('../../assets/images/google.png');
const facebookIcon = require('../../assets/images/facebookBlue.png');

enableFreeze(true);

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
 

  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
  });

  const setText = (text, setHook) => {
    setHook(text);
  };

  if (!loaded && !error) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleLogin = async() => {
    if(await UserManager.handleLogin()){
    navigation.navigate('QuestionnaireComponent');      
    }
  };

  const handleGoogleSignup = async () => {
    const result = await Auth0Manager.handleGoogleSignup(setUserInfo, setUserExists);
    if (result && result.userInfo) {  // Add null check
      const { accessToken, userInfo } = result;
      navigation.navigate('PrivacyPolicyScreen', {
        userInfo: {
          email: userInfo.email,
          name: userInfo.name,
          sub: userInfo.sub,
          picture: userInfo.picture,
        },
        accessToken: accessToken,
        isOnboarding: true,
      });
    }
  };
  

  const handleFacebookSignup = async () => {
    const result = await Auth0Manager.handleFacebookSignup(setUserInfo, setUserExists);
    if (result && result.userInfo) {
      const { accessToken, userInfo } = result;
      navigation.navigate('PrivacyPolicyScreen', {
        userInfo: {
          email: userInfo.email,
          name: userInfo.name,
          sub: userInfo.sub,
          picture: userInfo.picture,
        },
        accessToken: accessToken,
        isOnboarding: true,
      });
    }
  };
  

  const SocialButton = ({ provider, icon, onPress }) => (
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="bg-gray-300">
        <TouchableOpacity>
          <AntDesign
            name="close"
            color="black"
            size={25}
            style={{ padding: "3%" }}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>

        <Text
          className="text-4xl text-left p-3 text-gray-700"
          style={{ fontFamily: "Gabarito-SemiBold", marginTop: "1%" }}
        >
          Create Your Account to Get Started
        </Text>

        <View
          className="h-full w-full self-center flex-col bg-gray-100 rounded-3xl top-2"
          style={{
            width: "96%",
            marginTop: "2%",
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <Image
            source={Logo}
            className="h-36 w-36 rounded-2xl self-center top-4 bg-gray-500"
            style={{
              elevation: 10,
              borderWidth: 1,
              borderColor: "rgba(107,114,128,0.5)",
              shadowOffset: {
                width: 10,
                height: 10,
              },
            }}
          />
          <View
            className="flex-row self-center items-center"
            style={{ marginTop: "15%", marginBottom: "5%" }}
          >
            <View
              className="rounded-full"
              style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }}
            />
            <Text className="mx-2 text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>
              Enter Your Details
            </Text>
            <View
              className="rounded-full"
              style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }}
            />
          </View>

          <TextInput
            className="bg-gray-200 self-center text-lg p-1 px-3 rounded-md"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setText(text, setEmail)}
            style={{
              width: "70%",
              fontFamily: "Gabarito-Regular",
              borderWidth: 1,
              borderColor: "rgba(107,114,128,0.5)",
            }}
          />
          <View className="flex-row items-center bg-gray-200 self-center px-3 rounded-md"
            style={{
              width: "70%",
              marginTop: "5%",
              fontFamily: "Gabarito-Regular",
              borderWidth: 1,
              borderColor: "rgba(107,114,128,0.5)",
            }}>
            <TextInput
              className="bg-gray-200 self-center text-lg py-1  rounded-md"
              placeholder="Password"
              value={password}
              onChangeText={(text) => setText(text, setPassword)}
              style={{
                width: "90%",
                fontFamily: "Gabarito-Regular",
              }}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <AntDesign
                name={showPassword ? "eye" : "eyeo"}
                size={20}
                color="rgb(117, 141, 163)"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row w-full justify-center self-center p-5">
            <TouchableOpacity
              className="rounded-lg"
              style={{ backgroundColor: "rgb(117, 141, 163)", width: "35%" }}
              onPress={handleLogin}
            >
              <Text className="p-3 text-center text-white text-lg" style={{ fontFamily: "Gabarito-Regular" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row self-center items-center" style={{ marginTop: "-2%", marginBottom: "5%" }}>
            <View className="rounded-full" style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }} />
            <Text className="mx-2 text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>Or continue with</Text>
            <View className="rounded-full" style={{ width: "30%", borderWidth: 1, borderColor: "rgba(107,114,128,1)", height: 1 }} />
          </View>

          <View className="flex-row justify-evenly p-2">
            <SocialButton provider="google" icon={googleIcon} onPress={handleGoogleSignup} />
            <SocialButton provider="facebook" icon={facebookIcon} onPress={handleFacebookSignup} />
          </View>
          <TouchableOpacity className="self-center top-3" style={{ paddingBottom: "16.8%" }} onPress={() => navigation.replace("Signin")}>
            <Text className="mx-2 text-gray-500 underline" style={{ fontFamily: "Gabarito-Regular" }}>
              Sign in instead
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal isVisible={userExists} onBackButtonPress={() => setUserExists(false)} animationIn={"bounceIn"} animationOut={"bounceOut"}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center'
          }}>
            {userInfo && (
              <>
                <Image source={{ uri: userInfo.picture }} style={{ width: 80, height: 80, borderRadius: 40,borderWidth:1,borderColor:"rgba(107,114,128,0.5)" }} />
                <Text style={{ fontFamily:"Gabarito-SemiBold" }} className="text-2xl my-2">{userInfo.name}</Text>
                <Text style={{ fontFamily:"Gabarito-Medium" }} className="text-lg">{userInfo.email}</Text>
                <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-lg text-gray-500">You are already signed up. Please sign in instead.</Text>
                <TouchableOpacity
                  onPress={() => {
                    setUserExists(false);
                    navigation.replace('Signin');
                  }}
                  style={{
                    backgroundColor: 'rgb(117, 141, 163)',
                    borderRadius: 5,
                    padding: 10,
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Go to Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setUserExists(false)} style={{ marginTop: 10 }}>
                <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
    </KeyboardAvoidingView>
  );
}
