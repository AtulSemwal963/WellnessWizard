
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Platform,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { PersonalInformationManager } from '../../../HelperComponents/UtilityClasses/LocalDatabaseManagers';
import {UserManager} from "../../../HelperComponents/UtilityClasses/CloudServicesManager.js";

export default function MedicalSummary ({realm}) {
 const navigation= useNavigation();
   const [userInfo, setUserInfo] = useState(null);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState(0);
  const [heightUnit, setHeightUnit] = useState("");
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [medConditions, setMedConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [hadVaccine, setHadVaccine] = useState(null);
  const [lastVaccinated, setLastVaccinated] = useState("");
  const [vaccineDescription, setVaccineDescription] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState([]);
  const [exerciseRoutine, setExerciseRoutine] = useState("");
  const [didSmoke, setDidSmoke] = useState(null);
  const [smokingFrequency, setSmokingFrequency] = useState("");
  const [didDrink, setDidDrink] = useState(null);
  const [drinkingFrequency, setDrinkingFrequency] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [workTime, setWorkTime] = useState("");
  
  useEffect(() => {
    UserManager.fetchUserInfo(setUserInfo);
  }, []);

    useEffect(() => {
      if (!realm) return;
        PersonalInformationManager.loadFromPersonalInformationRealm(realm,{
          setAge,setGender,setHeight,setHeightUnit,setWeight,setWeightUnit,setBloodGroup,setAllergies,setMedConditions,setMedications,setFamilyHistory,setDietaryPreference,setHadVaccine,setLastVaccinated,setVaccineDescription,setExerciseRoutine,setDidSmoke,setSmokingFrequency,setDidDrink,setDrinkingFrequency,setSleepTime,setWorkTime})
    }, [realm]);

    if (!userInfo) {
      return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
    }

    const profilePicSource = userInfo.picture ? { uri: userInfo.picture } : userProfilePlaceholder;

    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
            <View className="flex-row justify-between">
               <Text style={{ fontFamily: "Gabarito-SemiBold", fontSize: 22 }}>Medical Summary</Text>
               <TouchableOpacity onPress={()=>navigation.navigate('Form')} className="rounded-md flex-row items-center" style={{marginLeft:"13%",backgroundColor:"rgb(117, 141, 163)",width:"20%"}}>
                         <Text className="text-lg font-semibold text-center w-full" style={{"fontFamily":"Gabarito-SemiBold",paddingVertical:"9%",color:"white"}}>Edit</Text>
                        </TouchableOpacity> 
            </View>
            
            <View className="flex-col w-full">
            <View className="w-full flex-row top-3 self-center">
            <View style={{   

    borderRadius: 10,
    overflow: 'hidden',
    width: 90,
    height: 90,}}>
                    <Image style={{    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15 ,borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)',
          overflow: 'hidden'
          }} source={profilePicSource} />
                  </View>
                  <View className="flex-col mx-5" style={{width:"60%"}}>
                    <View className="flex-row w-full justify-between items-center">
                      <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Name</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl">{userInfo.name || 'John Doe'}</Text>   
                    </View>  
                    <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Age</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl">{age==0?'-/-':age}</Text>   
                    </View> 
                    </View>
                    <View className="flex-row w-full justify-between top-3">
                      <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Gender</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl">{gender.length==0?'-/-':gender}</Text>   
                    </View>  
                    <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Date of Birth</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl">6/9/2003</Text>   
                    </View> 
                    </View>
                    </View>
                    
            </View>

            <View className="flex-row w-full justify-between " style={{marginTop:"10%"}}>
                      <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Height</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl">{height==0 && heightUnit.length==0?"-/-":height+" "+heightUnit}</Text>   
                    </View>  
                    <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Weight</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl">{weight==0 && weightUnit.length==0?"-/-":weight+" "+weightUnit}</Text>   
                    </View> 
                    <View className="flex-col">
                        <Text className="text-gray-500" style={{fontFamily:"Gabarito-Regular"}}>Blood Group</Text>
                     <Text style={{fontFamily: "Gabarito-SemiBold"}} className="text-2xl self-center">{bloodGroup.length==0?"-/-":bloodGroup}</Text>   
                    </View> 
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Allergies</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
        {allergies.length==0?
         <View  style={{ margin: 3,
          padding: 10,
          borderRadius: 5,}} className="bg-gray-200">
          <Text style={{fontFamily:"Gabarito-Regular"}}>None</Text>
        </View>
        :allergies.map((allergy, index) => (
          <View key={index} style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{allergy}</Text>
          </View>
        ))}
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Medical Conditons (Past/Present)</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
        {medConditions.length==0?
         <View  style={{ margin: 3,
          padding: 10,
          borderRadius: 5,}} className="bg-gray-200">
          <Text style={{fontFamily:"Gabarito-Regular"}}>None</Text>
        </View>:
        medConditions.map((allergy, index) => (
          <View key={index} style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{allergy}</Text>
          </View>
        ))}
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Medications (Ongoing/Recent)</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
        {medications.length==0? <View  style={{ margin: 3,
          padding: 10,
          borderRadius: 5,}} className="bg-gray-200">
          <Text style={{fontFamily:"Gabarito-Regular"}}>None</Text>
        </View>:medications.map((allergy, index) => (
          <View key={index} style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{allergy}</Text>
          </View>
        ))}
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Family History/ Genetic Diseases</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
        {familyHistory.length==0?
         <View  style={{ margin: 3,
          padding: 10,
          borderRadius: 5,}} className="bg-gray-200">
          <Text style={{fontFamily:"Gabarito-Regular"}}>None</Text>
        </View>:
        familyHistory.map((allergy, index) => (
          <View key={index} style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{allergy}</Text>
          </View>
        ))}
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Last Vaccination</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
        {hadVaccine?<View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{lastVaccinated+": "+(vaccineDescription.length>0?vaccineDescription:"No Information Provided")}</Text>
          </View>: 
          <View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>None</Text>
          </View>}
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Dietary Preference</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
        {dietaryPreference.length==0?
         <View  style={{ margin: 3,
          padding: 10,
          borderRadius: 5,}} className="bg-gray-200">
          <Text style={{fontFamily:"Gabarito-Regular"}}>No Information Provided</Text>
        </View>
        :dietaryPreference.map((allergy, index) => (
          <View key={index} style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{allergy}</Text>
          </View>
        ))}
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Excercise Routine</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
    <View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{exerciseRoutine.length==0?"No Information Provided":exerciseRoutine}</Text>
          </View>
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Smoking History</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
    <View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{didSmoke?(smokingFrequency?smokingFrequency:"No Information Provided"):"None"}</Text>
          </View>
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Drinking History</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
    <View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{didDrink?(drinkingFrequency?drinkingFrequency:"No Information Provided"):"None"}</Text>
          </View>
      </View>
                    </View>
                    <View className="flex-row justify-between">
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Sleep Schedule</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
    <View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{sleepTime.length==0?"No Information Provided":sleepTime+" per week"}</Text>
          </View>
      </View>
                    </View>
                    <View className="flex-col" style={{marginTop:"5%"}}>
                        <Text className="text-xl" style={{fontFamily:"Gabarito-SemiBold"}}>Working Hours</Text>
                        <View style={{ flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line if needed
    width:"100%"}}>
    <View style={{ margin: 3,
            padding: 10,
            borderRadius: 5,}} className="bg-gray-200">
            <Text style={{fontFamily:"Gabarito-Regular"}}>{workTime.length==0?"No Information Provided":workTime+" per week"}</Text>
          </View>
      </View>
                    </View>
                    </View>
                    
            </View>
            
            
        </ScrollView>
    )

}
