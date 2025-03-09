import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import * as SecureStore from 'expo-secure-store';
import {UserManager} from "../HelperComponents/UtilityClasses/CloudServicesManager.js";
const userProfilePlaceholder = require('../../assets/images/userProfilePic.png');

export default function UserAccountDrawer({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
  });

  useEffect(() => {
    UserManager.fetchUserInfo(setUserInfo);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  // If data is loading, show an activity indicator
  if (!userInfo) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  const profilePicSource = userInfo.picture ? { uri: userInfo.picture } : userProfilePlaceholder;

  return (
    <>
      {/* Blurred background based on profile picture */}
      <ImageBackground
        className="w-full"
        style={[styles.containerStyle, styles.blur]}
        source={profilePicSource}
      >
        <BlurView
          style={styles.containerStyle}
          blurType="light"
          blurAmount={100}  // Reduced blur for a softer effect
          reducedTransparencyFallbackColor="white"
        />
      </ImageBackground>

      {/* User's profile picture with fallback */}
      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={profilePicSource} />
      </View>
      
      {/* <Text
        className="text-base text-center bg-gray-300 self-center p-1 rounded-full"
        style={{
          fontFamily: "Gabarito-Medium",
          width: "24%",
          marginTop: "-10%",
          borderWidth: 1,
          borderColor: "green"
        }}
      >
        Free
      </Text> */}

      {/* User's name and email */}
      <View style={styles.textContainer}>
        <Text style={styles.userName} className="text-xl">{userInfo.name || 'John Doe'}</Text>
        <Text style={styles.userEmail} className="text-lg">{userInfo.email || 'john@example.com'}</Text>
      </View>

      {/* Navigation Options */}
      <View style={{ marginTop: "10%" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'ProfileTab',
              params: { screen: 'PersonalInformation' }
            });
          }}
          className="p-3"
          style={{ borderBottomWidth: 0.4, borderColor: "#6b7280" }}
        >
          <Text className="text-xl text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>
            Personal Information
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'ProfileTab',
              params: { screen: 'TermsOfService' }
            });
          }}
          className="p-3"
          style={{ borderBottomWidth: 0.4, borderColor: "#6b7280" }}
        >
          <Text className="text-xl text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>
            Terms of Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'ProfileTab',
              params: { screen: 'PrivacyPolicy' }
            });
          }}
          className="p-3"
          style={{ borderBottomWidth: 0.4, borderColor: "#6b7280" }}
        >
          <Text className="text-xl text-gray-500" style={{ fontFamily: "Gabarito-Regular" }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign-out Button */}
      <TouchableOpacity
        style={{ width: "90%", marginTop: "90%" }}
        className="self-center flex-row w-full justify-center items-center bg-gray-200 rounded-lg"
        onPress={() => UserManager.handleSignOut(navigation)}
      >
        <Text className="text-2xl font-semibold p-3 text-center" style={{ fontFamily: "Gabarito-SemiBold" }}>
          Sign out
        </Text>
        <Feather name="log-out" size={25} color="black" style={{ transform: "rotate(180deg)" }} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: "40%"
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: "15%",
    borderRadius: 65,
    overflow: 'hidden',
    width: 110,
    height: 110,
    
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 9999 ,borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)',
          overflow: 'hidden'
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  userName: {
    fontFamily: "Gabarito-SemiBold",
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: "Gabarito-Medium"
  },
});
