import { useNavigation,useFocusEffect } from '@react-navigation/native';
import React,{useEffect,useState} from 'react';
import Modal from 'react-native-modal'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet,View,Image,BackHandler } from 'react-native';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import logo from '../../../assets/images/logo.png';

const TermsOfServiceScreen = ({route}) => {
  const isOnboarding = route?.params?.isOnboarding || false;
  
  const navigation= useNavigation();

  const [isBackModalVisible, setBackModalVisible] = useState(false);
  const [isDisagreeModalVisible, setDisagreeModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isOnboarding) {
          setBackModalVisible(true);
          return true;
        } else {
          navigation.navigate('AppNavigator',{screen:'HomeScreen'});
          return true;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  const handleAgree = async () => {
    // Safely access route params
    const { accessToken, userInfo } = route.params || {};
  
    if (!accessToken || !userInfo) {
      console.error("Missing accessToken or userInfo. Cannot proceed.");
      return; // Early exit if essential data is missing
    }
  
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      await SecureStore.setItemAsync('accessToken', accessToken);
      
      // Reset the navigation to QuestionnaireComponent
      navigation.reset({
        index: 0,
        routes: [{ name: 'PersonalInformationForm',
          params:{
            isOnboarding:isOnboarding
          }
         }],
      });
    } catch (error) {
      console.error("Error saving data", error);
      // Optionally: Notify the user about the error
      Alert.alert("Error", "Failed to save your information. Please try again.");
    }
  };

  return (
    <View className="bg-gray-300 w-full h-full">
       <SafeAreaView style={styles.container} className="self-center flex-col items-center bg-gray-100 h-full w-full rounded-3xl">
        <View className="flex-col items-center w-full " style={{marginBottom:5}}>
          <View style={[styles.header,{width:"100%"}]} className="w-full flex-row justify-center">
            {!isOnboarding && <TouchableOpacity onPress={()=>navigation.goBack()}>
        <AntDesign name={"arrowleft"} size={25} color={"black"}/>
        </TouchableOpacity>} 
        <View className="flex-col" style={{width:"85%"}}>
          <Text className="self-center text-xl text-center" style={{fontFamily:"Gabarito-SemiBold"}}>Terms of Service</Text> 
          <Text className="text-md text-gray-500 text-center" style={{fontFamily:"Gabarito-Regular"}}>Last Updated: August 2024</Text>
          </View>  
      </View>
        </View> 
         <ScrollView contentContainerStyle={styles.scrollViewContent}>
         <Image source={logo} className="h-36 w-36 rounded-2xl self-center top-4 bg-gray-500" style={{marginBottom:'3%',elevation:10,borderWidth:1,borderColor:'rgba(107,114,128,0.5)',shadowOffset: {
                width: 10,
                height: 10,
              },
              }}/>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to [App Name]! These Terms of Service outline the rules and regulations for the use of our application.
          By accessing this app, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use our app.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          Users are responsible for providing accurate information, maintaining account security, and adhering to all guidelines and rules provided by the app. Prohibited conduct includes, but is not limited to, unauthorized use, harassment, and data manipulation.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacy and Data Collection</Text>
        <Text style={styles.paragraph}>
          We collect personal data to provide better services. This includes but is not limited to your name, contact information, and health data. We are committed to ensuring the security of your data and will not share your information with third parties without your consent.
        </Text>

        <Text style={styles.sectionTitle}>4. App Features and Functionality</Text>
        <Text style={styles.paragraph}>
          The app offers various health-related features, including diagnostic tools, health monitoring, and more. However, these features are not a substitute for professional medical advice.
        </Text>

        <Text style={styles.sectionTitle}>5. Third-Party Links and Services</Text>
        <Text style={styles.paragraph}>
          Our app may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party websites or services.
        </Text>

        <Text style={styles.sectionTitle}>6. Payments and Subscriptions</Text>
        <Text style={styles.paragraph}>
          Details about pricing, billing cycles, and cancellation policies. Users can choose from various subscription plans that best suit their needs.
        </Text>

        <Text style={styles.sectionTitle}>7. User Rights</Text>
        <Text style={styles.paragraph}>
          Users have the right to access, correct, and delete their personal information. Users can also opt-out of receiving communications from us at any time.
        </Text>

        <Text style={styles.sectionTitle}>8. Dispute Resolution</Text>
        <Text style={styles.paragraph}>
          In the event of a dispute, users agree to resolve the matter through arbitration under the governing law of [Your Region/Country].
        </Text>

        <Text style={styles.sectionTitle}>9. Modifications to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms from time to time. Users will be notified of any changes, and continued use of the app will constitute acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Information</Text>
        <Text style={styles.paragraph}>
          For any questions or concerns regarding these terms, please contact our customer support team at support@example.com.
        </Text>

        <Text style={styles.agreement}>
          By using this app, you confirm that you {isOnboarding?"agree":"have agreed"} to these Terms of Service.
        </Text>
        {
          isOnboarding && <View className="flex-row w-full justify-between self-center p-5">
          <TouchableOpacity className="rounded-lg" style={{"backgroundColor":"rgba(117, 141, 163, 0.2)",width:"35%"}} onPress={()=>setDisagreeModalVisible(true)}>
  <Text className="p-3 text-center text-lg" style={{fontFamily:"Gabarito-Regular"}}>I Disagree</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg" style={{"backgroundColor":"rgb(117, 141, 163)",width:"35%"}} onPress={handleAgree}>
              <Text className="p-3 text-center text-lg text-white" style={{fontFamily:"Gabarito-Regular"}}>I Agree</Text>
          </TouchableOpacity>
         </View>
        }
      </ScrollView>
    </SafeAreaView>
     {/* Back Button Modal */}
     <Modal
      animationIn={"bounceIn"}
      animationOut={"bounceOut"}
  isVisible={isBackModalVisible}
  onBackdropPress={() => setBackModalVisible(false)}
>
  <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-xl text-gray-500 text-center" >Are you sure you want to cancel your Signup?</Text>
          <View className="flex-row w-full justify-between">
           <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('LoginComponent'); // Or whichever screen you want to go back to
                    setBackModalVisible(false);
                  }}
                  style={{
                    backgroundColor: 'rgba(117, 141, 163, 0.2)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setBackModalVisible(false)}  style={{
                    backgroundColor: 'rgb(117, 141, 163)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                <Text style={{ color: 'white',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Cancel</Text>
                </TouchableOpacity> 
          </View>
          
        </View>
</Modal>

      {/* Disagree Modal */}
      <Modal
        animationIn={"bounceIn"}
        animationOut={"bounceOut"}
        isVisible={isDisagreeModalVisible}
        onBackdropPress={() => setDisagreeModalVisible(false)}
      >
        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-xl text-gray-500 text-center" >Are you sure you want to disagree? This will cancel the signup.</Text>
          <View className="flex-row w-full justify-between">
           <TouchableOpacity
                  onPress={() => {
                    setDisagreeModalVisible(false);
                    navigation.navigate('LoginComponent');
                  }}
                  style={{
                    backgroundColor: 'rgba(117, 141, 163, 0.2)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDisagreeModalVisible(false)}  style={{
                    backgroundColor: 'rgb(117, 141, 163)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                <Text style={{ color: 'white',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Cancel</Text>
                </TouchableOpacity> 
          </View>
          
        </View>
      </Modal>
    </View>
   
  );
};

export default TermsOfServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    width:"96%",
    marginTop:"2%",
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0
  },
  scrollViewContent: {
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#343a40',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
    fontFamily:"Gabarito-SemiBold"
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#495057',
    fontFamily:"Gabarito-Regular"
  },
  agreement: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    fontFamily:"Gabarito-SemiBold"
  },
});
