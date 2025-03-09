
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, RefreshControl, TouchableOpacity,useColorScheme } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import botProfilePic from '../../../../assets/images/botProfilePic.png';
import defaultUserProfilePic from '../../../../assets/images/userProfilePic.png';
import { setGlobalState, useGlobalState } from '../../../HelperComponents/GlobalState';
import { ChatDatabaseManager } from '../../../HelperComponents/UtilityClasses/LocalDatabaseManagers';

export default function ArchivedChat({navigation,route }) {
  const [selectedChat, setSelectedChat] = useGlobalState("selectedItem");
    const [realmInstance, setRealmInstance] = useGlobalState("archivedChatsRealmInstance");
    const [messages, setMessages] = useState([]);
    const [userProfilePic, setUserProfilePic] = useState(defaultUserProfilePic);
    const [userFirstName, setUserFirstName] = useState("User");
    const [showDeleteModal,setDeleteModal]=useState(false);
    const { chatId } = route.params || {};
   const colorScheme = useColorScheme();
    const [botProfilePic,setBotProfilePic]=useState(null);
    useEffect(() => {
      if(colorScheme=="dark"){
        setBotProfilePic(require('../../../../assets/images/botProfilePic-dark.png'))
      }
      else setBotProfilePic(require('../../../../assets/images/botProfilePic-light.png'));
      console.log(`The device theme is: ${colorScheme}`); // Logs 'light' or 'dark'
    }, [colorScheme]);

    useEffect(() => {
     ChatDatabaseManager.fetchMessagesFromCurrentArchivedChat(chatId,realmInstance,setSelectedChat,setMessages)  
    } 
    , [route.params, realmInstance]);
  
    const handleDeleteArchivedChat = () => {
      ChatDatabaseManager.deleteCurrentArchivedChat(selectedChat,realmInstance,setSelectedChat,setMessages);
      setTimeout(() => {
        // Trigger the global refresh
        setGlobalState('shouldRefreshArchivedChats', Date.now());  // Update the refresh trigger
        navigation.goBack(); // Navigate back after cleanup
      }, 200);
    };
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const storedUserInfo = await AsyncStorage.getItem("userInfo");
          if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            if (parsedUserInfo.picture) {
              setUserProfilePic({ uri: parsedUserInfo.picture });
            }
            if (parsedUserInfo.name) {
              const firstName = parsedUserInfo.name.split(" ")[0];
              setUserFirstName(firstName);
            }
          }
        } catch (error) {
          console.error("Error loading user profile information:", error);
        }
      };
  
      fetchUserProfile();
    }, []);
  // Render individual messages
  // const Message = ({ sender, body, highlighted }) => {
  //   const backgroundColor = highlighted ? 'rgb(245 158 11)' : '#d1d5db';
  //   const isBot = sender === 'model';

  //   return (
  //     <View className={`flex-col my-3 ${isBot ? 'self-start' : 'items-end self-end'}`} style={{ width: '80%' }}>
  //       <Text
  //         style={{
  //           fontFamily: 'Gabarito-Regular',
  //           marginLeft: isBot ? '19%' : undefined,
  //           marginRight: isBot ? undefined : '19%',
  //           color: '#758DA3',
  //         }}
  //       >
  //         {isBot ? `Wellness AI${highlighted ? ' (Response Highlighted)' : ''}` : userFirstName}
  //       </Text>
  //       <View className="flex-row">
  //         {isBot && (
  //           <Image source={botProfilePic} style={{ height: 40, width: 40 }} className="rounded-full mx-1 opacity-80" />
  //         )}
  //         <Text
  //           className="text-lg p-2 rounded-xl"
  //           style={{
  //             fontFamily: 'Gabarito-Regular',
  //             backgroundColor,
  //           }}
  //         >
  //           {body}
  //         </Text>
  //         {!isBot && (
  //           <Image
  //             source={userProfilePic}
  //             style={{
  //               height: 40,
  //               width: 40,
  //               borderRadius: 9999,
  //               borderWidth: 1,
  //               borderColor: 'rgba(107,114,128,0.5)',
  //               resizeMode: 'cover',
  //               overflow: 'hidden',
  //             }}
  //             className="rounded-full mx-1"
  //           />
  //         )}
  //       </View>
  //     </View>
  //   );
  // };
  const Message = ({ sender, body, messageId,highlighted }) => {
    const backgroundColor = highlighted ? 'rgb(245 158 11)' : '#d1d5db';

   const handleDoubleTap = (messageId) => {
     Vibration.vibrate(70);
   
     if (realmInstance) {
       const targetMessage = realmInstance.objects("MessageSchema").filtered(`messageId == "${messageId}"`)[0];
       
       if (targetMessage) {
         realmInstance.write(() => {
           targetMessage.highlighted = !targetMessage.highlighted; // Toggle highlighted state
         });
       }
     }
   };
   

   if (sender === "model") {
     return (
       <View className="flex-col self-start my-3" style={{ width: "80%" }}>
         <Text className="text-md" style={{ fontFamily: "Gabarito-Regular", marginLeft: "19%", color: "#758DA3" }}>
           Wellness Wizard
           {highlighted?" (Response Highlighted)":""}
         </Text>
             <View className="flex-row">
               <Image source={botProfilePic} style={{ height: 40, width: 40, // Scale down the content to 50%
               resizeMode: 'contain' }} className="rounded-full self-end mx-1" />
               <Text className="text-lg p-2 rounded-xl" style={{ fontFamily: "Gabarito-Regular", backgroundColor }}>{body}</Text>
             </View>
       </View>
     );
   } else {
     return (
       <View className="flex-col items-end self-end my-3" style={{ width: "80%" }}>
         <Text className="text-md" style={{ fontFamily: "Gabarito-Regular", marginRight: "19%", color: "#758DA3" }}>
         {userFirstName}
         </Text>
         <View className="flex-row">
           <Text className="text-lg p-2 rounded-xl" style={{ fontFamily: "Gabarito-Regular", backgroundColor: "rgba(117, 141, 163,0.6)" }}>{body}</Text>
           <Image source={userProfilePic} style={{ height: 40, width: 40,borderRadius: 9999 ,borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)',resizeMode: 'cover',
         overflow: 'hidden' }} className="rounded-full self-end mx-1" />
         </View>
       </View>
     );
   }
 };
  return (
    <View
      className="p-3 h-max"
      style={{ paddingBottom: '15%' }}
    >
      {/* Header */}
      <View className="w-full flex-row" style={{ alignItems: 'center', marginBottom: 20, width: "95%" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color="black" size={27} style={{ marginLeft: '5%' }} />
        </TouchableOpacity>
        <View className="flex-col items-center" style={{ width: '80%' }}>
          <Text
            className="self-center text-xl text-center"
            style={{ fontFamily: 'Gabarito-SemiBold' }}
          >
            {selectedChat?.chatName || 'Archived Chat'}
          </Text>
          <Text className="text-base text-gray-500" style={{ fontFamily: 'Gabarito-Regular' }}>
            {selectedChat?.chatDate ? new Date(selectedChat.chatDate).toLocaleString() : ''}
          </Text>
        </View>
        <TouchableOpacity
          className="p-2 rounded-lg bg-gray-200"
          style={{ marginRight: "5%", borderWidth: 2, borderColor: "#d1d5db" }}
          onPress={() => setDeleteModal(true)}
        >
          <MaterialIcons name="delete-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        inverted
        data={messages}
        renderItem={({ item }) => (
          <Message
            sender={item.role}
            body={item.parts[0].text}
            highlighted={item.highlighted}
          />
        )}
        keyExtractor={(item) => item.messageId}
        ListEmptyComponent={
          <Text style={{ fontFamily: 'Gabarito-Regular', textAlign: 'center', marginTop: 20 }}>
            No messages to display.
          </Text>
        }
      />

      {/* Delete Chat Modal */}
      <Modal
        animationIn={"bounceIn"}
        animationOut={"bounceOut"}
        isVisible={showDeleteModal}
        onBackdropPress={() => setDeleteModal(false)}
      >
        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <Text
            style={{ marginVertical: 10, fontFamily: "Gabarito-Regular" }}
            className="text-xl text-gray-500 text-center"
          >
            Are you sure you want to delete this archived chat?
          </Text>
          <View className="flex-row w-full justify-between">
            <TouchableOpacity
              onPress={() => {
                setDeleteModal(false);
                handleDeleteArchivedChat();
              }}
              style={{
                backgroundColor: 'rgba(117, 141, 163, 0.2)',
                borderRadius: 5,
                padding: 10,
                width: '40%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'black', fontFamily: "Gabarito-SemiBold" }} className="text-xl">Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteModal(false)}
              style={{
                backgroundColor: 'rgb(117, 141, 163)',
                borderRadius: 5,
                padding: 10,
                width: '40%',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontFamily: "Gabarito-SemiBold" }} className="text-xl">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
