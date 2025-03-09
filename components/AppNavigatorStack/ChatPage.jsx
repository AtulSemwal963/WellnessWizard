import React, { useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Keyboard, Platform,Image,Vibration,ToastAndroid,useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Modal from "react-native-modal";
import { useIsFocused} from '@react-navigation/native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { ChatDatabaseManager } from '../HelperComponents/UtilityClasses/LocalDatabaseManagers.js';
import {UserManager} from "../HelperComponents/UtilityClasses/CloudServicesManager.js";


import ChatModalComponent from './ChatModalComponent.jsx';
import ImagePickerComponent from '../HelperComponents/ImagePickerComponent.jsx';
import { setGlobalState } from '../HelperComponents/GlobalState.js';
import chatLoadingGif from '../../assets/images/chatLoadingGif.gif'
//const botProfilePic= require('../../assets/images/botProfilePic.png')
const userProfilePlaceholder = require('../../assets/images/userProfilePic.png');


export default function ChatPage({ navigation, route }) {
  const [showChild, setShowChild] = useState(false);
  const [triggerImagePicker, setTriggerImagePicker] = useState(false);
  const [chatText, setChatText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOptionsVisible,setOptionsVisible]=useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setLoading] = useState(false); // Loading state
  const [profilePic, setProfilePic] = useState(null);
  const [wasKeyboardTapped,setKeyboardTapped]=useState(false);
  const [openRecordingModal,setRecordingModal]=useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chatRealmInstance, setChatRealmInstance] = useState(null);
  const [archiveRealmInstance, setArchiveRealmInstance] = useState(null);
  const [startNewChat,setStartNewChat]=useState(false);
  const [showArchiveModal,setArchiveModal]=useState(false);
  const [chatName,setChatName]=useState("Chat-"+Date.now());
    const [showComingSoonModal,setComingSoonModal]= useState(false);
  const childRef = useRef(null);
  const chatModalRef = useRef(null);
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const [botProfilePic,setBotProfilePic]=useState(null);
  useEffect(() => {
    if(colorScheme=="dark"){
      setBotProfilePic(require('../../assets/images/botProfilePic-dark.png'))
    }
    else setBotProfilePic(require('../../assets/images/botProfilePic-light.png'));
    console.log(`The device theme is: ${colorScheme}`); // Logs 'light' or 'dark'
  }, [colorScheme]);

  useEffect(() => {
    ChatDatabaseManager.initializeCurrentChatRealm(setChatRealmInstance);
    ChatDatabaseManager.initializeArchivedChatRealm(setArchiveRealmInstance);
  }, []);
  
  
  useEffect(() => {
    if (isFocused) {
      setGlobalState('lastVisitedTab', 'Chat');
    }
  }, [isFocused]);

  useEffect(() => {
    UserManager.fetchUserProfilePicture(setProfilePic);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardTapped(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardTapped(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error messsage:", event.message);
  });

  const startRecording = async () => {
    ToastAndroid.show('Hold to start recording, release to stop', ToastAndroid.SHORT);
    Vibration.vibrate(70);
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
    });
  };

  const stopRecording = async () => {
    ExpoSpeechRecognitionModule.stop;
  }
  const toggleModal = () => {
    setOptionsVisible(false)
    setModalVisible(!isModalVisible);
  };

  const toggleOptionsModal = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  const handleReload = () => {
    if (chatModalRef.current) {
      chatModalRef.current.onRefresh();
    }
    toggleOptionsModal()
  };

  useEffect(() => {
    if (route.params?.isModalVisible !== undefined) {
      setModalVisible(route.params.isModalVisible);
    }
  }, [route.params]);

  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
  });

  if (!loaded && !error) {
    return null;
  }

  const openImagePickerComponent = () => {
    setShowChild(true);
    setTriggerImagePicker(true);
  };

  const handleChatTextChange = (text) => {
    setChatText(text);
  };

  const sendTextChat = async () => {
    const message = {
        messageId: Date.now().toString(),
        role: "user",
        highlighted: false,
        parts: [{ text: chatText }],
    };

    setLoading(true);
    setChatText('');

    ChatDatabaseManager.addMessageToCurrentChatRealm(chatRealmInstance,message);
    await retrieveAIResponse(chatText);
};


  const sendRecordedTextToChat=async()=>{
    setRecordingModal(false);
    const message = {
      messageId: Date.now().toString(),
      role: "user",
      highlighted:false,
      parts: [{ text: transcript }],
    };
    setLoading(true);
  ChatDatabaseManager.addMessageToCurrentChatRealm(chatRealmInstance,message);
    await retrieveAIResponse(transcript);
    setTranscript('');
  }
 
  const retrieveAIResponse = async (userQuery) => {
    try {
        const data = await fetch("https://wwgeminibackend.onrender.com/chatwellnessAI/sendHealthQuery", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userQuery }),
        });

        const response = await data.json();
        const aiMessage = {
            messageId: `AI${Date.now()}`,
            role: 'model',
            highlighted: false,
            parts: [{ text: response.response }],
        };

      ChatDatabaseManager.addMessageToCurrentChatRealm(chatRealmInstance,aiMessage);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching AI response:", error);
        setLoading(false);
    }
};

  useEffect(() => {
    if (triggerImagePicker && childRef.current) {
      childRef.current.pickImage();
      setTriggerImagePicker(false);
    }
  }, [triggerImagePicker, childRef]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleStartNewChat = () => {
    if (chatRealmInstance) {
    ChatDatabaseManager.clearAllMessagesInCurrentChatRealm(chatRealmInstance);
    }
    toggleModal();
  };

  const handleArchiveChat = () => {
    setArchiveModal(false);

    if (!chatRealmInstance || !archiveRealmInstance) {
        console.error("Realms are not initialized.");
        return;
    }

    ChatDatabaseManager.archiveCurrentChat(chatRealmInstance,archiveRealmInstance,chatName,setChatName);
    handleStartNewChat();
        
    // Show Android toast and vibration for feedback
    if (Platform.OS === "android") {
        ToastAndroid.show(
            "Chat saved. Visit Profile > View Archive for offline access.",
            ToastAndroid.LONG
        );
        Vibration.vibrate(70);
        setOptionsVisible(false);
    }

    // Reset chat name for the new session
    setChatName("Chat-" + Date.now());
};

  
  return (
    <View className="bg-gray-300">
      <View className="self-center flex-col items-center bg-gray-100 h-full rounded-3xl" style={{ "width": "96%", "marginTop": "2%",borderBottomRightRadius:0,borderBottomLeftRadius:0 }}>
      <View className="flex-row w-full justify-between items-center">
              <TouchableOpacity className="py-3 px-3 flex-row items-center" onPress={() => navigation.openDrawer()}>
              <Image
        source={profilePic ? { uri: profilePic } : userProfilePlaceholder}
        style={{ height: 33, width: 33, borderRadius: 9999 ,borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)',resizeMode: 'cover',
          overflow: 'hidden'}} 
      />
                 <AntDesign name={"menu-fold"} size={20} color={"black"}/>
              </TouchableOpacity>
              <Text className="text-xl font-semibold p-3 text-left" style={{"fontFamily":"Gabarito-SemiBold",width:"50%",marginRight:"23%"}}>Chat with Wellness AI</Text>
            </View>
        <View className="flex-col w-full px-2 justify-between" style={{ height: "17%", marginTop: "10%" }}>
          <TouchableOpacity onPress={()=>setStartNewChat(true)} className="flex-row w-full justify-between bg-gray-200 rounded-lg">
            <Text className="text-2xl font-semibold p-3" style={{ "fontFamily": "Gabarito-SemiBold" }}>Start New Chat</Text>
            <Ionicons name={"add"} size={27} color={"rgb(107 114 128)"} style={{ marginTop: 10, marginRight: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row w-full justify-between bg-gray-200 rounded-lg" onPress={toggleModal}>
            <Text className="text-2xl font-semibold p-3 " style={{ "fontFamily": "Gabarito-SemiBold" }}>Continue Last Chat</Text>
            <AntDesign name={"caretright"} size={27} color={"rgb(107 114 128)"} style={{ marginTop: 10, marginRight: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={isModalVisible} hasBackdrop={false} coverScreen={false} onBackdropPress={toggleModal} onBackButtonPress={toggleModal}>
        <View behavior='padding' className="bg-gray-100 self-center rounded-3xl" style={{ "width": "110%", "height": "97%", marginTop: "13%", borderBottomRightRadius: 0, borderBottomLeftRadius: 0, elevation: 10 }}>
          <View style={{ zIndex: 100, "height": "1%", width: "20%", marginTop: "2%" }} className="self-center bg-gray-300 rounded-full">
          </View>
          <View className="flex-row justify-between " style={{ marginTop: "2%" }}>
            <TouchableOpacity onPress={toggleModal} style={{ zIndex: 100 }}>
              <Ionicons name={"arrow-back"} color="black" size={27} className="self-start" style={{ marginLeft: "15%" }} />
            </TouchableOpacity>
            <Text className="text-2xl text-center " style={{ "fontFamily": "Gabarito-SemiBold", "marginLeft": "-21%",paddingLeft:"10%" }}>AI analysis</Text>
            <TouchableOpacity style={{marginRight:"5%"}}  onPress={toggleOptionsModal}>
               <Feather name={"more-vertical"} size={24} color="black" />
            </TouchableOpacity>
           
          </View>
            <ChatModalComponent ref={chatModalRef} realmInstance={chatRealmInstance}/>
            {
            isLoading ? 
            <View className="flex-col self-start my-3" style={{width:"80%"}}>
                <View className="flex-row ">
                 <Image source={botProfilePic} style={{ height: 40, width: 40,resizeMode: 'contain' }} className="rounded-full self-end mx-1" />
                  <Image source={chatLoadingGif} style={{height:40,width:60}} className=" text-base p-2 rounded-xl" />
                </View>
            </View>
            :null
          }
          <KeyboardAvoidingView className="self-center flex-row justify-between items-center" style={{ height: 60, width: "100%", marginBottom: keyboardVisible ? "8%" : 0 }} onTouchStart={()=>setOptionsVisible(false)}>
            {
              !wasKeyboardTapped?( <TouchableOpacity className="p-2 flex-col items-center justify-center mx-1" style={{ height: "80%", "backgroundColor": "#758DA3",borderRadius:9999,height:50,width:50 }} onPress={()=>setComingSoonModal(true)}>
                <Feather name="image" size={20} color={"white"} style={{ marginRight: "3%" }} />
              </TouchableOpacity>):(null)
            }
           
            {showChild && <ImagePickerComponent ref={childRef} />}
            <View className="bg-gray-200 px-4 flex-row " style={{ width: wasKeyboardTapped?"95%":"65%", height: "80%",borderRadius:9999,borderWidth:1, borderColor:"rgba(107,114,128,0.5)",marginLeft:wasKeyboardTapped?"3%":0 }}>
              <TextInput onPress={()=>setKeyboardTapped(true)} placeholder='Tell us more' style={{ width: "90%", height: "100%", fontFamily: "Gabarito-Regular" }} className="text-lg" onChangeText={handleChatTextChange} value={chatText} onSubmitEditing={sendTextChat} blurOnSubmit={false} returnKeyType="send" />
              <TouchableOpacity className="h-full flex-col justify-center items-center" onPress={sendTextChat}>
                <Feather name="send" size={20} color={"rgb(107 114 128)"} />
              </TouchableOpacity>
            </View>
            {
              !wasKeyboardTapped?(<TouchableOpacity className="p-2 flex-col items-center justify-center mx-1" style={{ height: "80%", "backgroundColor": "rgb(239 68 68)",borderRadius:9999,height:50,width:50 }} onPress={()=>setRecordingModal(true)}>
                <Feather name="mic" size={20} color={"white"} style={{ marginRight: "3%" }} />
              </TouchableOpacity>):(null)
            }
          </KeyboardAvoidingView>
                {/* OPTIONS MODAL */}
          <Modal isVisible={isOptionsVisible} hasBackdrop={false} coverScreen={false} onBackdropPress={toggleOptionsModal} onBackButtonPress={toggleOptionsModal} animationIn="pulse" animationOut="pulse">
       <View style={{marginTop:"-114%",marginLeft:"46%",elevation:10,padding:"3%",width:"50%",borderTopRightRadius:0}} className="bg-gray-100 rounded-xl flex-col py-4">
        <TouchableOpacity className="flex-row p-1 w-full justify-between items-center" style={{marginBottom:"3%"}} onPress={handleReload}>
          <MaterialCommunityIcons name={"reload"} size={24} color="black"/>
          <Text className="text-xl font-semibold w-full text-left mx-2" style={{fontFamily:"Gabarito-Regular"}}>Reload</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row p-1 w-full justify-between items-center" onPress={()=>{setOptionsVisible(false);setArchiveModal(true)}}>
          <Octicons name={"archive"} size={24} color="black"/>
         <Text className="text-xl font-semibold w-full text-left mx-2" style={{fontFamily:"Gabarito-Regular"}}>Archive Chat</Text>
        </TouchableOpacity>   
       </View>
      </Modal>

      {/* VOICE RECORDING MODAL */}
      <Modal isVisible={openRecordingModal} hasBackdrop={true} coverScreen={true} onBackButtonPress={()=>setRecordingModal(false)} onBackdropPress={()=>setRecordingModal(false)} backdropOpacity={0.2} animationIn="slideInUp" animationOut="slideOutDown">
      <View behavior='padding' className="bg-gray-100 self-center rounded-3xl" style={{position:"absolute", "width": "110%", "height": "50%", bottom:"-3%", borderBottomRightRadius: 0, borderBottomLeftRadius: 0, elevation: 10 }}>
      <View className="flex-row justify-around py-3" style={{ marginTop: "2%" }}>
            <TouchableOpacity onPress={()=>setRecordingModal(false)} style={{ zIndex: 100 }}>
              <AntDesign name="close" color="black" size={25} className="self-start" style={{ marginLeft: "15%" }}/>
            </TouchableOpacity>
            <Text className="text-2xl text-center " style={{ "fontFamily": "Gabarito-SemiBold", "marginLeft": "-21%",width:"90%" }}>Speech to Text</Text>
          
          </View>
          <TextInput placeholder='Tap and hold the mic to let us know how you’re feeling' value={transcript} onChangeText={(text)=>setTranscript(text)} className="p-2 text-3xl self-center text-gray-500" multiline={true} style={{width:"90%",fontFamily:"Gabarito-Regular"}}/>
          <TouchableOpacity className="p-2 flex-col items-center justify-center mx-1 self-center" style={{ position:"absolute",bottom:"5%",height: "80%", "backgroundColor": "rgb(239 68 68)",borderRadius:9999,height:50,width:50,elevation:5 }} onPressIn={startRecording}
      onPressOut={stopRecording}>
                <Feather name="mic" size={20} color={"white"} style={{ marginRight: "3%" }} />
              </TouchableOpacity>
              {
                transcript.length!=0 && 
                <TouchableOpacity className="p-2 flex-col items-center justify-center mx-1 rounded-lg" style={{ position:"absolute",bottom:"5%",right:"5%",height: "80%", "backgroundColor": "rgba(117, 141, 163,0.6)",height:50,width:50 }} onPress={sendRecordedTextToChat}>
                <Feather name="send" size={20} color={"white"} style={{ marginRight: "3%" }} />
              </TouchableOpacity>
              }
      </View>
      </Modal>
        </View>
     
      </Modal>

      {/* Start NEW CHAT */}
      <Modal
      animationIn={"bounceIn"}
      animationOut={"bounceOut"}
  isVisible={startNewChat}
  onBackdropPress={() => setStartNewChat(false)}
>
  <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-xl text-gray-500 text-center" >Are you sure you want to start a new chat?</Text>
          <View className="flex-row w-full justify-between">
           <TouchableOpacity
                  onPress={() => {
                    setStartNewChat(false);
                   handleStartNewChat();
                  }}
                  style={{
                    backgroundColor: 'rgba(117, 141, 163, 0.2)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStartNewChat(false)}  style={{
                    backgroundColor: 'rgb(117, 141, 163)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                <Text style={{ color: 'white',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Cancel</Text>
                </TouchableOpacity> 
          </View>
          
        </View>
</Modal>
{/* ARCHIVE CHAT MODAL */}
<Modal
      animationIn={"bounceIn"}
      animationOut={"bounceOut"}
  isVisible={showArchiveModal}
  onBackdropPress={() => setStartNewChat(false)}
>
  <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-xl text-gray-500 text-center" >Archive this chat to start a new one. Are you sure?</Text>
          <Text style={{ fontFamily:"Gabarito-Regular",width:"90%" }} className="text-lg text-gray-500 text-left" >Save as</Text>
          <TextInput className="bg-gray-200 self-center text-lg p-1 px-3  rounded-md" value={chatName} onChangeText={(text)=>setChatName(text)} style={{ width: "90%", fontFamily: "Gabarito-Regular", borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)',marginBottom:10 }}></TextInput>
          <View className="flex-row w-full justify-between">
           <TouchableOpacity
                  onPress={() => {
                    handleArchiveChat();
                  }}
                  style={{
                    backgroundColor: 'rgba(117, 141, 163, 0.2)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>setArchiveModal(false)}  style={{
                    backgroundColor: 'rgb(117, 141, 163)',
                    borderRadius: 5,
                    padding: 10,
                    width: '40%',
                    alignItems: 'center',
                  }}>
                <Text style={{ color: 'white',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Cancel</Text>
                </TouchableOpacity> 
          </View>
          
        </View>
</Modal>
             <Modal
                    animationIn={"bounceIn"}
                    animationOut={"bounceOut"}
                    isVisible={showComingSoonModal}
                    onBackdropPress={() => setComingSoonModal(false)}
                  >
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
                    <Text className=" w-full text-xl font-semibold text-center  self-center " style={{"fontFamily":"Gabarito-SemiBold"}}>Coming Soon!</Text>
                    <Ionicons name="construct" size={54} color="#6b7280" style={{marginTop:"5%"}}/>
                      <Text style={{ marginVertical: 10,fontFamily:"Gabarito-Regular" }} className="text-xl text-gray-500 text-center" >This service is under active development. We'll try to have it up and running for you as soon as we can.</Text>
                      <View className="flex-row w-full justify-center">
                       <TouchableOpacity
                              onPress={() => {
                                setComingSoonModal(false)
                              }}
                              style={{
                                backgroundColor: 'rgba(117, 141, 163, 0.2)',
                                borderRadius: 5,
                                padding: 10,
                                width: '40%',
                                alignItems: 'center',
                              }}>
                              <Text style={{ color: 'black',fontFamily:"Gabarito-SemiBold" }} className="text-xl" >Ok</Text>
                            </TouchableOpacity>
                      </View>
                      
                    </View>
                  </Modal>
      <View className="self-center" style={{position:"absolute",bottom:"1%"}}>
      <BannerAd 
        size={BannerAdSize.BANNER}
        unitId="ca-app-pub-3940256099942544/9214589741"  
        onAdLoaded={() => {
          console.log('Advert loaded');
        }}
        onAdFailedToLoad={error => {
          console.error('Advert failed to load: ', error);
        }}/>
    </View> 
    </View>

  );
}

