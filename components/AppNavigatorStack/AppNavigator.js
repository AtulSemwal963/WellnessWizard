import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, Animated, Dimensions, Keyboard } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HealthConnectManager } from '../HelperComponents/UtilityClasses/CloudServicesManager';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import screens
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import WellnessPage from './WellnessPage';
import ChatPage from './ChatPage';
import UserAccountDrawer from './UserAccountDrawer';
import TermsOfServiceScreen from './ProfilePageStack/TermsOfServiceScreen';
import PrivacyPolicyScreen from './ProfilePageStack/PrivacyPolicyScreen';
import PersonalInformationForm from './ProfilePageStack/PersonalInformationForm';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const tabWidth = Dimensions.get('window').width / state.routes.length;
  const translateX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabBarWrapper}>
      <Animated.View style={[
        styles.tabBarIndicator,
        {
          transform: [{ translateX }],
          width: tabWidth * 0.6,
          left: tabWidth * 0.2,
        },
      ]} />
      <Animated.View style={[styles.tabBarContainer, {
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        }],
      }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = route.name === 'ProfileTab' ? 'Profile' : (options.tabBarLabel ?? route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = (routeName, color) => {
            const scale = fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, isFocused ? 1.2 : 1],
            });

            return (
              <Animated.View style={{ transform: [{ scale }] }}>
                {(() => {
                  switch (routeName) {
                    case 'Home':
                      return <Octicons name="home" size={24} color={color} />;
                    case 'Wellness':
                      return <AntDesign name="heart" size={24} color={color} />;
                    case 'Chat':
                      return <MaterialIcons name="chat-bubble-outline" size={24} color={color} />;
                    case 'ProfileTab':
                      return <Feather name="user" size={24} color={color} />;
                    default:
                      return null;
                  }
                })()}
              </Animated.View>
            );
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              {getIcon(route.name, isFocused ? '#000' : '#758DA3')}
              <Animated.Text style={[
                styles.tabLabel,
                { 
                  color: isFocused ? '#000' : '#758DA3',
                  transform: [{ 
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, isFocused ? 1.1 : 1],
                    })
                  }]
                }
              ]}>
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationForm} />
    </Stack.Navigator>
  );
}

function MainTabs({ route }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const message = route?.params?.message;

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Tab.Navigator
        tabBar={props => {
          if (isKeyboardVisible || props.state.index === 3) {
            return null;
          }
          return <CustomTabBar {...props} />;
        }}
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomePage}
          initialParams={{ message: message }}
        />
        <Tab.Screen name="Wellness" component={WellnessPage} />
        <Tab.Screen name="Chat" component={ChatPage} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
}

export default function AppNavigator({ route }) {
  const message = route?.params?.message;
  
  useEffect(() => {
    HealthConnectManager.executeServiceInitialization();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator 
        drawerContent={props => <UserAccountDrawer {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#fff',
            width: '80%',
          }
        }}
      >
        <Drawer.Screen
          name="MainTabs"
          component={MainTabs}
          initialParams={{ message: message }}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    height: 65,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  tabBarIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 3,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontFamily: 'Gabarito-SemiBold',
    fontSize: 12,
    marginTop: 4,
  },
});