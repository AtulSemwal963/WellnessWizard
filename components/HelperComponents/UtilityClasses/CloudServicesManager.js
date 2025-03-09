import {
  initialize,
  getSdkStatus,
  SdkAvailabilityStatus,
  requestPermission,
  getGrantedPermissions,
  readRecords,
} from "react-native-health-connect";
import Auth0 from 'react-native-auth0';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

class HealthConnectManagerClass {
  initializeHealthConnect = async () => {
    try {
      const isInitialized = await initialize();
      console.log("HealthConnect initialization status:", isInitialized);
      return isInitialized === true;
    } catch (error) {
      console.error("Failed to initialize HealthConnect:", error);
      Alert.alert(
        "Health Connect Error",
        "Failed to initialize Health Connect. Please make sure Health Connect is installed and updated."
      );
      return false;
    }
  };

  checkAvailability = async () => {
    try {
      const status = await getSdkStatus();
      console.log("Health Connect SDK status:", status);
      
      if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
        Alert.alert(
          "Health Connect Required",
          "Please install or update Health Connect from the Google Play Store."
        );
        return false;
      }
      
      if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
        Alert.alert(
          "Update Required",
          "Please update Health Connect from the Google Play Store."
        );
        return false;
      }
      
      return status === SdkAvailabilityStatus.SDK_AVAILABLE;
    } catch (error) {
      console.error("Failed to check SDK status:", error);
      return false;
    }
  };

  requestPermissions = async () => {
    try {
      // First check if Health Connect is available
      const status = await getSdkStatus();
      console.log("Health Connect status:", status);
      
      if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
        Alert.alert(
          "Health Connect Required",
          "Please install Health Connect from the Google Play Store to use this feature."
        );
        return false;
      }

      // Define minimal permissions needed
      const requiredPermissions = [
        { accessType: "read", recordType: "Steps" },
        { accessType: "read", recordType: "TotalCaloriesBurned" }
      ];

      // Check existing permissions first
      try {
        const existingPermissions = await getGrantedPermissions();
        console.log("Existing permissions:", existingPermissions);
        
        // Check if we already have all required permissions
        const hasAllPermissions = requiredPermissions.every(required => 
          existingPermissions.some(granted => 
            granted.recordType === required.recordType && 
            granted.accessType === required.accessType
          )
        );
        
        if (hasAllPermissions) {
          console.log("All required permissions already granted");
          return true;
        }
      } catch (error) {
        console.log("Error checking existing permissions:", error);
      }

      console.log("Requesting permissions...");
      const permissions = await requestPermission(requiredPermissions);
      
      if (!permissions) {
        console.log("Permission request returned null");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Permission request error:", error);
      
      // Handle specific error cases
      if (error.message?.includes('RESOLUTION_NEEDED')) {
        Alert.alert(
          "Permissions Required",
          "Please grant Health Connect permissions in Settings."
        );
      } else if (error.message?.includes('Migration')) {
        Alert.alert(
          "Health Connect Update",
          "Health Connect is currently updating. Please try again later."
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to request Health Connect permissions. Please try again."
        );
      }
      return false;
    }
  };

  executeServiceInitialization = async () => {
    try {
      console.log("Starting Health Connect initialization...");
      
      // Initialize first
      const healthConnectInitialized = await this.initializeHealthConnect();
      if (!healthConnectInitialized) {
        console.log("Health Connect initialization failed");
        return false;
      }

      // Small delay as recommended
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check availability
      const sdkAvailable = await this.checkAvailability();
      if (!sdkAvailable) {
        console.log("Health Connect SDK not available");
        return false;
      }

      // Request permissions
      const permissionsGranted = await this.requestPermissions();
      return permissionsGranted;
    } catch (error) {
      console.error("Health Connect initialization error:", error);
      return false;
    }
  };

  getStepsData = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const timeRangeFilter = {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
        };

        const steps = await readRecords('Steps', { timeRangeFilter });
        if (!steps || !steps.records) {
            // console.error('No step records found');
            return -1;
        }
        
        const totalSteps = steps.records.reduce((sum, cur) => sum + cur.count, 0);
        console.log('Total steps today so far:', totalSteps);
        return totalSteps;
    } catch (error) {
        console.error('Error fetching step data:', error);
        return -1;
    }
};

getCaloriesData = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const { records } = await readRecords('TotalCaloriesBurned', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startOfDay.toISOString(),
                endTime: now.toISOString(),
            },
        });

        if (!records || records.length === 0) {
            // console.warn("No calorie records found.");
            return -1;
        }

        const inKilocalories = records[0].energy.inKilocalories;
        console.log('Retrieved inKilocalories:', inKilocalories);
        return inKilocalories;
    } catch (error) {
        console.error("Error fetching calorie data:", error);
        return -1;
    }
};
}

export const HealthConnectManager = new HealthConnectManagerClass();

