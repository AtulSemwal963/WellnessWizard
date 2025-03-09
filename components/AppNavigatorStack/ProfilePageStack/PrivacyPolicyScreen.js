import { useNavigation,useFocusEffect } from '@react-navigation/native';
import React,{useState} from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet,View,Image,BackHandler } from 'react-native';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import logo from '../../../assets/images/logo.png';

const PrivacyPolicyScreen = ({route}) => {
  const isOnboarding = route?.params?.isOnboarding || false;
  const navigation = useNavigation();

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

  const handleAgree = () => {
    // Retrieve userInfo from route parameters
    const userInfo = route?.params?.userInfo;
    
    // Ensure userInfo is defined
    if (!userInfo) {
      console.warn("User info is not available. Cannot proceed to Terms of Service.");
      return;
    }
  
    // Extract sub and perform necessary checks
    console.log("SUB: "+userInfo.sub)
    const { sub, email, name, picture } = userInfo;
    const isGoogleUser = sub?.startsWith('google');
    const isFacebookUser = sub?.startsWith('facebook');
  
    if (isGoogleUser) {
      // Navigate to Terms of Service for Google users
      navigation.navigate('TermsOfServiceScreen', {
        userInfo: {
          email, // Include email for Google users
          name,
          picture,
          sub
        },
        accessToken: route?.params?.accessToken, // Ensure accessToken is passed from route params
        isOnboarding: true,
      });
    } else if (isFacebookUser) {
      // Navigate to Terms of Service for Facebook users
      navigation.navigate('TermsOfServiceScreen', {
        userInfo: {
          name,
          picture,
          sub // Optionally include sub for Facebook users
        },
        accessToken: route?.params?.accessToken, // Ensure accessToken is passed from route params
        isOnboarding: true,
      });
    } else {
      // Handle cases where the provider is unknown
      console.warn('Unknown provider. Unable to navigate to Terms of Service.');
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
          <Text className="self-center text-xl text-center" style={{fontFamily:"Gabarito-SemiBold"}}>Privacy Policy</Text>
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
       
       <Text style={styles.sectionTitle}>Introduction</Text>
       <Text style={styles.text}>
         Welcome to Wellness Wizard. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app. We are committed to protecting your privacy and ensuring that your personal and medical information is handled securely.
       </Text>

       <Text style={styles.sectionTitle}>Information We Collect</Text>
       <Text style={styles.text}>
         <Text style={{color:"black"}}>Personal Information:</Text>We collect personal details such as your name, contact information, and other identifying details.
         {"\n"}<Text style={{color:"black"}}>Medical Information:</Text>We collect your health data, medical history, and related information.
         {"\n"}<Text style={{color:"black"}}>Usage Data:</Text>We gather information about your app usage, device information, and more.
         {"\n"}<Text style={{color:"black"}}>Cookies and Tracking Technologies:</Text>We use cookies to track your app usage and preferences.
       </Text>

       <Text style={styles.sectionTitle}>How We Use Your Information</Text>
       <Text style={styles.text}>
       <Text style={{color:"black"}}>To Provide and Improve Services:</Text>Your information helps us personalize your experience and provide accurate AI-driven health insights.
         {"\n"}<Text style={{color:"black"}}>Communication:</Text>We use your data to send you updates and promotional content, if you consent.
         {"\n"}<Text style={{color:"black"}}>Analytics and Research:</Text>Data is analyzed to enhance our app’s features and health outcomes.
         {"\n"}<Text style={{color:"black"}}>Legal Compliance:</Text>We may use your information to comply with legal obligations.
       </Text>

       <Text style={styles.sectionTitle}>How We Share Your Information</Text>
       <Text style={styles.text}>
       <Text style={{color:"black"}}>With Third-Party Service Providers:</Text>We share data with partners who assist in providing the app’s services.
         {"\n"}<Text style={{color:"black"}}>With Healthcare Providers:</Text>Your data may be shared with authorized medical professionals, with your consent.
         {"\n"}<Text style={{color:"black"}}>For Legal Reasons:</Text>Information may be disclosed to comply with laws or legal requests.
       </Text>

       <Text style={styles.sectionTitle}>Data Security</Text>
       <Text style={styles.text}>
         We implement robust security measures, including encryption and secure servers, to protect your information. We also encourage you to safeguard your account details.
       </Text>

       <Text style={styles.sectionTitle}>User Rights</Text>
       <Text style={styles.text}>
       <Text style={{color:"black"}}>Access and Correction:</Text>You have the right to access and update your information.
         {"\n"}<Text style={{color:"black"}}>Data Portability:</Text>Request a copy of your data.
         {"\n"}<Text style={{color:"black"}}>Deletion of Data:</Text>Request the deletion of your data.
         {"\n"}<Text style={{color:"black"}}>Opt-Out Options:</Text>You can opt-out of certain data collection or usage.
       </Text>

       <Text style={styles.sectionTitle}>Children’s Privacy</Text>
       <Text style={styles.text}>
         Wellness Wizard takes special care to protect the privacy of users under 18. For users under 13, parental consent is required to use the app.
       </Text>

       <Text style={styles.sectionTitle}>International Data Transfers</Text>
       <Text style={styles.text}>
         Your information may be transferred to, and maintained on, computers located outside of your state or country. We comply with relevant regulations like GDPR and HIPAA.
       </Text>

       <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
      <Text style={styles.text}>
         We may update this Privacy Policy periodically. We will notify you of any changes by updating the "Last Updated" date at the top of this page. Your continued use of the app indicates your acceptance of the revised policy.
       </Text>

      <Text style={styles.sectionTitle}>Contact Information</Text>
      <Text style={styles.text}>
         If you have any questions or concerns about this Privacy Policy, please contact us at <Text style={{color:"black",fontFamily:"Gabarito-Bold"}}>support@wellnesswizard.ai</Text>.
      </Text>
      {
          isOnboarding && <View className="flex-row w-full justify-between self-center p-5">
          <TouchableOpacity className="rounded-lg" style={{"backgroundColor":"rgba(117, 141, 163, 0.2)",width:"35%"}} onPress={() => setDisagreeModalVisible(true)}>
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

export default PrivacyPolicyScreen;

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
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#495057',
    fontFamily:"Gabarito-Regular",
      },
});

