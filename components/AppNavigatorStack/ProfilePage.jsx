import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';


import PersonalInformationForm from './ProfilePageStack/PersonalInformationForm';
import TermsOfServiceScreen from './ProfilePageStack/TermsOfServiceScreen';
import PrivacyPolicyScreen from './ProfilePageStack/PrivacyPolicyScreen';
import HomeScreen from './ProfilePageStack/HomeScreen';
import UpgradeScreen from './ProfilePageStack/UpgradeScreen';
import ViewArchiveScreen from "./ProfilePageStack/ViewArchiveScreen";
import ArchivedChat from './ProfilePageStack/ViewArchiveStack/ArchivedChat';

const Stack = createNativeStackNavigator();

export default function ProfilePage() {

  return (
    <View className="h-full w-full bg-gray-100">
      <Stack.Navigator initialRouteName="ProfileHome" >
        <Stack.Screen name="ProfileHome" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Upgrade" component={UpgradeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PersonalInformation" component={PersonalInformationForm} options={{ headerShown: false }}/>
         <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="ViewArchive" component={ViewArchiveScreen} options={{ headerShown: false }} />
         <Stack.Screen name="ArchivedChat" component={ArchivedChat} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </View>
      
  );
}