class Auth0ManagerClass{
   auth0 = new Auth0({
    domain: "wellnesswizard.us.auth0.com",
    clientId: "CwsytdetT0gRgJE2v13GfSUnT2PJuu9C",
  });




handleGoogleSignin = async (setModalVisible, checkUserExists) => {
  try {
    const authResult = await this.auth0.webAuth.authorize({
      scope: 'openid profile email',
      connection: 'google-oauth2',
    });

    if (authResult.idToken) {
      const userInfo = await this.auth0.auth.userInfo({ token: authResult.accessToken });
      const { sub, email, name, picture } = userInfo;
      console.log('User Info:', userInfo);

      const userExists = await checkUserExists(sub);

      if (!userExists) {
        setModalVisible(true);
        return false; // Return false if user doesn't exist
      }

      // Store access token and user info in SecureStore
      await SecureStore.setItemAsync('accessToken', authResult.accessToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify({
        email: userInfo.email,
        name: userInfo.name,
        sub: userInfo.sub,
        picture: userInfo.picture,
      }));
      return true; // Return true on successful sign in
    }
    return false; // Return false if no idToken
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    Alert.alert(
      'Sign-in Error',
      'Failed to sign in with Google. Please try again.'
    );
    return false; // Return false on error
  }
};


  handleGoogleSignup = async (setUserInfo,setUserExists) => {
    try {
      const authResult = await this.auth0.webAuth.authorize({
        scope: 'openid profile email',
        connection: 'google-oauth2',
      });
  
      if (authResult.idToken) {
        const userInfo = await this.auth0.auth.userInfo({token: authResult.accessToken});
        setUserInfo(userInfo); // Set the userInfo in the component state
        
        const existingUser = await AsyncStorage.getItem('userInfo');
        if (existingUser) {
          const parsedUser = JSON.parse(existingUser);
          if (parsedUser.sub === userInfo.sub) {
            setUserExists(true);
            return null;
          }
        }
        
        return {
          accessToken: authResult.accessToken,
          userInfo: userInfo // Return both accessToken and userInfo
        };
      }
      return null;
    } catch (error) {
      console.error('Google Signup failed:', error);
      Alert.alert('Signup failed. Please try again.');
      return null;
    }
  };

  handleFacebookSignin = async (setModalVisible,checkUserExists) => {
    try {
      const authResult = await this.auth0.webAuth.authorize({
        scope: 'openid profile email',
        connection: 'facebook',
      });

      const userInfo = await this.auth0.auth.userInfo({ token: authResult.accessToken });
      console.log('User Info:', userInfo);

      const userExists = await checkUserExists(userInfo.sub);

      if (!userExists) {
        setModalVisible(true);
        return false; // Return false if user doesn't exist
      }

      // Store access token and user info in SecureStore
      await SecureStore.setItemAsync('accessToken', authResult.accessToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify({
        name: userInfo.name,
        sub:userInfo.sub,
        picture: userInfo.picture,
      }));
      
      return true; // Return true on successful sign in
    } catch (error) {
      console.error('Facebook Sign-in failed:', error);
      return false; // Return false on error
    }
  };

  handleFacebookSignup = async (setUserInfo, setUserExists) => {
    try {
      const authResult = await this.auth0.webAuth.authorize({
        scope: 'openid profile email',
        connection: 'facebook',
      });
  
      const userInfo = await this.auth0.auth.userInfo({ token: authResult.accessToken });
      console.log('Access Token:', authResult.accessToken);
      console.log('User Info:', userInfo);
  
      const existingUser = await AsyncStorage.getItem('userInfo');
  
      // Check if user already exists based on sub
      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);
        if (parsedUser.sub === userInfo.sub) {
          // User exists, set state and return
          setUserInfo(userInfo);
          setUserExists(true);
          return null;
        }
      }
  
      setUserInfo(userInfo);
      return {
        accessToken: authResult.accessToken,
        userInfo: userInfo
      };
  
    } catch (error) {
      console.error('Facebook Signup failed:', error);
      Alert.alert('Signup failed. Please try again.');
      return null;
    }
  };
}

export const Auth0Manager = new Auth0ManagerClass();

class UserManagerClass{

  handleLogin = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }

    Alert.alert('Login Successful', `Welcome ${email}`);
    return true;
  };

  handleSignOut = async (navigation) => {
    // Delete the access token from SecureStore
    await SecureStore.deleteItemAsync('accessToken');
    
    // Navigate to the LoginComponent screen
    navigation.navigate("LoginComponent");
  };

  checkUserExists = async (sub) => {
    const storedUserInfo = await AsyncStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      return userInfo.sub === sub; // Check if email matches
    }
    return false; // User does not exist
  };

  checkAccessToken = async (setInitialRoute) => {
    const token = await SecureStore.getItemAsync('accessToken');
    setInitialRoute(token ? 'AppNavigator' : 'LoginComponent');
  };

  fetchUserEmail = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setProfilePic(userInfo.email); // Set the profile picture if available
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };
  fetchUserFirstName = async (setUserFirstName) => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const firstName = userInfoString.name.split(" ")[0]; // Extract first name
        setUserFirstName(firstName);
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };
  fetchUserName = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setProfilePic(userInfo.name); // Set the profile picture if available
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };

  fetchUserProfilePicture = async (setProfilePic) => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setProfilePic(userInfo.picture); // Set the profile picture if available
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };

  fetchUserInfo = async (setUserInfo) => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  };
}

export const UserManager= new UserManagerClass();