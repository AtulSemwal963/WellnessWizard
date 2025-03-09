
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import Fuse from 'fuse.js';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign'

const Data = require('../../HelperComponents/Diseases.json');

export default function SearchGlossary() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [expandedSections, setExpandedSections] = useState({});
  const [showAll, setShowAll] = useState(false);

  const fuse = useMemo(() => new Fuse(Data, {
    keys: ['name'],
    threshold: 0.1,
    findAllMatches: false,
  }), [Data]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      const result = fuse.search(text).map(result => result.item);
      setResults(result);
    } else {
      setResults([]);
    }
    setDisplayLimit(10);
  };

  const highlightMatch = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={{ fontWeight: 'bold', color: 'black' }}>{part}</Text>
      ) : (
        <Text key={index} style={{ color: "#6b7280" }}>{part}</Text>
      )
    );
  };

  const loadMoreResults = () => {
    setDisplayLimit((prevLimit) => prevLimit + 10);
  };

  const alphabetizedDiseases = useMemo(() => {
    const fullAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).reduce((acc, letter) => {
        acc[letter] = [];
        return acc;
    }, {});

    Data.forEach(disease => {
        const firstLetter = disease.name.charAt(0).toUpperCase();
        if (fullAlphabet[firstLetter]) {
            fullAlphabet[firstLetter].push(disease);
        }
    });

    return Object.keys(fullAlphabet).map(letter => ({
        letter,
        diseases: fullAlphabet[letter]
    }));
}, [Data]);

  const toggleSection = (letter) => {
    setExpandedSections(prev => ({
      ...prev,
      [letter]: !prev[letter]
    }));
  };


  return (
    <View className="p-3 h-max" style={{ marginTop: 0,paddingBottom:"15%" }}>
      <View style={{ fontSize: 20, fontWeight: 'bold', color: '#008080' }} className="w-full flex-row">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back"} color="black" size={27} className="self-start" style={{ marginLeft: "10%" }} />
        </TouchableOpacity>
        <Text className="self-center text-xl text-center" style={{ fontFamily: "Gabarito-SemiBold", width: "65%", marginLeft: "3%" }}>
          Symptom & Condition Guide
        </Text>
      </View>

      {showAll ? (
        <ScrollView className="p-3 h-full" style={{ marginTop: 10,marginBottom:'10%' }}>
           <TouchableOpacity 
                className="rounded-lg my-3 flex-row items-center justify-center" 
                style={{ "backgroundColor":"rgba(117, 141, 163, 0.05)", width:"100%" }} 
                onPress={() => setShowAll(false)}
              >
                <Text className="p-3 text-centera text-gray-400 text-xl" style={{ fontFamily:"Gabarito-Regular" }}>Back to Search</Text>
                <AntDesign name="arrowup" size={24} color="#9ca3af" />
              </TouchableOpacity>
          {alphabetizedDiseases.map(section => (
            <View key={section.letter} className="bg-gray-200 p-2 my-2 rounded-md">
              <TouchableOpacity onPress={() => toggleSection(section.letter)} style={{ paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={expandedSections[section.letter] ? "chevron-down" : "chevron-forward"} size={20} color="rgb(107 114 128)" />
                <Text className="text-3xl" style={{ fontFamily: "Gabarito-SemiBold", color: 'black', marginLeft: 10 }}>
                  {section.letter}
                </Text>
              </TouchableOpacity>
              {expandedSections[section.letter] && (
                <View  className="bg-white p-3 rounded-lg" style={{ paddingLeft: 20 }}>
                  {section.diseases.map(disease => (
                    <TouchableOpacity key={disease.name}  onPress={()=>navigation.navigate('DiseaseDetails',{ diseaseName: disease.name })}>
                     <Text style={{ paddingVertical: 8, fontSize: 16, color: "#6b7280", fontFamily: "Gabarito-Regular" }}>
                      {disease.name}
                    </Text> 
                    </TouchableOpacity>
                    
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <TextInput
            className="bg-gray-200 self-center text-lg p-1 px-3 rounded-md"
            placeholder='Search diseases, illnesses, or conditions...'
            style={{ width: "90%", fontFamily: "Gabarito-Regular", borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)', marginTop: "10%" }}
            value={query}
            onChangeText={handleSearch}
          />
          {query ? (
            <FlatList
              data={results.slice(0, displayLimit)}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('DiseaseDetails', { diseaseName: item.name })}>
                  <Text className="p-3 " style={{
                  fontSize: 18,
                  borderBottomWidth: 0.3,
                  borderBottomColor: '#008080',
                  borderColor: 'rgba(117, 141, 163, 0.3)',
                  fontFamily: "Gabarito-Regular",
                  color: "#6b7280",
                  paddingLeft:"7%"
                }}>
                  {highlightMatch(item.name)}
                </Text>
                </TouchableOpacity> 
              )}
              ListEmptyComponent={(
                <View className="items-center opacity-50 p-3" style={{ marginTop:"50%"}}>
                  <MaterialIcons name="error-outline" size={54} color="#9ca3af" />
                  <Text className="text-xl text-gray-400 text-center my-2" style={{ fontFamily: "Gabarito-Regular" }}>'{query}' is either not a valid search term or is not in our records at this time.</Text>
                </View>
              )}
              ListFooterComponent={
                results.length > displayLimit ? (
                  <TouchableOpacity className=" rounded-full" onPress={loadMoreResults} style={{ padding: 10, marginBottom:"50%", alignItems: 'center', borderTopLeftRadius:0, borderTopRightRadius:0, "backgroundColor":"rgba(117, 141, 163, 0.1)" }}>
                    <Text className="text-black text-xl" style={{ fontFamily:"Gabarito-Medium" }}>Show More Results</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          ) : (
            <View className="items-center justify-center opacity-50 self-center" style={{ position:"absolute", top:"300%", height:"100%", width:"100%" }}>
              <Text className="text-2xl text-gray-400 my-5" style={{ fontFamily:"Gabarito-Regular" }}>Search Results Will Appear Here...</Text>
              <SimpleLineIcons name="grid" size={24} color="#9ca3af" />
              <TouchableOpacity 
                className="rounded-lg my-5 flex-row items-center justify-around" 
                style={{ "backgroundColor":"rgba(117, 141, 163, 0.1)", width:"35%" }} 
                onPress={() => setShowAll(true)}
              >
                <Text className="p-4 text-center text-lg text-gray-400" style={{ fontFamily:"Gabarito-Regular" }}>View All</Text>
                <Feather name="chevron-down" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
