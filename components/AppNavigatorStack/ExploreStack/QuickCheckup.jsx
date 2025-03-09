
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler, ToastAndroid, ActivityIndicator, Alert } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const startEndpoint = 'https://wwgeminibackend.onrender.com/quickcheckup/start';
const responseEndpoint = 'https://wwgeminibackend.onrender.com/quickcheckup/response';

export default function QuestionnaireComponent() {
  const navigation = useNavigation();
  const [backPressCount, setBackPressCount] = useState(0);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount === 0) {
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setBackPressCount(1);

          setTimeout(() => setBackPressCount(0), 2000);
          return true;
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [backPressCount])
  );

  const startWizard = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(startEndpoint, { method: 'POST' });
      const data = await response.json();
      console.log('Data from start endpoint:', data); // Log data to verify structure
      setQuestion(data.question);
      setOptions(data.options || []); // Ensure options are always set as an array
      setIsStarted(true);
    } catch (error) {
      console.error('Error starting the wizard:', error);
      Alert.alert('Error', 'There was an error starting the wizard. Please try again later.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleResponse = async () => {
    if (!selectedId) {
      Alert.alert('Error', 'Please select an option.');
      return;
    }

    const selectedOption = options[selectedId - 1];

    setIsLoading(true); // Start loading
    try {
      const response = await fetch(responseEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: selectedOption }),
      });

      const data = await response.json();
      console.log('Response from server:', data); // Log the response for debugging

      if (data.answer) {
        setQuestion(`Diagnosis: ${data.answer}`);
        setOptions([]);
      } else {
        setQuestion(data.question);
        setOptions(data.options || []);
        setSelectedId(null);
      }
    } catch (error) {
      console.error('Error handling response:', error);
      Alert.alert('Error', 'There was an error processing your response. Please try again later.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const radioButtons = options.map((option, index) => ({
    id: String(index + 1),
    label: option,
    value: `option${index + 1}`,
  }));

  return (
    <View className="p-3 h-max" style={{ marginTop: 0, paddingBottom: '15%' }}>
      <View style={{ fontSize: 20, fontWeight: 'bold', color: '#008080' }} className="w-full flex-row">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} color="black" size={27} className="self-start" style={{ marginLeft: '10%' }} />
        </TouchableOpacity>
        <Text className="self-center text-xl text-center" style={{ fontFamily: 'Gabarito-SemiBold', width: '65%', marginLeft: '3%' }}>
          Quick Checkup
        </Text>
      </View>
      <Text className="text-2xl" style={{ fontFamily: 'Gabarito-SemiBold', marginLeft: 15, marginTop: '10%' }}>
        {question ? question : 'What brings you in today?'}
      </Text>
      <Text className="text-xl text-gray-500" style={{ fontFamily: 'Gabarito-Regular', marginLeft: 15, marginTop: 10 }}>
        {question && !options.length ? '' : 'Select whichever applies'}
      </Text>

      {!isStarted ? (
        <TouchableOpacity
          className="w-4/5 self-center top-5 rounded-lg"
          style={{ backgroundColor: 'rgb(117, 141, 163)' }}
          onPress={startWizard}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" style={{ padding: 10 }} />
          ) : (
            <Text className="text-2xl p-3 text-center text-white" style={{ fontFamily: 'Gabarito-SemiBold' }}>
              Start
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <>
          {options.length > 0 ? (
            <RadioGroup
              labelStyle={{
                width: '90%',
                fontFamily: 'Gabarito-Regular',
                padding: '4%',
                borderWidth: 1,
                borderColor: 'rgba(117, 141, 163, 0.4)',
                borderRadius: 6,
                fontSize: 20,
              }}
              containerStyle={{
                display: 'flex',
                flexDirection: 'column',
                margin: 15,
              }}
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
            />
          ) : (
            <Text className="text-xl text-gray-500" style={{ fontFamily: 'Gabarito-Regular', marginLeft: 15, marginTop: 10 }}>
              {question}
            </Text>
          )}

          {selectedId && (
            <TouchableOpacity
              className="w-4/5 self-center top-5 rounded-lg"
              style={{ backgroundColor: 'rgb(117, 141, 163)' }}
              onPress={handleResponse}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" style={{ padding: 10 }} />
              ) : (
                <Text className="text-2xl p-3 text-center text-white" style={{ fontFamily: 'Gabarito-SemiBold' }}>
                  Next
                </Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
