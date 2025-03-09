import React,{useEffect,useState,useRef} from 'react'
import { Text, View,Image,TouchableOpacity,Dimensions,StyleSheet,Animated,Easing,Alert, useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import { useFonts } from 'expo-font';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign.js'
import Fontisto from '@expo/vector-icons/Fontisto';
import {BannerAd, BannerAdSize,} from 'react-native-google-mobile-ads';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {useGlobalState,setGlobalState} from '../HelperComponents/GlobalState.js'
import { WellnessTrackersManager,PersonalInformationManager } from "../HelperComponents/UtilityClasses/LocalDatabaseManagers";
import { HealthConnectManager } from '../HelperComponents/UtilityClasses/CloudServicesManager.js';
import { TrackersGoalCalculator } from '../HelperComponents/UtilityClasses/TrackerCalculationManager.js';
import {UserManager} from "../HelperComponents/UtilityClasses/CloudServicesManager.js";
const userProfilePlaceholder = require('../../assets/images/userProfilePic.png');

export default function WellnessPage(){
  const [profilePic, setProfilePic] = useState(null);
    const [realm] = useGlobalState("personalInformationRealmInstance");
    const [wellnessTrackersRealmInstance]=useGlobalState("wellnessTrackersRealmInstance")
    const [reqWaterIntake,setReqWaterIntake]=useState(0);
    const [reqStepCount,setStepCount]=useState(0);
    const [weight,setWeight]=useState(0);
    const [weightUnit,setWeightUnit]=useState("");
    const [exerciseRoutine,setExerciseRoutine]=useState();
    const [age,setAge]=useState(0);
    const [height,setHeight]=useState(0);
    const [heightUnit,setHeightUnit]=useState(null);
    const [gender,setGender]=useState(null);
    const [reqCalories,setReqCalories]=useState(0);
    const [todayWaterIntake,setTodayWaterIntake]=useState(0);
    const [todayStepCount,setTodayStepCount]=useState(0);
    const [todayCaloriesBurned, setTodayCaloriesBurned]=useState(0);
    const [isError,setIsError]=useState(false);
    const [isLoading,setIsLoading]=useState(true);
    const spinAnimation = new Animated.Value(0);
    const [loaded, error] = useFonts({
        'Gabarito-Regular': require('../../assets/fonts/Gabarito-Regular.ttf'),
        'Gabarito-Medium': require('../../assets/fonts/Gabarito-Medium.ttf'),
        'Gabarito-SemiBold': require('../../assets/fonts/Gabarito-SemiBold.ttf'),
        'Gabarito-Bold': require('../../assets/fonts/Gabarito-Bold.ttf'),
      });
      const [showMetric, setShowMetric] = useState(false);
        const [showComingSoonModal,setComingSoonModal]= useState(false);
        const [userInfo,setUserInfo]=useState(null);
  const titleTranslateY = useRef(new Animated.Value(0)).current; // Title animation
  const metricTranslateY = useRef(new Animated.Value(50)).current;
  const colorScheme = useColorScheme();
     const navigation = useNavigation();
      const isFocused= useIsFocused();

      // useEffect(() => {
      //   if (isFocused) {
      //     setGlobalState('lastVisitedTab', 'Wellness');
      //     PersonalInformationManager.loadFromPersonalInformationRealm(realm,{setWeight,setWeightUnit,setExerciseRoutine,setAge,setHeight,setHeightUnit,setGender,          
      //     });
          
      //    if( WellnessTrackersManager.fetchTodayWaterIntake(wellnessTrackersRealmInstance,setTodayWaterIntake)==-1)
      //     setIsError(true);
      //     if(WellnessTrackersManager.fetchTodayStepCount(wellnessTrackersRealmInstance,setTodayStepCount)==-1)
      //     setIsError(true);
      //     WellnessTrackersManager.addStepCountRecord(wellnessTrackersRealmInstance,HealthConnectManager.getStepsData)
      //     WellnessTrackersManager.addCaloriesBurnedRecord(wellnessTrackersRealmInstance,HealthConnectManager.getCaloriesData)
      //     if(WellnessTrackersManager.fetchTodayCaloriesBurned(wellnessTrackersRealmInstance,setTodayCaloriesBurned)==-1)
      //     setIsError(true);
      //   }
      // }, [isFocused]);
       
      useEffect(() => {
        if (isFocused) {
          const initializeData = async () => {
            try {
              setGlobalState('lastVisitedTab', 'Wellness');
              
              // Load personal information
              PersonalInformationManager.loadFromPersonalInformationRealm(realm, {
                setWeight, setWeightUnit, setExerciseRoutine, setAge, setHeight, setHeightUnit, setGender,          
              });
              
              // Fetch tracker data and await the results
              const waterResult = await WellnessTrackersManager.fetchTodayWaterIntake(wellnessTrackersRealmInstance, setTodayWaterIntake);
              const stepResult = await WellnessTrackersManager.fetchTodayStepCount(wellnessTrackersRealmInstance, setTodayStepCount);
              const calorieResult = await WellnessTrackersManager.fetchTodayCaloriesBurned(wellnessTrackersRealmInstance, setTodayCaloriesBurned);
              
              console.log("Fetch Results:", { 
                waterResult, 
                stepResult, 
                calorieResult,
                todayCaloriesBurned 
              });
              
              // Check if any result is -1 or if calories is -1
              if (waterResult === -1 || 
                  stepResult === -1 || 
                  calorieResult === -1 || 
                  todayCaloriesBurned === -1) {
                console.log("Setting error state to true due to failed fetch");
                setIsError(true);
              } else {
                setIsError(false);
              }
      
              // Add records regardless of fetch status
              await WellnessTrackersManager.addStepCountRecord(wellnessTrackersRealmInstance, HealthConnectManager.getStepsData);
              await WellnessTrackersManager.addCaloriesBurnedRecord(wellnessTrackersRealmInstance, HealthConnectManager.getCaloriesData);
            } catch (error) {
              console.error("Error in initializeData:", error);
              setIsError(true);
            }
          };
      
          initializeData();
          setIsLoading(false);
        }
      }, [isFocused]); 

      useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(spinAnimation, {
                    toValue: 1,
                    duration: 2000, // Slowed down a bit for better visibility
                    useNativeDriver: true,
                    easing: Easing.linear
                })
            ).start();
        } else {
            spinAnimation.setValue(0);
        }
    }, [isLoading]);

      useEffect(() => {
        UserManager.fetchUserProfilePicture(setProfilePic);
      }, []);

    useEffect(() => {
        if (weight && weightUnit && exerciseRoutine) {
            TrackersGoalCalculator.calculateRequiredWaterIntake(exerciseRoutine,weightUnit,weight,setReqWaterIntake);
            //calculateWalkingDistance();
            TrackersGoalCalculator.calculateDailyStepsGoal(age,gender,weight,weightUnit,height,heightUnit,setStepCount);
            TrackersGoalCalculator.calculateCaloriesToBurn(age,weight,weightUnit,height,heightUnit,gender,setReqCalories,"moderately_active");
        }
    }, [weight, weightUnit, exerciseRoutine]);
     
    useEffect(() => {
      console.log(`The device theme is: ${colorScheme}`); // Logs 'light' or 'dark'
    }, [colorScheme]);


      if (!loaded && !error) {
        return null;
      }

      const handleMetricClick = () => {
        // Animate the title out and the metric in
        Animated.parallel([
          Animated.timing(titleTranslateY, {
            toValue: -50, // Move the title out of view
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(metricTranslateY, {
            toValue: 0, // Move the metric into view
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowMetric(true);
    
          // Delay before reversing the animation
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(titleTranslateY, {
                toValue: 0, // Reset the title to original position
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(metricTranslateY, {
                toValue: 50, // Move the metric back off-screen
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
            ]).start(() => {
              setShowMetric(false);
            });
          }, 2000);
        });
      };

    return(
        <View className="bg-gray-300" >
        <View className="h-full w-full self-center flex-col bg-gray-100 rounded-3xl" style={{"width":"96%","marginTop":"2%",borderBottomRightRadius:0,borderBottomLeftRadius:0}}>
        <View className="flex-row w-full justify-between items-center">
              <TouchableOpacity className="py-3 px-3 flex-row items-center" onPress={() => navigation.openDrawer()}>
              <Image
        source={profilePic ? { uri: profilePic } : userProfilePlaceholder}
        style={{ height: 33, width: 33, borderRadius: 9999 ,borderWidth: 1, borderColor: 'rgba(107,114,128,0.5)',resizeMode: 'cover',
          overflow: 'hidden'}} 
      />
                 <AntDesign name={"menu-fold"} size={20} color={"black"}/>
              </TouchableOpacity>
              <View className="m-4 items-end" style={{"marginTop":"5%","marginLeft":"10%"}}>
                    <Octicons name='gear' color={"black"} size={25} onPress={()=>navigation.navigate("Profile")}/>
                </View>
            </View>
                 <Text className="text-2xl font-semibold p-2 w-full text-left px-4" style={{"fontFamily":"Gabarito-SemiBold"}}> Wellness Trackers</Text>
                {
            isLoading===true?(<View className="justify-center items-center px-4 w-full">
              <View className="bg-gray-200 rounded-2xl p-6 w-full items-center">
                  <Animated.View 
                      style={{
                          transform: [{
                              rotate: spinAnimation.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0deg', '360deg']
                              })
                          }]
                      }}
                  >
                      <MaterialIcons name="run-circle" size={50} color="black" />
                  </Animated.View>
                  
                  <Text className="text-xl mt-4 mb-2" style={{fontFamily:'Gabarito-SemiBold'}}>
                      Loading your Wellness Trackers...
                  </Text>
                  
                  <View className="w-full mt-4">
                      <View className="h-2 bg-gray-300 rounded-full overflow-hidden">
                          <Animated.View 
                              className="h-full bg-black"
                              style={{
                                  width: '30%',
                                  transform: [{
                                      translateX: spinAnimation.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [-100, 100]
                                      })
                                  }]
                              }}
                          />
                      </View>
                  </View>
                  
                  <Text className="text-gray-500 text-sm mt-4" style={{fontFamily:'Gabarito-Regular'}}>
                      This may take a moment while we sync with Health Connect
                  </Text>
              </View>
          </View>):
            isError===true?(
              <View className=" justify-center items-center px-4 py-1 w-full">
              <View className="bg-gray-300 rounded-2xl p-2 w-full items-center shadow-md">
                  <MaterialIcons name="error-outline" size={40} color="#dc2626" />
                
                <Text className="text-xl text-center mb-2" style={{fontFamily:'Gabarito-SemiBold'}}>
                  Oops! Something went wrong
                </Text>
                
                <Text className="text-gray-600 text-center mb-6" style={{fontFamily:'Gabarito-Regular'}}>
                  We're having trouble setting up your Wellness Trackers. This could be due to various reasons.
                </Text>
                
                <TouchableOpacity 
                  className="flex-row items-center bg-gray-700 px-6 py-3 rounded-xl"
                  style={{elevation: 3}}
                  // onPress={() => {
                  //   navigation.navigate('ErrorDetails', {
                  //     errorType: 'wellness_data_fetch',
                  //     errorDetails: {
                  //       title: 'Wellness Data Fetch Error',
                  //       possibleCauses: [
                  //         'Health Connect permissions not granted',
                  //         'No internet connection',
                  //         'Health data not synced recently',
                  //         'Database connection issues'
                  //       ],
                  //       solutions: [
                  //         'Check Health Connect permissions in device settings',
                  //         'Verify your internet connection',
                  //         'Open Health Connect app to sync latest data',
                  //         'Try restarting the app'
                  //       ]
                  //     }
                  //   });
                  // }}
                >
                  <MaterialIcons name="info-outline" size={20} color="white" style={{marginRight: 8}} />
                  <Text className="text-white text-base" style={{fontFamily:'Gabarito-SemiBold'}}>
                    Tap here for more details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            )
            :
            (<>
             <TouchableOpacity
       onPress={()=>navigation.navigate('TrackerChart',{theme:"#0891b2",title:"Water Intake",currentGoalText:reqWaterIntake + " "+ (weightUnit=="kg"?"Litres":"Ounces")+"/Day",goal:reqWaterIntake,goalUnit:(weightUnit=="kg"?"Litres":"Ounces")})}
className="flex-col bg-gray-300 self-center rounded-lg"
style={styles.container}
>
<View style={styles.overflowHidden}>
  <TouchableOpacity
    className="flex-row items-center"
    onPress={handleMetricClick}
    activeOpacity={1}
  >
    <View className="w-full items-center">
    <Animated.View
      style={[
        styles.titleContainer,
        { transform: [{ translateY: titleTranslateY }] },
        
      ]}
      className="flex-row items-center"
    >
      <Text className="text-lg p-2" style={styles.titleText}>
        Water Intake
      </Text>
      <EvilIcons
      name="question"
      size={20}
      color="#6b7280"
      style={{ marginLeft: -5 }}
    />
    </Animated.View>
    <Animated.View
      style={[
        styles.metricContainer,
        { transform: [{ translateY: metricTranslateY }] },
      ]}
    >
      <Text className="text-lg p-2" style={styles.metricText}>
        {todayWaterIntake/1000} of  {reqWaterIntake}{weightUnit=="kg"?" Litres":" Ounces"}
      </Text>
    </Animated.View>
    
    </View>
    
  </TouchableOpacity>
</View>

<View
  className="flex-row self-center justify-evenly items-center"
  style={styles.row}
>
  <Fontisto
    name="blood-drop"
    size={20}
    color="#0891b2"
    style={{ marginRight: 8 }}
  />
  <View style={styles.progressContainer}>
    <View style={{width: (todayWaterIntake/(reqWaterIntake*1000)*100)+"%",
height: '100%',
backgroundColor: '#0891b2',
borderRadius: 9999,
elevation: 10,}} />
  </View>
  <Text className="text-xl mx-1" style={styles.metricValue}>
    {/* {reqWaterIntake+""+weightUnit=="kg"?"L":"oz"} */}
    {reqWaterIntake}{weightUnit=="kg"?"L":"oz"}
  </Text>
</View>
</TouchableOpacity>
            
              <TouchableOpacity
className="flex-col bg-gray-300 self-center rounded-lg"
style={[styles.container,{marginTop:"2%"}]}
onPress={()=>navigation.navigate('TrackerChart',{theme:"#dc2626",title:"Step Count",currentGoalText:`${reqStepCount} Steps/Day`,goal:reqStepCount,goalUnit:"steps"})}
>
<View style={styles.overflowHidden}>
  <TouchableOpacity
    className="flex-row items-center"
    onPress={handleMetricClick}
    activeOpacity={1}
  >
    <Animated.View
      style={[
        styles.titleContainer,
        { transform: [{ translateY: titleTranslateY }] },
      ]}
      className="flex-row items-center"
    >
      <Text className="text-lg p-2" style={{fontFamily:"Gabarito-SemiBold"}}>Step Count</Text>
      <EvilIcons
      name="question"
      size={20}
      color="#6b7280"
      style={{ marginLeft: -5 }}
    />
    </Animated.View>
    <Animated.View
      style={[
        styles.metricContainer,
        { transform: [{ translateY: metricTranslateY }] },
      ]}
    >
      <Text className="text-lg p-2" style={styles.metricText}>
        {todayStepCount} of {reqStepCount}{" Steps"}
      </Text>
    </Animated.View>
  </TouchableOpacity>
</View>

<View
  className="flex-row self-center justify-evenly items-center"
  style={styles.row}
>
  <MaterialIcons name="directions-walk" size={24} color="#dc2626" />
  
  <View className="self-center flex-row" style={{width:"70%",height:"30%"}}>
                <View className="bg-red-600 rounded-full" style={{width:((todayStepCount/reqStepCount)*100)+"%",height:"100%",elevation:10}}></View>
               </View>
  <Text className="text-xl mx-1" style={styles.metricValue}>
    {reqStepCount}
  </Text>
</View>
</TouchableOpacity>
             <TouchableOpacity
className="flex-col bg-gray-300 self-center rounded-lg"
style={[styles.container,{marginTop:"2%"}]}
onPress={()=>navigation.navigate('TrackerChart',{theme:"#ea580c",title:"Calories Burned",currentGoalText:`${reqCalories} Kilocalories/Day`,goal:reqWaterIntake,goalUnit:(weightUnit=="kg"?"Litres":"Ounces")})}
>
<View style={styles.overflowHidden}>
  <TouchableOpacity
    className="flex-row items-center"
    onPress={handleMetricClick}
    activeOpacity={1}
  >
    <Animated.View
      style={[
        styles.titleContainer,
        { transform: [{ translateY: titleTranslateY }] },
      ]}
      className="flex-row items-center"
    >
      <Text className="text-lg p-2" style={{fontFamily:"Gabarito-SemiBold"}}>Calories Burned</Text>
      <EvilIcons
      name="question"
      size={20}
      color="#6b7280"
      style={{ marginLeft: -5 }}
    />
    </Animated.View>
    <Animated.View
      style={[
        styles.metricContainer,
        { transform: [{ translateY: metricTranslateY }] },
      ]}
    >
      <Text className="text-lg p-2" style={styles.metricText}>
        {todayCaloriesBurned} of {reqCalories} Kilocalories
      </Text>
    </Animated.View>
  </TouchableOpacity>
</View>

<View
  className="flex-row self-center justify-evenly items-center"
  style={styles.row}
>
  <Fontisto name="fire" size={20} color="#ea580c" style={{marginRight:"1%"}}/>
  
  <View className="self-center flex-row" style={{width:"70%",height:"30%",borderColor:"#374151",borderWidth:0,borderRadius:9999}}>
                <View className="bg-orange-600 rounded-full" style={{width:(todayCaloriesBurned/reqCalories*100)+"%",height:"99%",elevation:10}}></View>
               </View>
  <Text className="text-xl mx-1" style={styles.metricValue}>
  {reqCalories}Kcal
  </Text>
</View>
</TouchableOpacity></>
)
                  
                }
                 <Text className="text-2xl font-semibold p-2 w-full text-left px-4 top-3" style={{"fontFamily":"Gabarito-SemiBold",marginTop:"5%"}}> Recommendations</Text>
                 <Text className="text-lg px-5 py-2 text-gray-500" style={{"fontFamily":"Gabarito-Regular",marginTop:"1%"}}>Stay on track with Wellness Goals through recommendations based on your profile.</Text>
                 <View className="flex-row justify-between self-center" style={{width:"95%", marginTop:"0%"}}>
                  <TouchableOpacity 
                    className="flex-col items-center" 
                    style={{width: "48%"}} 
                    onPress={()=>setComingSoonModal(true)}
                  >
                    <Text className="text-lg text-center my-1" style={{fontFamily:"Gabarito-SemiBold"}}>
                      Mobility Routines
                    </Text>
                    <View className="bg-pink-300 items-center justify-center" style={{width:90, height:90, borderRadius:17}}>
                      <MaterialIcons name="fitness-center" size={50} color="white" />
                    </View>
                    <Text 
                      className="text-gray-500 text-base text-center top-2" 
                      style={{fontFamily:'Gabarito-Regular'}}
                    >
                      A mix of low and moderate intensity routines to help you stay active
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="flex-col items-center" 
                    style={{width: "48%"}} 
                    onPress={()=>setComingSoonModal(true)}
                  >
                    <Text className="text-lg text-center my-1" style={{fontFamily:"Gabarito-SemiBold"}}>
                      Health Checkups
                    </Text>
                    <View className="bg-emerald-300 items-center justify-center" style={{width:90, height:90, borderRadius:17}}>
                      <MaterialIcons name="health-and-safety" size={50} color="white" />
                    </View>
                    <Text 
                      className="text-gray-500 text-base text-center top-2" 
                      style={{fontFamily:'Gabarito-Regular'}}
                    >
                      Series of suggested health checkups and treatments
                    </Text>
                  </TouchableOpacity>
                 </View>
                <View className="self-center" style={{position:"absolute",bottom:"2%"}}>
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
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: '9%',
    width: '90%',
    elevation: 1,
  },
  overflowHidden: {
    overflow: 'hidden', // Clips the content inside the parent view
    height: 50, // Matches the height of the animated content
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width:"70%"
  },
  metricContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  titleText: {
    fontFamily: 'Gabarito-SemiBold',
    color: '#000',
  },
  metricText: {
    fontFamily: 'Gabarito-SemiBold',
    color: 'black',
    opacity:1,
  },
  row: {
    height: '40%',
    width: '100%',
    marginTop: '-7%',
  },
  progressContainer: {
    width: '70%',
    height: '30%',
    backgroundColor: '#d1d5db',
    borderRadius: 9999,
  },
  progressFill: {
    width: "70%",
    height: '100%',
    backgroundColor: '#0891b2',
    borderRadius: 9999,
    elevation: 10,
  },
  metricValue: {
    fontFamily: 'Gabarito-SemiBold',
    marginTop: '-1%',
  },
});