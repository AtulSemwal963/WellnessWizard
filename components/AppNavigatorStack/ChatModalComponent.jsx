
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FlatList, Text, View, Image, RefreshControl, Vibration,useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';


//const botProfilePic = require('../../assets/images/botProfilePic.png');
const defaultUserProfilePic = require('../../assets/images/userProfilePic.png');


const ChatModalComponent = forwardRef((props, ref) => {
  const [loaded, error] = useFonts({
    'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
    'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
    'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
    'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
  });
  const { realmInstance } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(defaultUserProfilePic);
  const [userFirstName, setUserFirstName] = useState("User");
  const [bgColors, setBgColors] = useState({});
  // const [realmInstance, setRealmInstance] = useState(null);
  const [messages, setMessages] = useState([]);
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
    if (!realmInstance) return;
    const currentChats = realmInstance.objects("CurrentChat");
    const updateMessages = () => {
      const formattedMessages = currentChats.flatMap(chat =>
        chat.message.map(msg => ({
          messageId: msg.messageId,
          role: msg.role,
          highlighted: msg.highlighted,
          parts: msg.parts.map(part => ({ text: part.text })),
        }))
      );
      setMessages(formattedMessages.reverse());
    };

    updateMessages();
    const listener = () => updateMessages();

    currentChats.addListener(listener);

    return () => {
      currentChats.removeListener(listener);
    };
  }, [realmInstance]);

  
  useEffect(() => {
    // Load user profile information from AsyncStorage
    const fetchUserProfile = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          if (parsedUserInfo.picture) {
            setUserProfilePic({ uri: parsedUserInfo.picture });
          }
          if (parsedUserInfo.name) {
            const firstName = parsedUserInfo.name.split(" ")[0]; // Extract first name
            setUserFirstName(firstName);
          }
        }
      } catch (error) {
        console.error("Error loading user profile information:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused]);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useImperativeHandle(ref, () => ({
    onRefresh,
  }));

  if (!loaded && !error) {
    return null;
  }

 

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
          <GestureHandlerRootView>
            <TapGestureHandler
              onHandlerStateChange={(event) => {
                if (event.nativeEvent.state === 4) { // END state
                  handleDoubleTap(messageId);
                }
              }}
              numberOfTaps={2} 
            >
              <View className="flex-row">
                <Image source={botProfilePic} style={{ height: 40, width: 40, // Scale down the content to 50%
                resizeMode: 'contain' }} className="rounded-full self-end mx-1" />
                <Text className="text-lg p-2 rounded-xl" style={{ fontFamily: "Gabarito-Regular", backgroundColor }}>{body}</Text>
              </View>
            </TapGestureHandler>
          </GestureHandlerRootView>
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
    <FlatList
      inverted
      data={messages}
      renderItem={({ item }) => <Message sender={item.role} body={item.parts[0].text} messageId={item.messageId} highlighted={item.highlighted}/>}
      keyExtractor={(item) => item.messageId}
      refreshControl={
        <RefreshControl
          colors={['#616161']}
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={200}
        />
      }
    />
  );
});

export default ChatModalComponent;
