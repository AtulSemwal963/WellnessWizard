import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image,ToastAndroid, Platform,Vibration,ActivityIndicator,FlatList,RefreshControl,Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from  'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-clipboard/clipboard';
import diseasesData from '../../HelperComponents/Diseases.json';
import ImageViewing from 'react-native-image-viewing';
import Modal from 'react-native-modal';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useNavigation } from '@react-navigation/native';
import Realm from 'realm';


const slide1Picture = require('../../../assets/images/slide1.png');
const slide2Picture = require('../../../assets/images/slide2.png');
const slide3Picture = require('../../../assets/images/slide3.png');
const slide4Picture = require('../../../assets/images/slide4.png');
import {useGlobalState,setGlobalState} from '../../HelperComponents/GlobalState'
const interstitial = InterstitialAd.createForAdRequest(
  "ca-app-pub-3940256099942544/1033173712"
);

const DiseaseDetails = ({ route }) => {
  const { diseaseName } = route.params;
  const [disease, setDisease] = useState(null);
  const [isOptionsVisible,setOptionsVisible]=useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryShown, setIsSummaryShown] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [visitCount,setVisitCount]=useGlobalState("diseaseDetailVisitCount");
  const [adLoaded, setAdLoaded] = useState(false);
  const navigation = useNavigation();
  
  // State for controlling the image viewer
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // List of images for the image viewer
  const images = [
    { uri: Image.resolveAssetSource(slide1Picture).uri, source: 'Source: slide1.jpg' },
    { uri: Image.resolveAssetSource(slide2Picture).uri, source: 'Source: slide2.jpg' },
    { uri: Image.resolveAssetSource(slide3Picture).uri, source: 'Source: slide3.jpg' },
    { uri: Image.resolveAssetSource(slide4Picture).uri, source: 'Source: slide4.jpg' },
  ];

  useEffect(()=>{
    setGlobalState("diseaseDetailVisitCount",visitCount+1);
    console.log(visitCount);
    console.log(adLoaded);
  },[])
  useEffect(() => {
    const foundDisease = diseasesData.find((item) => item.name === diseaseName);
    setDisease(foundDisease);
  }, [diseaseName]);

  useEffect(() => {
    if(visitCount==0 || visitCount%2==0){
 const onAdLoaded = () => setAdLoaded(true);
    const onAdClosed = () => setAdLoaded(false);
    const onAdFailedToLoad = () => setAdLoaded(false);

    // Add event listeners
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, onAdLoaded);
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, onAdClosed);
    const unsubscribeFailedToLoad = interstitial.addAdEventListener(AdEventType.ERROR, onAdFailedToLoad);

    // Load the interstitial ad
    interstitial.load();

    // Clean up listeners when component unmounts
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeFailedToLoad();
    };
    }
  }, []);

  // Show the interstitial ad when it’s loaded
  useEffect(() => {
    if (adLoaded) {
      interstitial.show();
    }
  }, [adLoaded]);


  // const summarizeWithAI = async() => {
  //   setOptionsVisible(false);
  //   setIsSummaryShown(true);
  //   setIsSummarizing(true);
  //   const data = await response.json();
  //   setTimeout(() => {
  //     setIsSummarizing(false);
  //     // setSummaryText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  "); 
  //   }, 3000);
  // };
  const summarizeWithAI = async () => {
    if (!disease) {
      Alert.alert('Error', 'No disease data available for summarization.');
      return;
    }
  
    setOptionsVisible(false);
    setIsSummaryShown(true);
    setIsSummarizing(true);
  
    // Combine all sections into a single content string
    const content = `
      Name: ${disease.name}
      Overview: ${disease.overview || 'N/A'}
      Symptoms: ${disease.symptoms || 'N/A'}
      Diagnosis: ${disease.diagnosis || 'N/A'}
      Treatment: ${disease.treatment || 'N/A'}
      Prevention: ${disease.prevention || 'N/A'}
      Prognosis: ${disease.prognosis || 'N/A'}
    `;
  
    try {
      const response = await fetch('https://wwgeminibackend.onrender.com/summarisetext', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setSummaryText(data.summary);
      } else {
        console.error('Failed to summarize:', response.statusText);
        Alert.alert('Error', 'Failed to summarize the disease content.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!disease) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size={35} color="#6b7280" className="bg-gray-200 self-center rounded-full p-2" style={{marginTop:"30%"}}/>
      </View>
    );
  }

  // Footer Component for Image Viewing
  const renderFooter = () => {
    if (!images[currentImageIndex]) return null; // Ensure there is an image at the current index
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{images[currentImageIndex].source}</Text>
      </View>
    );
  };

  const toggleOptionsModal = () => {
    setOptionsVisible(!isOptionsVisible);
    console.log(isOptionsVisible)
  };

  const toggleModal = () => {
    setIsSummaryShown(!isSummaryShown);
  };

  // Function to open image viewer and set current image index
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };



  const copyToClipboard = () => {
    if (disease) {
      const formattedText = `${disease.name}\n\nOverview\n${disease.overview}\n\nSymptoms\n${disease.symptoms}\n\nDiagnosis\n${disease.diagnosis}\n\nTreatment\n${disease.treatment}\n\nPrevention\n${disease.prevention}\n\nPrognosis\n${disease.prognosis}\n`;
      
      Clipboard.setString(formattedText);
      
      // Show toast on Android or alert on iOS as a fallback
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
        Vibration.vibrate(70); 
        setOptionsVisible(false);
      } else {
        Alert.alert('Copied!', 'Disease details have been copied to clipboard.');
      }
    } else {
      Alert.alert('Error', 'Disease details are not available.');
    }
  };

  const copySummary = () => {
    if (summaryText) {
      const formattedText = `${disease.name}\n${summaryText}`;
      
      Clipboard.setString(formattedText);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
        Vibration.vibrate(70); 
      } else {
        Alert.alert('Copied!', 'Disease details have been copied to clipboard.');
      }
    } else {
      Alert.alert('Error', 'Disease details are not available.');
    }
  };

  return (
    <View className="bg-gray-300 w-full h-full">
      <View className="rounded-3xl self-center flex-col items-center bg-gray-100 h-full p-3" style={{ width: "96%", marginTop: "2%", borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: "2%", width: '100%' }} className="w-full flex-row self-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-3">
            <AntDesign name={'arrowleft'} size={25} color={'black'} />
          </TouchableOpacity>
          <Text className="self-center text-xl text-center" style={{ fontFamily: 'Gabarito-SemiBold', width: '85%',marginLeft:"1%" }}>
            Symptom & Condition Guide
          </Text>
          <TouchableOpacity style={{marginRight:"5%"}} onPress={toggleOptionsModal}>
               <Feather name={"more-vertical"} size={24} color="black" />
            </TouchableOpacity>
        </View>
        
        <ScrollView onScroll={()=>setOptionsVisible(false)}>
          <Text className="my-3 p-3 text-2xl" style={{ fontFamily: "Gabarito-SemiBold" }}>{disease.name}</Text>
          
          <View className="flex-row self-center gap-2 my-3 " style={{ marginTop: "-1%" }}>
            <TouchableOpacity onPress={() => openImageViewer(0)}>
              <Image source={slide1Picture} style={{ height: 155, width: 155, borderRadius: 10 }} />
            </TouchableOpacity>
            <View className="flex-col" style={{ gap: 4 }}>
              <TouchableOpacity onPress={() => openImageViewer(1)}>
                <Image source={slide2Picture} style={{ height: 75, width: 75, borderRadius: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openImageViewer(2)}>
                <View style={styles.imageContainer}>
                  <Image source={slide3Picture} style={styles.image} />
                  <Text style={styles.overlayText}>+2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
              {disease.overview && <Section title="Overview" content={disease.overview} />}
              {disease.symptoms && <Section title="Symptoms" content={disease.symptoms} />}
              {disease.diagnosis && <Section title="Diagnosis" content={disease.diagnosis} />}
              {disease.treatment && <Section title="Treatment" content={disease.treatment} />}
              {disease.prevention && <Section title="Prevention" content={disease.prevention} />}
              {disease.prognosis && <Section title="Prognosis" content={disease.prognosis} />}
        </ScrollView>
      </View>
      
      {/* Image Viewing modal */}
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        onImageIndexChange={setCurrentImageIndex} // Update current image index on swipe
        FooterComponent={renderFooter} // Add the footer component
      />
      {/* OPTIONS MODAL */}
       <Modal isVisible={isOptionsVisible} hasBackdrop={false} coverScreen={false} onBackdropPress={toggleOptionsModal} onBackButtonPress={toggleOptionsModal} animationIn="pulse" animationOut="pulse">
       <View style={{elevation:10,padding:"3%",width:"60%",borderTopRightRadius:0,marginTop:"-130%",marginRight:"7%",alignSelf:"flex-end",}} className="bg-gray-100 rounded-xl flex-col py-4">
       <TouchableOpacity className="flex-row p-1 w-full justify-between items-center" onPress={copyToClipboard}>
        <Feather name="copy" size={24} color="black" />
         <Text className="text-xl font-semibold w-full text-left mx-2" style={{fontFamily:"Gabarito-Regular"}}>Copy to Clipboard</Text>
        </TouchableOpacity>  
        <TouchableOpacity className="flex-row p-1 w-full justify-between items-center" onPress={summarizeWithAI}>
          <AntDesign name="profile" size={24} color="black" />
         <Text className="text-xl font-semibold w-full text-left mx-2" style={{fontFamily:"Gabarito-Regular"}}>Summarise with AI</Text>
        </TouchableOpacity>   
        <TouchableOpacity className="flex-row p-1 w-full justify-between items-center" onPress={()=>navigation.navigate('Home')}>
        <Octicons name="home" size={24} color="black" />
         <Text className="text-xl font-semibold w-full text-left mx-2" style={{fontFamily:"Gabarito-Regular"}}>Home</Text>
        </TouchableOpacity>  
       </View>
      </Modal>
      {/* SUMMARISE MODAL */}
      <Modal isVisible={isSummaryShown} hasBackdrop={false} coverScreen={false} onBackdropPress={toggleModal} onBackButtonPress={toggleModal}>
        <View behavior='padding' className="bg-gray-100 self-center rounded-3xl" style={{ "width": "110%", "height": "70%",marginTop:"80%", borderBottomRightRadius: 0, borderBottomLeftRadius: 0, elevation: 10,marginBottom:"10%" }}>
          <View style={{ zIndex: 100, "height": "1%", width: "20%", marginTop: "2%" }} className="self-center bg-gray-300 rounded-full">
          </View>
          <View className="flex-row justify-between " style={{ marginTop: "2%" }}>
            <TouchableOpacity onPress={toggleModal} style={{ zIndex: 100 }}>
              <AntDesign name="close" color="black" size={25} className="self-start" style={{ marginLeft: "15%" }}/>
            </TouchableOpacity>
            <Text className="text-2xl text-center " style={{ "fontFamily": "Gabarito-SemiBold", "marginLeft": "-21%",paddingLeft:"10%" }}>Summary</Text>
            <TouchableOpacity style={{marginRight:"5%"}}  onPress={copySummary}>
            <Feather name="copy" size={24} color="#6b7280" />
            </TouchableOpacity>   
          </View>
          {
            isSummarizing ?(<ActivityIndicator size={35} color="#6b7280" className="bg-gray-200 self-center rounded-full p-2" style={{marginTop:"30%",elevation:10}}/>):(<ScrollView className="p-3 " style={{paddingBottom:"6%"}}>
              <Text selectable={true} style={{ fontSize: 17,
      color: '#6b7280',
      lineHeight: 24,
      fontFamily:"Gabarito-Regular",textAlign:"center",paddingBottom:"10%"}}>
          {summaryText}
            </Text>
            </ScrollView>   
            )
          } 
        </View>
      </Modal>
    </View>
  );
};

const Section = ({ title, content }) => (
  <View style={styles.section}>
    <Text selectable={true} style={styles.sectionTitle}>{title}</Text>
    <Text selectable={true} style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    height: 75,
    width: 75,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    opacity: 0.3,
    backgroundColor: 'black',
  },
  overlayText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    fontSize: 20,
    fontFamily: "Gabarito-SemiBold",
    color: "white",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  footerContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    fontFamily:"Gabarito-Regular"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: 'red',
  },
  section: {
    padding:12
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily:"Gabarito-SemiBold",
    color: 'black',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 17,
    color: '#6b7280',
    lineHeight: 24,
    fontFamily:"Gabarito-Regular"
  },
});

export default DiseaseDetails;

