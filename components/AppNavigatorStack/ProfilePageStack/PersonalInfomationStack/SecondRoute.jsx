
import React, { useState,useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SelectList} from 'react-native-dropdown-select-list'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DropdownComponent from '../../../HelperComponents/DropdownComponent';
import { useGlobalState,setGlobalState } from '../../../HelperComponents/PersonalInformationGlobalState';

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

export default SecondRoute = ({realm }) => {
    const [height, setHeight] = useGlobalState("height");
    const [heightUnit, setHeightUnit] = useGlobalState("heightUnit");
    const [weight, setWeight] = useGlobalState('weight');
    const [weightUnit, setWeightUnit] = useGlobalState("weightUnit");
    const [group,setGroup]= useGlobalState("bloodGroup");
  
    const heightUnits = [
      { value: 'ft', label: 'Feets and Inches' },
      { value: 'cm', label: 'Centimeters' },
      { value: 'm', label: 'Meters' },
    ];
    const weightUnits = [
      { value: 'kg', label: 'Kilograms' },
      { value: 'lb', label: 'Pounds' },
    ];
    const bloodGroups = [
      {value:'A+',label:"A positive (A+)"},
      {value:'A-',label:"A negative (A-)"},
      {value:'B+',label:"B positive (B+)"},
      {value:'B-',label:"B negative (B-)"},
      {value:'O+',label:"O positive (O+)"},
      {value:'O-',label:"O negative (O-)"},
      {value:'AB+',label:"AB positive (AB+)"},
      {value:'AB-',label:"AB negative (AB-)"},
    ];
  
  
    return(
    <View>
          
          <Accordion title="Physical Attributes">
          <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
        <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium",width:"20%" }}>Height</Text>
        <View className="flex-row " style={{width:"75%"}}>
         <TextInput
                  className="rounded-md  py-1 px-2 text-2xl"
                  style={{ width: '30%', borderColor: '#6b7280', borderWidth: 1, fontFamily: 'Gabarito-Regular' }}
                  onChangeText={(text)=>setHeight(text)}
                  value={height}
                  keyboardType={"numeric"}
                />
        <View style={{width:"70%",marginLeft:"2%"}}>
         <DropdownComponent data={heightUnits} placeholder={"Select Unit"} globalHook={"heightUnit"}/>
        </View>
        </View>
       
      </View>
      <View className="flex-row items-center justify-between" style={{ width: "100%",marginTop:"3%" }}>
        <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium",width:"20%" }}>Weight</Text>
        <View className="flex-row " style={{width:"75%"}}>
         <TextInput
                  className="rounded-md  py-1 px-2 text-2xl"
                  style={{ width: '30%', borderColor: '#6b7280', borderWidth: 1, fontFamily: 'Gabarito-Regular' }}
                  onChangeText={(text)=>setWeight(text)}
                  value={weight}
                  keyboardType={"numeric"}
                />
        <View style={{width:"70%",marginLeft:"2%"}}>
         <DropdownComponent data={weightUnits} placeholder={"Select Unit"} globalHook={"weightUnit"}/>
        </View>
        </View>
       
      </View>
      <View className="flex-row items-center justify-between" style={{ width: "100%",marginTop:"3%" }}>
        <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium",width:"35%" }}>Blood Group</Text>
        <View className="flex-row " style={{width:"90%"}}>
        <View style={{width:"70%",marginLeft:"2%"}}>
         <DropdownComponent data={bloodGroups} placeholder={"Select Group"} globalHook={"bloodGroup"}/>
        </View>
        </View>
       
      </View>
          </Accordion>
        </View>
    )
  };



  