import {React,useState,useEffect} from 'react'
import {View,Text,TouchableOpacity,StyleSheet,TextInput, KeyboardAvoidingView,Platform, ScrollView} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo';
import {BannerAd, BannerAdSize,} from 'react-native-google-mobile-ads';
import Modal from 'react-native-modal'
import { useGlobalState } from '../../HelperComponents/GlobalState';
import { useIsFocused } from '@react-navigation/native';
import BarGraph from '../../HelperComponents/BarGraphComponent';
import { WellnessTrackersManager } from '../../HelperComponents/UtilityClasses/LocalDatabaseManagers';


export default function TrackerChart({navigation,route}){
  const {theme,title,currentGoalText,goal,goalUnit}= route.params;
  const [checkInModal,setCheckInModal]= useState(false);
  const [selectedQty,setQuantity]=useState(150);
  const [showComingSoonModal,setComingSoonModal]= useState(false);
  const [wellnessTrackersRealmInstance]=useGlobalState("wellnessTrackersRealmInstance");
  const [graphData,setGraphData]=useState([]);
  const isFocused= useIsFocused();
  const Data = {
    labels: ["1", "2", "3", "4", "5", "6","7"],
    graphData
  };
  const gridItems = [
    { id: '1', icon: 'cup-outline', size: 24, label: '100 ml',value:100 },
    { id: '2', icon: 'cup-outline', size: 28, label: '125 ml',value:125 },
    { id: '3', icon: 'cup-outline', size: 32, label: '150 ml',value:150 },
    { id: '4', icon: 'bottle-water', size: 24, label: '200 ml', isFontAwesome: true,value:200 },
    { id: '5', icon: 'bottle-water', size: 28, label: '250 ml', isFontAwesome: true,value:250 },
    { id: '6', icon: 'bottle-water', size: 32, label: '300 ml', isFontAwesome: true,value:300 },
  ];

        useEffect(() => {
          if (isFocused) {
            WellnessTrackersManager.processRealmDataForGraph(wellnessTrackersRealmInstance,title,setGraphData);
            WellnessTrackersManager.fetchWaterPerIntake(wellnessTrackersRealmInstance,setQuantity);
          }
        }, [isFocused,wellnessTrackersRealmInstance]);
  
    return(
        <View className="p-3 h-full bg-white">
            {/* Header */}
            <View className="w-full flex-row mb-4">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" color="#758DA3" size={27} className="self-start" style={{ marginLeft: "10%" }} />
              </TouchableOpacity>
              <View className="flex-col" style={{width:"65%"}}>
                <Text className="self-center text-xl text-center" style={{fontFamily:"Gabarito-SemiBold"}}>{title || ""}</Text> 
                <Text className="text-md text-gray-500 text-center" style={{fontFamily:"Gabarito-Regular"}}>Last 7 Days</Text>
              </View>  
            </View>

            {/* Current Goal Section */}
            <View className="flex-row items-center w-full">
              <Text className="text-2xl" style={{fontFamily:"Gabarito-SemiBold", marginTop:"7%"}}>Current Goal</Text>
              <View className="rounded-xl items-center" style={{marginTop:"7%", marginLeft:"3%", backgroundColor:theme}}>
                <Text className="text-lg text-white" style={{fontFamily:"Gabarito-SemiBold", paddingHorizontal:"5%", paddingVertical:"2%"}}>
                  {currentGoalText}
                </Text>
              </View>
              {title === "Water Intake" && (
                <TouchableOpacity 
                  onPress={() => WellnessTrackersManager.addWaterIntakeRecord(wellnessTrackersRealmInstance, selectedQty)} 
                  className="rounded-xl items-center" 
                  style={{marginTop:"7%", marginLeft:"12%", backgroundColor:"rgb(117, 141, 163)", elevation:6}}
                >
                  <Text className="text-lg text-white" style={{fontFamily:"Gabarito-SemiBold", paddingHorizontal:"5%", paddingVertical:"2%"}}>
                    Check In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Graph */}
            <View className="flex-row w-full justify-center" style={{marginTop:"-8%", transform:"scale(0.8)"}}>
              <BarGraph data={Data} barColor={theme} goal={goal} goalUnit={goalUnit}/>
            </View>

            {/* Water Intake Quantity */}
            {title === "Water Intake" && (
              <View className="flex-row items-center w-full" style={{marginTop:"-50%"}}>
                <Text className="text-2xl" style={{fontFamily:"Gabarito-SemiBold", marginTop:"7%"}}>
                  Quantity per Intake
                </Text>
                <View className="rounded-xl items-center" style={{marginTop:"7%", marginLeft:"3%", backgroundColor:theme}}>
                  <Text className="text-lg text-white" style={{fontFamily:"Gabarito-SemiBold", paddingHorizontal:"5%", paddingVertical:"2%"}}>
                    {selectedQty + " ml"}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setCheckInModal(true)} 
                  className="rounded-xl flex-row items-center" 
                  style={{marginTop:"7%", marginLeft:"13%", borderColor:"rgb(117, 141, 163)", borderWidth:1}}
                >
                  <Text className="text-lg" style={{fontFamily:"Gabarito-SemiBold", paddingHorizontal:"5%", paddingVertical:"2%"}}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Wizard's Review */}
            <View 
              className="bg-gray-100 p-4 rounded-xl" 
              style={{
                marginTop: title === "Water Intake" ? "2%" : "-45%",
                elevation: 2,
                marginBottom: 16
              }}
            >
              <Text className="text-2xl mb-2" style={{fontFamily:"Gabarito-SemiBold"}}>Wizard's Review</Text>
              <Text className="text-lg text-gray-600" style={{fontFamily:"Gabarito-Regular"}}>
                Strong hydration on Days 4 and 5 likely boosted energy, but low intake on Days 1, 3, and 7 may have reduced productivity. Consistency will enhance vitality. Aim for steady progress!
              </Text>
            </View>

            {/* Health Effects Section */}
            <View className="mb-16">
              <Text className="text-2xl mb-3" style={{fontFamily:"Gabarito-SemiBold"}}>
                How this affects your ongoing health?
              </Text>
              <TouchableOpacity
                onPress={() => setComingSoonModal(true)}
                className="bg-[rgb(117,141,163)] rounded-xl py-3 flex-row items-center justify-center"
                style={{elevation: 4}}
              >
                <Text className="text-xl text-white mr-3" style={{fontFamily:"Gabarito-SemiBold"}}>
                  Share in Chat with Wellness AI
                </Text>
                <Entypo name="share" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Ad Banner */}
            <View className="absolute bottom-0 left-0 right-0 items-center bg-white py-2">
              <BannerAd 
                size={BannerAdSize.BANNER}
                unitId="ca-app-pub-3940256099942544/9214589741"
                onAdLoaded={() => console.log('Advert loaded')}
                onAdFailedToLoad={error => console.error('Advert failed to load: ', error)}
              />
            </View>

            {/* Keep existing modals */}
            {/* ... rest of the modals code ... */}
        </View>
    )
}
