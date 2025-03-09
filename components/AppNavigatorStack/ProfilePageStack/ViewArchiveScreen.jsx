

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import {
  useGlobalState
} from "../../HelperComponents/GlobalState";
import { ChatDatabaseManager } from "../../HelperComponents/UtilityClasses/LocalDatabaseManagers";

export default function ViewArchiveScreen({ navigation }) {
  const [archiveRealm, setArchiveRealm] = useGlobalState("archivedChatsRealmInstance");
  const [archivedChats, setArchivedChats] = useState([]);
  const [selectedItem, setSelectedItem] = useGlobalState("selectedItem");
  const [shouldRefresh, setShouldRefresh] = useGlobalState("shouldRefreshArchivedChats");  // Global state for trigger

  const fetchData = async () => {
    try {
      ChatDatabaseManager.initializeArchivedChatRealm(setArchiveRealm);
      const chats = archiveRealm.objects("ArchivedChats").sorted("chatDate", true);
      const detachedChats = Array.from(chats).map((chat) => JSON.parse(JSON.stringify(chat)));
      setArchivedChats(detachedChats);
    } catch (error) {
      console.error("Error fetching archived data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shouldRefresh]); // Re-fetch data when shouldRefresh is triggered

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      className="p-3"
      style={{ paddingVertical: 10 }}
      onPress={() => {
        const detachedItem = JSON.parse(JSON.stringify(item));
        setSelectedItem(detachedItem);
        navigation.navigate("ArchivedChat", { chatId: item.chatId });
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-col">
          <Text className="text-xl" style={{ fontFamily: "Gabarito-Regular" }}>
            {item.chatName}
          </Text>
          <Text
            className="text-base text-gray-500"
            style={{ fontFamily: "Gabarito-Regular" }}
          >
            {new Date(item.chatDate).toLocaleString()}
          </Text>
        </View>
        <AntDesign name={"arrowright"} size={20} color={"black"} />
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={{ backgroundColor: "rgb(243 244 246)", flex: 1 }}>
      <SafeAreaView
        style={{
          backgroundColor: "rgb(243 244 246)",
          paddingHorizontal: 16,
          width: "96%",
          marginTop: "2%",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
            width: "100%",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name={"arrowleft"} size={25} color={"black"} />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: "Gabarito-SemiBold", fontSize: 20, textAlign: "center", flex: 1 }}
          >
            View Archive
          </Text>
        </View>
      <View
      className="w-full"
      style={{
        marginVertical: 10,
        overflow: "hidden",
        borderColor: "#ddd",
      }}
    >
      
        <Text className="text-2xl" style={{ fontFamily: "Gabarito-SemiBold" }}>
          Chats
        </Text>

      {/* Render children only when the accordion is open */}

    </View>
          {archivedChats.length > 0 ? (
            <FlatList
              data={archivedChats}
              keyExtractor={(item) => item.chatId}
              renderItem={renderChatItem}
            />
          ) : (
            <Text
              style={{
                fontSize: 18,
                color: "gray",
                fontFamily: "Gabarito-Regular",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No archived chats available.
            </Text>
          )}
      </SafeAreaView>
    </View>
  );
}
