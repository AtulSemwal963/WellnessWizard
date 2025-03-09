
import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
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
        <View style={{ padding: 10 }}>
          {children}
        </View>
      )}
    </View>
  );
};


export default  FifthRoute = ({ realm }) => {
  const [didSmoke, setDidSmoke] = useGlobalState("didSmoke");
  const [smokingFreq, setSmokingFreq] = useGlobalState("smokingFrequency");
  const [didDrink, setDidDrink] = useGlobalState("didDrink");
  const [drinkingFreq, setDrinkingFreq] = useGlobalState("drinkingFrequency");
  const [sleepTime, setSleepTime] = useGlobalState("sleepTime");
  const [workTime, setWorkTime] = useGlobalState("workTime");


  const handleSelection = (option,setHook) => {
    setHook(option);
  };

    const smokingFreqOptions = [
    { value: 'Used to smoke', label: 'I used to smoke' },
    { value: 'Rarely', label: 'Rarely' },
    { value: '1-2 times per week', label: '1-2 times' },
    { value: '3-5 times per week', label: '3-5 times' },
    {value:'6-10 times per week',label:'6-10 times'},
    {value:'More than 10 times per week',label:'More than 10 times'},
  ];

  const drinkingFreqOptions = [
    { value: 'Used to drink', label: 'I used to drink' },
    { value: 'Rarely', label: 'Rarely' },
    { value: 'Less than a Litre per week', label: 'Less than a Litre' },
    { value: '1-2L per week', label: '1-2L' },
    {value:'2-3L per week',label:'2-3L'},
    {value:'More than 3L per week',label:'More than 3L'},
  ];

  const sleepTimeOptions = [
    { value: 'Less than 4 hours ', label: 'Less than 4 hours' },
    { value: '4-5 hours', label: '4-5 hours' },
    { value: '6-7 hours', label: '6-7 hours' },
    { value: '7-8 hours', label: '7-8 hours' },
    {value:'More than 8 hours',label:'More than 8 hours'},
  ];

  const workTimeOptions = [
    { value: 'Less than 10 hours', label: 'Less than 10 hours' },
    { value: '10-20 hours', label: '10-20 hours' },
    { value: '21-30 hours', label: '21-30 hours' },
    { value: '31-40 hours', label: '31-40 hours' },
    { value: '41-50 hours', label: '41-50 hours' },
    {value:'More than 50 hours',label:'More than 50 hours'},
  ];


  return(
<View>
      <Accordion title="Well-being and Habits">
      <View className="flex-col items-center justify-between  gap-3" style={{ width: "100%"}}>
      <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Do you currently smoke or have a history of smoking?</Text>
      <View className="flex-row justify-around w-full">
      <TouchableOpacity onPress={() => handleSelection(true,setDidSmoke)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
        <View style={{
          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6b7280',
          alignItems: 'center', justifyContent: 'center', marginRight: 5,transform:"scale(1.2)"
        }}>
          {didSmoke && <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: '#6b7280' }} />}
        </View>
        <Text  className="text-xl px-3" style={{fontFamily:"Gabarito-Medium"}}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSelection(false,setDidSmoke)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6b7280',
          alignItems: 'center', justifyContent: 'center', marginRight: 5,transform:"scale(1.2)"
        }}>
          {!didSmoke && <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: '#6b7280' }} />}
        </View>
        <Text className="text-xl px-3" style={{fontFamily:"Gabarito-Medium"}}>No</Text>
      </TouchableOpacity>
      </View>
    </View>
  {
    didSmoke &&
    <View className="flex-col items-center justify-between px-3 gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full" style={{ fontFamily: "Gabarito-Medium" }}>How often do you smoke per week?</Text>

      {/* <View className="flex-row w-full px-3">
            <SelectList
        search={false}
        setSelected={(val) => setSmokingFreq(val)}
        data={smokingFreqOptions}
        save="value"
        fontFamily='Gabarito-Regular'
        boxStyles={{ width: "95%", borderColor: "#6b7280", borderWidth: 1, }}
        dropdownStyles={{ width: "95%", borderColor: "#6b7280", borderWidth: 1,position:"absolute",zIndex:10,top:"75%",backgroundColor:"#FFFF",flex:1 }}
        inputStyles={{ fontSize: 16 }}
        placeholder='Select Response'
      />
      </View> */}
      <DropdownComponent data={smokingFreqOptions} placeholder={"Select Response"} globalHook={"smokingFrequency"}/>
    </View>
  }
<View className="flex-col items-center justify-between  gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Do you currently drink or have a history of drinking?</Text>
      <View className="flex-row justify-around w-full">
      <TouchableOpacity onPress={() => handleSelection(true,setDidDrink)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
        <View style={{
          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6b7280',
          alignItems: 'center', justifyContent: 'center', marginRight: 5,transform:"scale(1.2)"
        }}>
          {didDrink && <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: '#6b7280' }} />}
        </View>
        <Text  className="text-xl px-3" style={{fontFamily:"Gabarito-Medium"}}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSelection(false,setDidDrink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#6b7280',
          alignItems: 'center', justifyContent: 'center', marginRight: 5,transform:"scale(1.2)"
        }}>
          {!didDrink && <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: '#6b7280' }} />}
        </View>
        <Text className="text-xl px-3" style={{fontFamily:"Gabarito-Medium"}}>No</Text>
      </TouchableOpacity>
      </View>
    </View>
    {
    didDrink &&
    <View className="flex-col items-center justify-between  gap-3" style={{ width: "95%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full px-3" style={{ fontFamily: "Gabarito-Medium" }}>How much do you drink per week?</Text>
      <DropdownComponent data={drinkingFreqOptions} placeholder={"Select Response"} globalHook={"drinkingFrequency"}/>
    </View>
  }

<View className="flex-col items-center justify-between  gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full px-3" style={{ fontFamily: "Gabarito-Medium" }}>How many hours do you usually sleep per night ?</Text>
      <DropdownComponent data={sleepTimeOptions} placeholder={"Select Response"} globalHook={"sleepTime"}/>
    </View>

    <View className="flex-col items-center justify-between  gap-3" style={{ width: "100%",marginTop:"5%" }}>
      <Text className="text-2xl text-left w-full px-3" style={{ fontFamily: "Gabarito-Medium" }}>How many hours do you work per week ?</Text>
      <DropdownComponent data={workTimeOptions} placeholder={"Select Response"} globalHook={"workTime"}/>
    </View>
      </Accordion>
    </View>
  )
}
