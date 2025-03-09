import React, { useState, useRef, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  KeyboardAvoidingView,
  TextInput,
  BackHandler,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons.js";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign.js";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import Modal from "react-native-modal";

import ImagePickerComponent from "../HelperComponents/ImagePickerComponent.jsx";
const ChatHistory = require("./ChatHistory.json");
import {
  setGlobalState,
} from "../HelperComponents/GlobalState.js";
import {UserManager} from "../HelperComponents/UtilityClasses/CloudServicesManager.js";
import { ChatDatabaseManager } from '../HelperComponents/UtilityClasses/LocalDatabaseManagers.js';
const userProfilePlaceholder = require("../../assets/images/userProfilePic.png");

export default function HomePage({ navigation, route }) {
  const childRef = useRef(null);
  const [showChild, setShowChild] = useState(false);
  const [triggerImagePicker, setTriggerImagePicker] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatHistory, setChatHistory] = useState([...ChatHistory]);
  const [backPressCount, setBackPressCount] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const isFocused = useIsFocused();
  const [showComingSoonModal, setComingSoonModal] = useState(false);
  const [chatRealmInstance, setChatRealmInstance] = useState(null);
  const [loaded, error] = useFonts({
    "Gabarito-Regular": require("../../assets/fonts/Gabarito-Regular.ttf"),
    "Gabarito-Medium": require("../../assets/fonts/Gabarito-Medium.ttf"),
    "Gabarito-SemiBold": require("../../assets/fonts/Gabarito-SemiBold.ttf"),
    "Gabarito-Bold": require("../../assets/fonts/Gabarito-Bold.ttf"),
  });

  const navigateToChatModalComponent = () => {
    sendTextChat();
    navigation.navigate("Chat", {
      chatHistory: [...ChatHistory],
      isModalVisible: true,
    });
  };

  const openImagePickerComponent = () => {
    setShowChild(true);
    setTriggerImagePicker(true);
  };

  useEffect(() => {
    if (triggerImagePicker && childRef.current) {
      childRef.current.pickImage();
      setTriggerImagePicker(false);
    }
  }, [triggerImagePicker, childRef]);

  useEffect(() => {
    if (isFocused) {
      setGlobalState("lastVisitedTab", "Home");
    }
  }, [isFocused]);

  useEffect(() => {
    UserManager.fetchUserProfilePicture(setProfilePic);
  }, []);

  useEffect(() => {
    const message = route?.params?.message;
    console.log("Message from questionnaire:", message);
    
    // If there's a valid message, set it to chat and send
    if (message) {
        setChatText(message);
        // We need to wait for chatText to be set before sending
        setTimeout(() => {
            navigateToChatModalComponent();
        }, 100);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount === 0) {
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
          setBackPressCount(1);

          // Reset the backPressCount after a short delay to wait for double back press
          setTimeout(() => setBackPressCount(0), 2000);
          return true;
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [backPressCount])
  );

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
    ChatDatabaseManager.addMessageToCurrentChatRealm(chatRealmInstance,message);
    await retrieveAIResponse(chatText);
    // setChatText('');
};

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

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="bg-gray-300 h-full">
      <View
        className="self-center flex-col items-center bg-gray-100 h-full rounded-3xl"
        style={{
          width: "96%",
          marginTop: "2%",
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <ScrollView
          className="self-center flex-col "
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View className="flex-row w-full justify-between items-center">
            <TouchableOpacity
              className="py-3 px-3 flex-row items-center"
              onPress={() => navigation.openDrawer()}
            >
              <Image
                source={
                  profilePic ? { uri: profilePic } : userProfilePlaceholder
                }
                style={{
                  height: 33,
                  width: 33,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: "rgba(107,114,128,0.5)",
                  resizeMode: "cover",
                  overflow: "hidden",
                }}
              />
              <AntDesign name={"menu-fold"} size={20} color={"black"} />
            </TouchableOpacity>
            <Text
              className="text-xl font-semibold p-3 text-center"
              style={{
                fontFamily: "Gabarito-SemiBold",
                width: "50%",
                marginRight: "26%",
              }}
            >
              Home
            </Text>
          </View>

          <Text
            className="text-2xl font-semibold p-2 w-full text-left px-4"
            style={{ fontFamily: "Gabarito-SemiBold" }}
          >
            What can we help you with today?
          </Text>
          <Text
            className="text-lg p-2 text-gray-500"
            style={{ fontFamily: "Gabarito-Regular" }}
          >
            We'll use this to recommend the best tests and scans for you.
          </Text>
          <View
            style={{
              flex: 1,
              width: 320,
              height: 130,
              display: "flex",
              flexWrap: "wrap",
            }}
            className="bg-gray-200 p-3 rounded-xl flex-col"
          >
            <TextInput
              onChangeText={(text) => handleChatTextChange(text)}
              value={chatText}
              placeholder="Describe your symptoms"
              placeholderTextColor="#758DA3"
              className="w-full text-lg"
              style={{
                height: "58%",
                display: "flex",
                flexWrap: "wrap",
                textAlignVertical: "top",
                fontFamily: "Gabarito-Regular",
              }}
              multiline={true}
            />
            <TouchableOpacity
              className="self-end p-2 rounded-lg"
              style={{ backgroundColor: "rgba(117, 141, 163,0.6)" }}
              onPress={navigateToChatModalComponent}
            >
              <Feather name="send" size={25} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-gray-200 rounded-lg"
            style={{ width: "90%", marginTop: "5%", marginBottom: "5%" }}
            onPress={() => setComingSoonModal(true)}
          >
            <Text
              className="text-center p-2 font-semibold text-lg"
              style={{ fontFamily: "Gabarito-SemiBold" }}
            >
              Upload Image
            </Text>
          </TouchableOpacity>
          {showChild && <ImagePickerComponent ref={childRef} />}
          <Text
            className="text-2xl font-semibold p-2 w-full text-left px-4"
            style={{ fontFamily: "Gabarito-SemiBold" }}
          >
            {" "}
            Explore More
          </Text>
          <View
            className="flex-col justify-between items-end"
            style={{ width: "89%" }}
          >
            <TouchableOpacity
              className="flex-row py-3 w-full justify-around"
              onPress={() => setComingSoonModal(true)}
            >
              <View
                className=" bg-fuchsia-300 flex-col items-center justify-center w-1/4"
                style={{ width: 60, height: 60, borderRadius: 17 }}
              >
                <Octicons name="multi-select" size={30} color="white" />
              </View>
              <View style={{ width: "80%", paddingHorizontal: "3%" }}>
                <Text
                  className="text-lg"
                  style={{ fontFamily: "Gabarito-SemiBold" }}
                >
                  Daily Checkup
                </Text>
                <Text
                  className="text-gray-500 text-base"
                  style={{ fontFamily: "Gabarito-Regular" }}
                >
                  Answer quick health questions and get insights and reports for
                  the day.
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row py-3 w-full justify-around"
              onPress={() => navigation.navigate("SearchGlossary")}
            >
              <View
                className=" bg-indigo-300 flex-col items-center justify-center w-1/4"
                style={{ width: 60, height: 60, borderRadius: 17 }}
              >
                <Octicons name="book" size={30} color="white" />
              </View>
              <View style={{ width: "80%", paddingHorizontal: "3%" }}>
                <Text
                  className="text-lg"
                  style={{ fontFamily: "Gabarito-SemiBold" }}
                >
                  Symptom & Condition Guide
                </Text>
                <Text
                  className="text-gray-500 text-base"
                  style={{ fontFamily: "Gabarito-Regular" }}
                >
                  Look up health conditions, symptoms, and recommended
                  treatments.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View className="h-max" style={{ position: "absolute", bottom: "1%" }}>
          <BannerAd
            size={BannerAdSize.BANNER}
            unitId="ca-app-pub-3940256099942544/9214589741"
            onAdLoaded={() => {
              console.log("Advert loaded");
            }}
            onAdFailedToLoad={(error) => {
              console.error("Advert failed to load: ", error);
            }}
          />
        </View>
      </View>
      <Modal
        animationIn={"bounceIn"}
        animationOut={"bounceOut"}
        isVisible={showComingSoonModal}
        onBackdropPress={() => setComingSoonModal(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text
            className=" w-full text-xl font-semibold text-center  self-center "
            style={{ fontFamily: "Gabarito-SemiBold" }}
          >
            Coming Soon!
          </Text>
          <Ionicons
            name="construct"
            size={54}
            color="#6b7280"
            style={{ marginTop: "5%" }}
          />
          <Text
            style={{ marginVertical: 10, fontFamily: "Gabarito-Regular" }}
            className="text-xl text-gray-500 text-center"
          >
            This service is under active development. We'll try to have it up
            and running for you as soon as we can.
          </Text>
          <View className="flex-row w-full justify-center">
            <TouchableOpacity
              onPress={() => {
                setComingSoonModal(false);
              }}
              style={{
                backgroundColor: "rgba(117, 141, 163, 0.2)",
                borderRadius: 5,
                padding: 10,
                width: "40%",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "black", fontFamily: "Gabarito-SemiBold" }}
                className="text-xl"
              >
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
