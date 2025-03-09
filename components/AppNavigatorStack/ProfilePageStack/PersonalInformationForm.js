import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Realm from 'realm';
import MedicalSummary from './PersonalInfomationStack/MedicalSummary';
import FirstRoute from './PersonalInfomationStack/FirstRoute';
import SecondRoute from './PersonalInfomationStack/SecondRoute';
import ThirdRoute from './PersonalInfomationStack/ThirdRoute';
import FourthRoute from './PersonalInfomationStack/FourthRoute';
import FifthRoute from './PersonalInfomationStack/FifthRoute';
import { useGlobalState } from '../../HelperComponents/PersonalInformationGlobalState';
import {useGlobalState as openGlobalRealm} from '../../HelperComponents/GlobalState';
import { PersonalInformationManager } from '../../HelperComponents/UtilityClasses/LocalDatabaseManagers';
const Stack = createNativeStackNavigator();

const Form = ({ realm,navigation,isOnboarding }) => {
  const [loading, setLoading] = useState(true);
const [age, setAge] = useGlobalState("age");
const [gender, setGender] = useGlobalState("gender");
const [height, setHeight] = useGlobalState("height");
const [heightUnit, setHeightUnit] = useGlobalState("heightUnit");
const [weight, setWeight] = useGlobalState("weight");
const [weightUnit, setWeightUnit] = useGlobalState("weightUnit");
const [bloodGroup, setBloodGroup] = useGlobalState("bloodGroup");
const [allergies, setAllergies] = useGlobalState("allergies");
const [medConditions, setMedConditions] = useGlobalState("medConditions");
const [medications, setMedications] = useGlobalState("medications");
const [familyHistory, setFamilyHistory] = useGlobalState("familyHistory");
const [hadVaccine, setHadVaccine] = useGlobalState("hadVaccine");
const [lastVaccinated, setLastVaccinated] = useGlobalState("lastVaccinated");
const [vaccineDescription, setVaccineDescription] = useGlobalState("vaccineDescription");
const [dietaryPreference, setDietaryPreference] = useGlobalState("dietaryPreference");
const [exerciseRoutine, setExerciseRoutine] = useGlobalState("exerciseRoutine");
const [didSmoke, setDidSmoke] = useGlobalState("didSmoke");
const [smokingFrequency, setSmokingFrequency] = useGlobalState("smokingFrequency");
const [didDrink, setDidDrink] = useGlobalState("didDrink");
const [drinkingFrequency, setDrinkingFrequency] = useGlobalState("drinkingFrequency");
const [sleepTime, setSleepTime] = useGlobalState("sleepTime");
const [workTime, setWorkTime] = useGlobalState("workTime");

useEffect(() => {
  //loadFromRealm();
  PersonalInformationManager.loadFromPersonalInformationRealm(realm,{
    setAge,setGender,setHeight,setHeightUnit,setWeight,setWeightUnit,setBloodGroup,setAllergies,setMedConditions,setMedications,setFamilyHistory,setDietaryPreference,setHadVaccine,setLastVaccinated,setVaccineDescription,setExerciseRoutine,setDidSmoke,setSmokingFrequency,setDidDrink,setDrinkingFrequency,setSleepTime,setWorkTime})
    setLoading(false);
}, []);

if (loading) {
  return (
      <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
      </View>
  );
}

  return(
    <ScrollView className="bg-gray-50">
    <FirstRoute realm={realm} />
    <SecondRoute realm={realm} />
    <ThirdRoute realm={realm} />
    <FourthRoute realm={realm} />
    <FifthRoute realm={realm} />
    <View className="flex-row justify-between self-center" style={{width:"80%"}}>
    <TouchableOpacity 
      className="rounded-lg" 
      style={{"backgroundColor":"rgb(117, 141, 163)",width:"35%"}} 
      onPress={() => {
        PersonalInformationManager.saveToRealm(
          realm,
          age,gender,height,heightUnit,weight,weightUnit,
          bloodGroup,allergies,medConditions,medications,
          familyHistory,hadVaccine,lastVaccinated,
          vaccineDescription,dietaryPreference,exerciseRoutine,
          didSmoke,smokingFrequency,didDrink,drinkingFrequency,
          sleepTime,workTime
        );
        if (isOnboarding) {
          navigation.navigate("QuestionnaireComponent");
        } else {
          // Use replace instead of navigate for stack navigation
          navigation.goBack();
        }
      }}>
      <Text className="text-xl p-3 text-center" style={{fontFamily:"Gabarito-SemiBold",color:"white"}}>
        {isOnboarding ? "Proceed" : "Save"}
      </Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      className="rounded-lg" 
      style={{"backgroundColor":"#e5e7eb",width:"35%"}} 
      onPress={() => {
        if (isOnboarding) {
          navigation.navigate("QuestionnaireComponent");
        } else {
          // Use replace instead of navigate for stack navigation
          navigation.navigate("MedicalSummary");
        }
      }}>
      <Text className="text-xl p-3 text-center" style={{fontFamily:"Gabarito-SemiBold",color:"black"}}>
        {isOnboarding ? "Skip" : "Back"}
      </Text>
    </TouchableOpacity>
    </View>
    <Text className="text-gray-500 text-lg text-center mt-4" style={{fontFamily:'Gabarito-Regular'}}>
                      You can always update your information later even if you skip right now.
                  </Text>
  </ScrollView>
  )
 
};

export default function PersonalInformationForm({ navigation,route }) {

  const [realm, setRealm] = openGlobalRealm("personalInformationRealmInstance");
  const isOnboarding = route?.params?.isOnboarding;
  // Define the MedicalSummaryScreen properly
  const MedicalSummaryScreen = () => <MedicalSummary realm={realm} />;
  const FormScreen = () => <Form realm={realm} navigation={navigation} isOnboarding={isOnboarding}/>;

  return (
    <View style={{ flex: 1 }} className="bg-gray-300 w-full h-full">
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#f8f9fa',
          padding: 20,
          width: '96%',
          marginTop: '2%',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        className="self-center flex-col bg-gray-100 h-full w-full rounded-3xl"
      >
        <View style={styles.header}>
          {
            isOnboarding?null:(
<TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color="black" />
          </TouchableOpacity>
            )
          }
          
          <Text style={styles.headerText}>{isOnboarding?"Enter Your Medical Information":"Personal Information"}</Text>
        </View>

        <Stack.Navigator
          initialRouteName={isOnboarding ? "Form" : "MedicalSummary"}
          screenOptions={{
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen
            name="MedicalSummary"
            component={MedicalSummaryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Form"
            component={FormScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "96%",
    marginTop: "2%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontFamily:"Gabarito-SemiBold",
    textAlign: 'center',
    flex: 1,
  },
  tabContainer: {
    flex: 1,
    padding: 16,
    zIndex:100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  addPhotoText: {
    color: '#9e9e9e',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  inputLeft: {
    flex: 1,
    marginRight: 8,
  },
  inputRight: {
    flex: 1,
  },
  inputNumber: {
    flex: 2,
  },
  datePlaceholder: {
    lineHeight: 40,
  },
  contactRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  navButton: {
    backgroundColor: 'rgb(117, 141, 163)',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,

  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:"Gabarito-Medium"
  },
  previousButton: {
    backgroundColor: '#6c757d',
  },
  reviewText: {
    fontSize: 16,
    marginVertical: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

