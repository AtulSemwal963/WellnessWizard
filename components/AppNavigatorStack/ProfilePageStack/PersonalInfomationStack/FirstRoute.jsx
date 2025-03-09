
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  StyleSheet
} from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list';
import { useGlobalState,setGlobalState } from '../../../HelperComponents/PersonalInformationGlobalState';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DropdownComponent from '../../../HelperComponents/DropdownComponent';


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
        <View className="bg-gray-50" style={{ padding: 10 }}>
          {children}
        </View>
      )}
    </View>
  );
};


const FirstRoute = ({ realm }) => {
  const [age, setAge] = useGlobalState("age");
  const [selected, setSelected] = useGlobalState("gender");

  
  const data = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
  ];


  return (
    <View>
      <Accordion title="General">
        <View className="bg-gray-50">
      <View className="flex-row items-center justify-between " style={{ width: '100%' }}>
        <Text className="text-2xl" style={{ fontFamily: 'Gabarito-Medium' }}>Age</Text>
        <TextInput
          className="rounded-md text-2xl py-1 px-2"
          style={{ width: '60%', borderColor: '#6b7280', borderWidth: 1, fontFamily: 'Gabarito-Regular' }}
          onChangeText={(text) => setAge(text)}
          value={age}
          keyboardType="numeric"
        />
      </View>
      <View className="flex-row items-center justify-between " style={{ width: '100%' }}>
        <Text className="text-2xl" style={{ fontFamily: 'Gabarito-Medium' }}>Gender</Text>
        <View style={{width:"60%",marginLeft:"16%",marginTop:"3%"}}>
         <DropdownComponent data={data} placeholder={"Select Response"} globalHook={"gender"}/> 
        </View>
      </View>
        </View>
      
      </Accordion>
    </View>
  );
};

export default FirstRoute;
