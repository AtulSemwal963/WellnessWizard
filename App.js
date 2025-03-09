import './gesture-handler.native.js';
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Auth0Provider } from 'react-native-auth0';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
// import SplashScreen from 'react-native-splash-screen';

import LoginComponent from './components/OnboardingStack/LoginComponent';
import QuestionnaireComponent from './components/OnboardingStack/QuestionnaireComponent';
import Signup from './components/OnboardingStack/Signup';
import Signin from './components/OnboardingStack/Signin';
import AppNavigator from './components/AppNavigatorStack/AppNavigator';
import SearchGlossary from './components/AppNavigatorStack/ExploreStack/SearchGlossary';
import DiseaseDetails from './components/AppNavigatorStack/ExploreStack/DiseaseDetails';
import QuickCheckup from './components/AppNavigatorStack/ExploreStack/QuickCheckup';
import TermsOfServiceScreen from './components/AppNavigatorStack/ProfilePageStack/TermsOfServiceScreen';
import PrivacyPolicyScreen from './components/AppNavigatorStack/ProfilePageStack/PrivacyPolicyScreen';
import PersonalInformationForm from './components/AppNavigatorStack/ProfilePageStack/PersonalInformationForm';
import TrackerChart from './components/AppNavigatorStack/WellnessTrackers&Mobility/TrackerChart';
import "./global.css";
import { UserManager } from './components/HelperComponents/UtilityClasses/CloudServicesManager';
import { PersonalInformationManager,WellnessTrackersManager } from './components/HelperComponents/UtilityClasses/LocalDatabaseManagers';
import { setGlobalState, useGlobalState } from './components/HelperComponents/GlobalState';
const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('LoginComponent');
  const [loading, setLoading] = useState(true);

  const [loaded] = useFonts({
    'Gabarito-Regular': require('./assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('./assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('./assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('./assets/fonts/Gabarito-Bold.ttf'),
  });
  const [personalInformationRealmInstance, setPersonalInformationRealmInstance] = useGlobalState('personalInformationRealmInstance');
  const [wellnessTrackersRealmInstance, setWellnessTrackersRealmInstance] = useGlobalState('wellnessTrackersRealmInstance');
  
  useEffect(() => {
    const openRealms = async () => {
       return WellnessTrackersManager.initializeWellnessTrackersRealm(setWellnessTrackersRealmInstance) &&
      PersonalInformationManager.initializePersonalInformationRealm(setPersonalInformationRealmInstance);
    };
  
//     const startServices=async()=>{
//  const realmsOpened = await openRealms();
//     if (!realmsOpened) return;
//     HealthConnectManager.executeServiceIntialization()
//     }
//     startServices();
openRealms();
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
      await UserManager.checkAccessToken(setInitialRoute);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (!loaded || loading) {
    return null; // Or a loading spinner can be displayed here
  }

  const isExpo = Constants.appOwnership === 'expo';
  const safeAreaStyle = !isExpo ? { marginTop: Constants.statusBarHeight } : {};

    //console.log("ISEXPO="+Constants.appOwnership);
  return (
    <Auth0Provider domain={"wellnesswizard.us.auth0.com"} clientId={"CwsytdetT0gRgJE2v13GfSUnT2PJuu9C"}>
      <SafeAreaProvider style={{marginTop: 0}}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName={initialRoute}
            screenOptions={{
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen 
              name="AppNavigator" 
              component={AppNavigator} 
              options={{ 
                animation: "slide_from_left", 
                headerShown: false 
              }} 
            />
            <Stack.Screen name="LoginComponent" component={LoginComponent} options={{ headerShown: false }} />
            <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false, animation: "slide_from_bottom" }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false, animation: "slide_from_bottom" }} />
            <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="QuestionnaireComponent" component={QuestionnaireComponent} options={{ headerShown: false }} />
            <Stack.Screen name="SearchGlossary" component={SearchGlossary} options={{ headerShown: false }} />
            <Stack.Screen name="DiseaseDetails" component={DiseaseDetails} options={{ headerShown: false }} />
            <Stack.Screen name="QuickCheckup" component={QuickCheckup} options={{ headerShown: false }} />
            <Stack.Screen name="TrackerChart" component={TrackerChart} options={{ headerShown: false }} />
            <Stack.Screen name="PersonalInformationForm" component={PersonalInformationForm} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Auth0Provider>
  );
}
 
