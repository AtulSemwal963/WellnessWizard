import React,{useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState } from '../../HelperComponents/GlobalState';
import {UserManager} from '../../HelperComponents/UtilityClasses/CloudServicesManager.js';
import Modal from 'react-native-modal';


export default function HomeScreen() {

  const [lastVisitedTab] = useGlobalState('lastVisitedTab');
  const [showComingSoonModal,setComingSoonModal]= useState(false);
  const navigation= useNavigation();
  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../../assets/fonts/Gabarito-Bold.ttf'),
  });

  const handleBackPress = () => {
    navigation.navigate(lastVisitedTab)
   console.log(lastVisitedTab)
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="bg-gray-300 w-full h-full">
 <SafeAreaView className="self-center flex-col items-center bg-gray-100 h-full w-full rounded-3xl" style={[styles.container]}>
      <View style={styles.header} className="w-full flex-row">
        <TouchableOpacity onPress={handleBackPress}>
        <AntDesign name="close" color="black" size={25} style={{margin:15}}/>
        </TouchableOpacity>
        <Text className="self-center text-xl text-center" style={{fontFamily:"Gabarito-SemiBold",width:"65%"}}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} className="w-full my-3">
        <TouchableOpacity
          className="w-full flex-row justify-between p-3 items-center"s
          onPress={() => setComingSoonModal(true)}>
          <Text className="text-gray-500 text-xl" style={{fontFamily:"Gabarito-Regular"}}>Upgrade to Unlimited</Text>
          <AntDesign name={"arrowright"} size={25} color={"black"}/>
        </TouchableOpacity>

        <TouchableOpacity  className="w-full flex-row justify-between p-3 items-center" onPress={() => navigation.navigate('ViewArchive')}>
          <Text className="text-gray-500 text-xl" style={{fontFamily:"Gabarito-Regular"}}>View Archive</Text>
          <AntDesign name={"arrowright"} size={25} color={"black"}/>
        </TouchableOpacity>

<TouchableOpacity
  className="w-full flex-row justify-between p-3 items-center"
  onPress={() => navigation.navigate('PersonalInformation')}>
  <Text className="text-gray-500 text-xl" style={{fontFamily:"Gabarito-Regular"}}>Personal Information</Text>
  <AntDesign name={"arrowright"} size={25} color={"black"}/>
</TouchableOpacity>

       <TouchableOpacity
          className="w-full flex-row justify-between p-3 items-center"
          onPress={() => navigation.navigate('TermsOfService')}>
          <Text className="text-gray-500 text-xl" style={{fontFamily:"Gabarito-Regular"}}>Terms of Service</Text>
          <AntDesign name={"arrowright"} size={25} color={"black"}/>
        </TouchableOpacity>

        <TouchableOpacity
        className="w-full flex-row justify-between p-3 items-center"
        onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text className="text-gray-500 text-xl" style={{fontFamily:"Gabarito-Regular"}}>Privacy Policy</Text>
        <AntDesign name={"arrowright"} size={25} color={"black"}/>
      </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={{width:"90%",marginBottom:"6%"}} className="flex-row w-full justify-center items-center bg-gray-200 rounded-lg" onPress={() => UserManager.handleSignOut(navigation)}>
                   <Text className="text-2xl font-semibold p-3 text-center" style={{"fontFamily":"Gabarito-SemiBold"}}>Sign out</Text> 
                   <Feather name="log-out" size={25} color="black" style={{transform:"rotate(180deg)"}}/>
                </TouchableOpacity>
    </SafeAreaView>
             <Modal
                    animationIn={"bounceIn"}
                    animationOut={"bounceOut"}
                    isVisible={showComingSoonModal}
                    onBackdropPress={() => setComingSoonModal(false)}
                  >
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
                    <Text className=" w-full text-xl font-semibold text-center  self-center " style={{"fontFamily":"Gabarito-SemiBold"}}>Coming Soon!</Text>
                    <Ionicons name="construct" size={54} color="#6b7280" style={{marginTop:"5%"}}/>
                      <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-xl text-gray-500 text-center" >This service is under active development. We'll try to have it up and running for you as soon as we can.</Text>
                      <View className="flex-row w-full justify-center">
                       <TouchableOpacity
                              onPress={() => {
                                setComingSoonModal(false)
                              }}
                              style={{
                                backgroundColor: 'rgba(117, 141, 163, 0.2)',
                                borderRadius: 5,
                                padding: 10,
                                width: '40%',
                                alignItems: 'center',
                              }}>
                              <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Ok</Text>
                            </TouchableOpacity>
                      </View>
                      
                    </View>
                  </Modal>
    </View>
   
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor:'rgb(243 244 246)',
      paddingHorizontal: 16,
      "width":"96%",
      "marginTop":"2%",
      borderBottomLeftRadius:0,
      borderBottomRightRadius:0
    },
    backButton: {
      position: 'absolute',
      left: 0,
    },
    backText: {
      fontSize: 24,
      color: '#333',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#008080', // Teal color for the header
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: '#e0f7fa', // Light cyan background for options
      borderRadius: 10,
      marginVertical: 5,
      paddingHorizontal: 10,
    },
    optionText: {
      fontSize: 16,
      color: '#00796b', // Dark teal for text
    },
    arrow: {
      fontSize: 18,
      color: '#00796b',
    },
    signOutButton: {
      backgroundColor: '#ff7043', // Vivid orange for sign out button
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 20,
      elevation: 5, // Add shadow for better appearance
    },
    signOutText: {
      fontSize: 16,
      color: '#ffffff',
    },
    upgradeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 20,
      textAlign: 'center',
      color: '#008080',
    },
    comparisonTable: {
      marginVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: '#ffffff', // White background for table
      borderRadius: 10,
      padding: 10,
      elevation: 5, // Add shadow for better appearance
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#e0f2f1', // Light teal background for header
      paddingVertical: 10,
      borderRadius: 10,
      marginBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: '#b2dfdb', // Subtle border color
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: '#f1f8e9', // Light green background for rows
      elevation: 3, // Add shadow for better appearance
    },
    feature: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#00796b',
      flex: 1,
    },
    free: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
      color: '#00796b',
    },
    paid: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
      color: '#00796b',
    },
    tick: {
      fontSize: 18,
      color: '#4caf50',
      textAlign: 'center',
      flex: 1,
    },
    cross: {
      fontSize: 18,
      color: '#f44336',
      textAlign: 'center',
      flex: 1,
    },
    subscriptionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 20,
      textAlign: 'center',
      color: '#008080',
    },
    subscriptionOption: {
      marginVertical: 10,
    },
    subscriptionButton: {
      backgroundColor: '#e0f2f1', // Light teal for subscription buttons
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      elevation: 3, // Add shadow for better appearance
    },
    subscriptionText: {
      fontSize: 16,
      color: '#00796b',
    },
  });
  