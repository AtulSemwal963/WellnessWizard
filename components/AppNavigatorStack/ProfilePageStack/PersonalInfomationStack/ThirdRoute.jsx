
import React, { useState} from 'react';
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
import Entypo from 'react-native-vector-icons/Entypo'
import { KeyboardState } from 'react-native-reanimated';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
        <View style={{ padding: 10 }}>
          {children}
        </View>
      )}
    </View>
  );
};

export default ThirdRoute = ({ realm }) => {
    const [allergyInput, setAllergyInput] = useState('');
    const [allergies, setAllergies] = useGlobalState("allergies");
    const [medCondInput,setMedCondInput]= useState('');
    const [medConditions, setMedConditions] = useGlobalState("medConditions");
    const [medicationInput,setMedicationInput]=useState('');
    const [medications, setMedications] = useGlobalState("medications");
    const [familyHistoryInput, setFamilyHistoryInput] = useState('');
    const [familyHistory, setFamilyHistory] = useGlobalState("familyHistory");
  
    const handleAddTag = (text, hook, setHook, array, setArray) => {
      const trimmedText = text.replace(',', '').trim();
      if (trimmedText && Array.isArray(array) && !array.includes(trimmedText)) {
        setArray([...array, trimmedText]);
      }
      setHook(''); // Clear the input field
    };
    const handleDeleteTag = (index,array,setArray) => {
      setArray(array.filter((_, i) => i !== index));
    };
  
    const handleInputChange = (text,hook,setHook,array,setArray) => {
      if (text.includes(',')) {
        handleAddTag(text,hook,setHook,array,setArray);
      } else {
        setHook(text);
      }
    };
  
    return(
    //   <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={100} // Adjust this value based on your header height
    //   style={{ height: "100%", width: "95%", marginBottom: KeyboardState.OPEN ? "8%" : 0}}
    // >
    //   <ScrollView  contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} className="w-full" >
    //   <Text style={{ fontFamily: "Gabarito-SemiBold", fontSize: 22 }}>Medical History</Text>
    //         <View className="flex-col w-full top-4">
    //           <View className="flex-col items-start gap-3 justify-between py-3 w-full">
    //           <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Allergies (if any)</Text>
    //       <TextInput
    //         className="rounded-md p-1 px-2 text-2xl"
    //         style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
    //         placeholder="Add using comma"
    //         value={allergyInput}
    //         onChangeText={(text)=>handleInputChange(text,allergyInput,setAllergyInput,allergies,setAllergies)}
    //         onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,allergyInput,setAllergyInput,allergies,setAllergies)}
    //         onKeyPress={({ nativeEvent }) => {
    //           if (nativeEvent.key === 'Backspace' && !allergyInput) {
    //             handleDeleteTag(allergies.length - 1,allergies,setAllergies);
    //           }
    //         }}
    //       />  
    //           </View>
    //           <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%"}}>
    //       {allergies.map((tag, index) => (
    //         <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
    //           <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
    //           <TouchableOpacity onPress={() => handleDeleteTag(index,allergies,setAllergies)}>
    //             <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
    //           </TouchableOpacity>
    //         </View>
    //       ))}
    //     </View>
    //     </View>
    //     <View className="flex-col w-full top-4">
    //           <View className="flex-col items-start gap-3 justify-between py-3 w-full">
    //           <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Medical Conditions (Past/Present)</Text>
    //       <TextInput
    //         className="rounded-md p-1 px-2 text-2xl"
    //         style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
    //         placeholder="Add using comma"
    //         value={medCondInput}
    //         onChangeText={(text)=>handleInputChange(text,medCondInput,setMedCondInput,medConditions,setMedConditions)}
    //         onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,medCondInput,setMedCondInput,medConditions,setMedConditions)}
    //         onKeyPress={({ nativeEvent }) => {
    //           if (nativeEvent.key === 'Backspace' && !allergyInput) {
    //             handleDeleteTag(medConditions.length - 1,medConditions,setMedConditions);
    //           }
    //         }}
    //       />  
    //           </View>
    //           <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%"}}>
    //       {medConditions.map((tag, index) => (
    //         <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
    //           <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
    //           <TouchableOpacity onPress={() => handleDeleteTag(index,medConditions,setMedConditions)}>
    //             <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
    //           </TouchableOpacity>
    //         </View>
    //       ))}
    //     </View>
    //     </View>
    //     <View className="flex-col w-full top-4">
    //           <View className="flex-col items-start gap-3 justify-between py-3 w-full">
    //           <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Medications (Ongoing/Recent)</Text>
    //       <TextInput
    //         className="rounded-md p-1 px-2 text-2xl"
    //         style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
    //         placeholder="Add using comma"
    //         value={medicationInput}
    //         onChangeText={(text)=>handleInputChange(text,medicationInput,setMedicationInput,medications,setMedications)}
    //         onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,medicationInput,setMedicationInput,medications,setMedications)}
    //         onKeyPress={({ nativeEvent }) => {
    //           if (nativeEvent.key === 'Backspace' && !medicationInput) {
    //             handleDeleteTag(medications.length - 1,medications,setMedications);
    //           }
    //         }}
    //       />  
    //           </View>
    //           <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%"}}>
    //       {medications.map((tag, index) => (
    //         <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
    //           <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
    //           <TouchableOpacity onPress={() => handleDeleteTag(index,medications,setMedications)}>
    //             <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
    //           </TouchableOpacity>
    //         </View>
    //       ))}
    //     </View>
    //     </View>
    //     <View className="flex-col w-full top-4">
    //           <View className="flex-col items-start gap-3 justify-between py-3 w-full">
    //           <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Family History/Genetic Diseases</Text>
    //       <TextInput
    //         className="rounded-md p-1 px-2 text-2xl"
    //         style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
    //         placeholder="Add using comma"
    //         value={familyHistoryInput}
    //         onChangeText={(text)=>handleInputChange(text,familyHistoryInput,setFamilyHistoryInput,familyHistory,setFamilyHistory)}
    //         onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,familyHistoryInput,setFamilyHistoryInput,familyHistory,setFamilyHistory)}
    //         onKeyPress={({ nativeEvent }) => {
    //           if (nativeEvent.key === 'Backspace' && !familyHistoryInput) {
    //             handleDeleteTag(familyHistory.length - 1,familyHistory,setFamilyHistory);
    //           }
    //         }}
    //       />  
    //           </View>
    //           <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%"}}>
    //       {familyHistory.map((tag, index) => (
    //         <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
    //           <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
    //           <TouchableOpacity onPress={() => handleDeleteTag(index,familyHistory,setFamilyHistory)}>
    //             <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
    //           </TouchableOpacity>
    //         </View>
    //       ))}
    //     </View>
    //     </View>
    // </ScrollView>
    // </KeyboardAvoidingView>
    <View>
          <Accordion title="Medical History">
          <View className="flex-col w-full ">
              <View className="flex-col items-start gap-3 justify-between w-full">
              <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Allergies (if any)</Text>
          <TextInput
            className="rounded-md p-1 px-2 text-2xl"
            style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
            placeholder="Add using comma"
            value={allergyInput}
            onChangeText={(text)=>handleInputChange(text,allergyInput,setAllergyInput,allergies,setAllergies)}
            onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,allergyInput,setAllergyInput,allergies,setAllergies)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !allergyInput) {
                handleDeleteTag(allergies.length - 1,allergies,setAllergies);
              }
            }}
          />  
              </View>
              <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%",marginTop:"2%"}}>
          {allergies.map((tag, index) => (
            <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
              <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
              <TouchableOpacity onPress={() => handleDeleteTag(index,allergies,setAllergies)}>
                <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </View>
        <View className="flex-col w-full" style={{marginTop:"3%"}}>
              <View className="flex-col items-start gap-3 justify-between w-full">
              <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Medical Conditions (Past/Present)</Text>
          <TextInput
            className="rounded-md p-1 px-2 text-2xl"
            style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
            placeholder="Add using comma"
            value={medCondInput}
            onChangeText={(text)=>handleInputChange(text,medCondInput,setMedCondInput,medConditions,setMedConditions)}
            onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,medCondInput,setMedCondInput,medConditions,setMedConditions)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !allergyInput) {
                handleDeleteTag(medConditions.length - 1,medConditions,setMedConditions);
              }
            }}
          />  
              </View>
              <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%",marginTop:"3%"}}>
          {medConditions.map((tag, index) => (
            <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
              <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
              <TouchableOpacity onPress={() => handleDeleteTag(index,medConditions,setMedConditions)}>
                <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </View>
        <View className="flex-col w-full" style={{marginTop:"3%"}}>
              <View className="flex-col items-start gap-3 justify-between w-full">
              <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Medications (Ongoing/Recent)</Text>
          <TextInput
            className="rounded-md p-1 px-2 text-2xl"
            style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
            placeholder="Add using comma"
            value={medicationInput}
            onChangeText={(text)=>handleInputChange(text,medicationInput,setMedicationInput,medications,setMedications)}
            onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,medicationInput,setMedicationInput,medications,setMedications)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !medicationInput) {
                handleDeleteTag(medications.length - 1,medications,setMedications);
              }
            }}
          />  
              </View>
              <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%",marginTop:"3%"}}>
          {medications.map((tag, index) => (
            <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
              <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
              <TouchableOpacity onPress={() => handleDeleteTag(index,medications,setMedications)}>
                <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </View>
        <View className="flex-col w-full" style={{marginTop:"3%"}}>
              <View className="flex-col items-start gap-3 justify-between w-full">
              <Text className="text-2xl" style={{ fontFamily: "Gabarito-Medium" }}>Family History/Genetic Diseases</Text>
          <TextInput
            className="rounded-md p-1 px-2 text-2xl"
            style={{ width: "100%", borderColor: "#6b7280", borderWidth: 1, fontFamily: "Gabarito-Regular" }}
            placeholder="Add using comma"
            value={familyHistoryInput}
            onChangeText={(text)=>handleInputChange(text,familyHistoryInput,setFamilyHistoryInput,familyHistory,setFamilyHistory)}
            onSubmitEditing={(event)=>handleAddTag(event.nativeEvent.text,familyHistoryInput,setFamilyHistoryInput,familyHistory,setFamilyHistory)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !familyHistoryInput) {
                handleDeleteTag(familyHistory.length - 1,familyHistory,setFamilyHistory);
              }
            }}
          />  
              </View>
              <View style={{ flexDirection: 'row',flexWrap: 'wrap',marginBottom: 10,width:"100%",marginLeft:"3%",marginTop:"3%"}}>
          {familyHistory.map((tag, index) => (
            <View key={index} style={{ flexDirection: 'row',backgroundColor: '#d1d5db',paddingVertical: 5,paddingHorizontal: 10,borderRadius: 15,marginRight: 8,marginBottom: 8,}}>
              <Text style={{marginRight: 8,marginLeft:5,fontFamily:"Gabarito-Medium"}}>{tag}</Text>
              <TouchableOpacity onPress={() => handleDeleteTag(index,familyHistory,setFamilyHistory)}>
                <Entypo name="circle-with-cross" color="#6b7280" size={16}/>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </View>
          </Accordion>
        </View>
    )
  };

