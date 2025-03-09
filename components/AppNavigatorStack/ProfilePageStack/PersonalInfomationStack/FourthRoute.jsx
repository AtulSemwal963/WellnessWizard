
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SelectList} from 'react-native-dropdown-select-list'
import { KeyboardState } from 'react-native-reanimated';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { MultiSelect } from 'react-native-element-dropdown';
import DropdownComponent from '../../../HelperComponents/DropdownComponent';
import { useGlobalState } from '../../../HelperComponents/PersonalInformationGlobalState';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View
      className="w-full"
      style={{
        marginVertical: 10,
        borderBottomWidth: 1,
        borderRadius: 5,
        overflow: "hidden",
        borderColor: "#ddd",
      }}
    >
      <TouchableOpacity
        onPress={toggleAccordion}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <Text className="text-2xl" style={{ fontFamily: "Gabarito-SemiBold" }}>
          {title}
        </Text>
        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {/* Render children only when the accordion is open */}
      {isOpen && (
        <View style={{ padding: 10 }}>
          {children}
        </View>
      )}
    </View>
  );
};

export default  FourthRoute = ({ realm }) => {
  const [hadVaccine, setHadVaccine] = useGlobalState("hadVaccine");
  const [vaccTime, setVaccTime] = useGlobalState("lastVaccinated");
  const [vaccDesc,setVaccDesc]= useGlobalState("vaccineDescription")
  const [selectedDiet, setSelectedDiet] = useGlobalState("dietaryPreference");
  const [exerciseRoutine, setExerciseRoutine] = useGlobalState("exerciseRoutine");
  
  const handleSelection = (option) => {
    setHadVaccine(option);
  };

    const vaccinationTime = [
    { value: 'Within last 24 hours', label: 'Vaccinated within the last 24 Hours' },
    { value: 'Within last 3 days', label: 'Vaccinated in the past 3 days' },
    { value: 'Within the last week', label: 'Vaccinated within the last week' },
  ];

  const dietaryPreferences = [
    { value: 'Gluten-Free', label: 'Gluten-Free' },
    { value: 'Keto', label: 'Keto' },
    { value: 'Paleo', label: 'Paleo' },
    { value: 'Pescatarian', label: 'Pescatarian' },
    { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Vegetarian', label: 'Vegetarian' },
  ];

  const exerciseRoutineOptions = [
    { value: 'Less than 30 minutes per week', label: 'Less than 30 minutes per week' },
    { value: 'Around 2 hours per week', label: 'Around 2 hours per week' },
    { value: 'Around 5 hours per week', label: 'Around 5 hours per week' },
    { value: 'Around 8 hours per week', label: 'Around 8 hours per week' },
  ];

  return(
<View>
      <Accordion title="Health and Lifestyle">
      <View className="flex-col items-center justify-between  gap-3" style={{ width: "105%" }}>
      <Text className="text-2xl " style={{ fontFamily: "Gabarito-Medium" }}>Have you received a vaccine recently?</Text>
      <View className="flex-row justify-around w-full">
      <TouchableOpacity onPress={() => handleSelection(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
        <View style={{
          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6b7280',
          alignItems: 'center', justifyContent: 'center', marginRight: 5,transform:"scale(1.2)"
        }}>
          {hadVaccine && <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: '#6b7280' }} />}
        </View>
        <Text  className="text-xl px-3" style={{fontFamily:"Gabarito-Medium"}}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSelection(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6b7280',
          alignItems: 'center', justifyContent: 'center', marginRight: 5,transform:"scale(1.2)"
        }}>
          {!hadVaccine && <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: '#6b7280' }} />}
        </View>
        <Text className="text-xl px-3" style={{fontFamily:"Gabarito-Medium"}}>No</Text>
      </TouchableOpacity>
      </View>
    </View>
  {
    hadVaccine &&
    <View className="flex-col items-center justify-between  gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full" style={{ fontFamily: "Gabarito-Medium" }}>When did you recieve your last vaccine?</Text>

      <DropdownComponent data={vaccinationTime} placeholder={"Select Response"} globalHook={"lastVaccinated"}/>
    </View>
  }
  {
    hadVaccine && vaccTime && 
    <View className="flex-col items-center justify-between  gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full" style={{ fontFamily: "Gabarito-Medium" }}>What did you recieve a vaccination for ?</Text>
       <TextInput
                className="rounded-md text-2xl py-1 px-2"
                style={{ width: '100%', borderColor: '#6b7280', borderWidth: 1, fontFamily: 'Gabarito-Regular' }} value={vaccDesc} onChangeText={(text)=>setVaccDesc(text)}
              />
    </View>
  }
 
 <View className="flex-col  items-start   gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left  " style={{ fontFamily: "Gabarito-Medium" }}>Dietary Preference</Text>
         <View style={styles.container}>
         <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          search ={false}
          data={dietaryPreferences}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={selectedDiet}
          onChange={item => {
            setSelectedDiet(item);
          }}
          renderLeftIcon={() => (
             null
          )}
          selectedStyle={styles.selectedStyle}
        />
      </View>
    </View>
    <View className="flex-col items-center justify-between  gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full" style={{ fontFamily: "Gabarito-Medium" }}>Average excercise routine</Text>
      <DropdownComponent data={exerciseRoutineOptions} placeholder={"Select Response"} globalHook={"exerciseRoutine"}/>
    </View>
      </Accordion>
    </View>
  )
}


  const styles = StyleSheet.create({
    container: { width:"100%" },
    dropdown: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 8,
      fontFamily:"Gabarito-Regular"
    },
    placeholderStyle: {
          fontSize: 16,
    fontFamily:"Gabarito-SemiBold"
    },
    selectedTextStyle: {
      fontSize: 14,
    fontFamily:"Gabarito-Medium",
    color:'black',
    },
    selectedStyle: {
      backgroundColor:'#d1d5db',
      borderRadius:9999,
      borderWidth:0
    },
  });
  