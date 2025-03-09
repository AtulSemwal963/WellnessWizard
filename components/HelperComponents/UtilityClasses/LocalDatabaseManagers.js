import Realm from 'realm';
import {PartSchema,MessageSchema,CurrentChatSchema} from '../LocalDatabase/CurrentChatSchema.js'
import { ArchivedChatsSchema } from '../LocalDatabase/ArchivedChatsSchema.js';
import { WellnessTrackersSchema,WaterIntakeSchema,StepCountSchema,CalorieBurnedSchema } from '../LocalDatabase/WellnessTrackersSchema.js'
import { MedicalSummarySchema } from '../LocalDatabase/PersonalInformationSchema';

class ChatDatabaseManagerClass{

    initializeCurrentChatRealm=async(setChatRealmInstance)=>{
        try {
            const chatRealm = await Realm.open({
              path: "chatRealm.realm", // Use a unique file path for the current chats
              schema: [PartSchema, MessageSchema, CurrentChatSchema],
            });
            setChatRealmInstance(chatRealm);
          } catch (error) {
            console.error("Error initializing Chat Realm:", error);
          }
    }

    initializeArchivedChatRealm=async(setArchiveRealmInstance)=>{
        try {
            const archiveRealm = await Realm.open({
              path: "archiveRealm.realm", // Use a unique file path for the archived chats
              schema: [ArchivedChatsSchema, CurrentChatSchema,PartSchema, MessageSchema,],
            });
            setArchiveRealmInstance(archiveRealm);
            return archiveRealm;
          } catch (error) {
            console.error("Error initializing Archive Realm:", error);
            return null;
          } 
    }

    addMessageToCurrentChatRealm=async(chatRealmInstance,message)=>{
        chatRealmInstance.write(() => {
            // Check if CurrentChat exists, otherwise initialize
            let currentChat = chatRealmInstance.objects("CurrentChat")[0];
            if (currentChat) {
                currentChat.message.push(message);
            } else {
                chatRealmInstance.create("CurrentChat", {
                    timestamp: new Date().toISOString(),
                    message: [message],
                });
            }
        });
    }

    clearAllMessagesInCurrentChatRealm=async(chatRealmInstance)=>{
        chatRealmInstance.write(() => {
            const allCurrentChats = chatRealmInstance.objects("CurrentChat");
            chatRealmInstance.delete(allCurrentChats);
            const initialMessage = {
              messageId: `ai-${Date.now()}`,
              role: "model",
              highlighted:false,
              parts: [{
                text: "Hello! I'm Wellness Wizard, your AI health assistant. How can I help you today? 😊 Feel free to ask me anything related to your health, and I'll do my best to assist!"
              }]
            };
            chatRealmInstance.create("CurrentChat", {
              timestamp: Date.now().toString(),
              message: [initialMessage],
            });
          });
    }

    archiveCurrentChat=async(chatRealmInstance,archiveRealmInstance,chatName)=>{
         if (!chatRealmInstance || !archiveRealmInstance) {
                console.error("Realms are not initialized.");
                return;
            }
        
            try {
                const currentChats = chatRealmInstance.objects("CurrentChat");
        
                if (currentChats.length > 0) {
                    // Get the first (and only) current chat
                    const chatToArchive = currentChats[0];
        
                    console.log("Preparing to archive the following chat:", chatToArchive);
        
                    // Archive the current chat
                    archiveRealmInstance.write(() => {
                        archiveRealmInstance.create("ArchivedChats", {
                            chatId: "Chat-" + Date.now(), // Generate a unique ID for the archived chat
                            chatName: chatName || "Default Chat Name", // Use provided chat name or fallback
                            chatDate: new Date().toISOString(), // Archive timestamp
                            chat: chatToArchive, // Save the entire current chat object
                        });
                    });
        
                    console.log("Chat successfully archived.");
        
                    // Start a new chat session
                   
                } else {
                    console.warn("No active chat found to archive.");
                }
        
                // Log all archived chats for verification
                const archivedChats = archiveRealmInstance.objects("ArchivedChats");
                const formattedChats = archivedChats.map((chat) => ({
                    chatId: chat.chatId,
                    chatName: chat.chatName,
                    chatDate: chat.chatDate,
                    chat: {
                        timestamp: chat.chat.timestamp,
                        message: chat.chat.message.map((msg) => ({
                            messageId: msg.messageId,
                            role: msg.role,
                            parts: msg.parts.map((part) => ({ text: part.text })),
                        })),
                    },
                }));
        
                console.log("Archived Chats:", JSON.stringify(formattedChats, null, 2));
            } catch (error) {
                console.error("Error archiving chat:", error);
            }
    }

    fetchMessagesFromCurrentArchivedChat=async(chatId,realmInstance,setSelectedChat,setMessages)=>{
        if (chatId && realmInstance) {
            const chat = realmInstance.objectForPrimaryKey("ArchivedChats", chatId);
            if (chat) {
              const detachedChat = JSON.parse(JSON.stringify(chat));
              setSelectedChat(detachedChat);
              setMessages([...detachedChat.chat.message].reverse());
            }
          } else {
            setMessages([]);
          }
    }

    deleteCurrentArchivedChat=async(selectedChat,realmInstance,setSelectedChat,setMessages)=>{
        if (!selectedChat?.chatId) {
            console.error("Realm is not initialized or selectedChat is invalid.");
            return;
          }
      
          try {
            const chatIdToDelete = selectedChat.chatId;
      
            realmInstance.write(() => {
              const chatToDelete = realmInstance.objectForPrimaryKey("ArchivedChats", chatIdToDelete);
      
              if (chatToDelete) {
                realmInstance.delete(chatToDelete);
                console.log(`Chat with ID "${chatIdToDelete}" deleted successfully.`);
              } else {
                console.error("Chat not found in Realm.");
              }
            });
      
            setSelectedChat(null); // Clear global state
            setMessages([]); // Clear messages state
          } catch (error) {
            console.error("Error deleting archived chat:", error);
          }
    }
};

export const ChatDatabaseManager = new ChatDatabaseManagerClass();

class WellnessTrackersManagerClass{
    initializeWellnessTrackersRealm=async(setWellnessTrackersRealmInstance)=>{
        try {
            // Open Realm for current chats
            const wellnessTrackersInstance = await Realm.open({
                path: 'wellnessTrackersRealm.realm',
                schema: [WaterIntakeSchema, StepCountSchema, CalorieBurnedSchema, WellnessTrackersSchema],
                schemaVersion: 2,
              });
              console.log("Initialized Wellness Trackers Realm Successfully:");
              setWellnessTrackersRealmInstance(wellnessTrackersInstance);
              return true;
          } catch (error) {
            console.error("Error initializing Wellness Trackers Realm:", error);
            return false;
          }
    }
    fetchTodayWaterIntake = async(realmInstance,setTodayWaterIntake) => {
      if (!realmInstance) {
          console.error("Realm instance is not initialized.");
          setTodayWaterIntake(0);
          return -1;
      }
  
      try {
          const today = new Date().toISOString().split("T")[0];
          const tracker = await realmInstance.objects("WellnessTrackersSchema");
  
          if (tracker.length > 0) {
              const currentTracker = tracker[tracker.length - 1];
  
              if (currentTracker && currentTracker.WaterIntakeRecord) {
                  const todayRecord = currentTracker.WaterIntakeRecord.find(
                      (entry) => entry.date === today
                  );
  
                  if (todayRecord) {
                      console.log(`Today's water intake: ${todayRecord.value} ${todayRecord.unit}`);
                      setTodayWaterIntake(todayRecord.value);
                      return 1;
                  }
              }
          }
          
          setTodayWaterIntake(0);
          return 0;
      } catch (error) {
          console.error("Error fetching today's water intake:", error);
          setTodayWaterIntake(0);
          return -1;
      }
  };

  fetchWaterPerIntake = (realmInstance,setQuantity) => {
    try {
        // Access the latest WellnessTrackersSchema object (last record in the list)
        const tracker = realmInstance.objects("WellnessTrackersSchema");
        
        if (tracker.length > 0) {
            const currentTracker = tracker[tracker.length - 1]; // Get the most recent tracker
            
            if (currentTracker) {
                // If waterPerIntake exists and is valid, set it to the hook
                if (currentTracker.waterPerIntake) {
                    setQuantity(parseFloat(currentTracker.waterPerIntake));
                } else {
                    // Handle the case where waterPerIntake is missing
                    console.log("waterPerIntake not found, setting to default value");
                    setQuantity(150); // Default value
                }
            } else {
                // Handle the case where the tracker is empty
                console.log("No tracker found, setting to default value");
                setQuantity(150); // Default value
            }
        } else {
            // Handle case where no tracker is available
            console.log("No tracker found, setting to default value");
            setQuantity(150); // Default value
        }
    } catch (error) {
        // Error handling
        console.error("Error fetching waterPerIntake:", error);
        setQuantity(0); // Set default value in case of an error
    }
};

fetchTodayStepCount = async (realmInstance,setTodayStepCount) => {
  if (!realmInstance) {
      console.error("Realm instance is not initialized.");
      setTodayStepCount(0);
      return -1;
  }

  try {
      const today = new Date().toISOString().split("T")[0];
      const tracker = await realmInstance.objects("WellnessTrackersSchema");

      if (tracker.length > 0) {
          const currentTracker = tracker[tracker.length - 1];

          if (currentTracker && currentTracker.StepCountRecord) {
              const todayRecord = currentTracker.StepCountRecord.find(
                  (entry) => entry.date === today
              );

              if (todayRecord) {
                  console.log(`Today's step count: ${todayRecord.value} ${todayRecord.unit}`);
                  setTodayStepCount(todayRecord.value);
                  return 1;
              }
          }
      }

      setTodayStepCount(0);
      return -1;
  } catch (error) {
      console.error("Error fetching today's step count:", error);
      setTodayStepCount(0);
      return -1;
  }
};

fetchTodayCaloriesBurned = async (realmInstance,setTodayCaloriesBurned) => {
  if (!realmInstance) {
      console.error("Realm instance is not initialized.");
      setTodayCaloriesBurned(0);
      return -1;
  }

  try {
      const today = new Date().toISOString().split("T")[0];
      const tracker = await realmInstance.objects("WellnessTrackersSchema");

      if (tracker.length > 0) {
          const currentTracker = tracker[tracker.length - 1];

          if (currentTracker && currentTracker.CalorieBurned) {
              const todayRecord = currentTracker.CalorieBurned.find(
                  (entry) => entry.date === today
              );

              if (todayRecord) {
                  console.log(`Today's calories burned: ${todayRecord.value} ${todayRecord.unit}`);
                  setTodayCaloriesBurned(Math.round(todayRecord.value));
                  return 1;
              }
          }
      }

      setTodayCaloriesBurned(0);
      return -1;
  } catch (error) {
      console.error("Error fetching today's calories burned:", error);
      setTodayCaloriesBurned(0);
      return -1;
  }
};

  addWaterIntakeRecord = (realmInstance, selectedQty) => {
    if (!realmInstance) {
        console.error("Realm instance is not initialized.");
        return;
    }

    try {
        realmInstance.write(() => {
            const tracker = realmInstance.objects("WellnessTrackersSchema");

            // Check if the tracker exists and is not empty
            if (tracker.length > 0) {
                const currentTracker = tracker[tracker.length - 1]; // Get the most recent tracker

                if (currentTracker.WaterIntakeRecord && currentTracker.WaterIntakeRecord.length > 0) {
                    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

                    // Check if a record for today already exists
                    const existingRecord = currentTracker.WaterIntakeRecord.find(record => record.date === today);

                    if (existingRecord) {
                        // If a record for today exists, add the selectedQty to the existing value
                        existingRecord.value += parseFloat(selectedQty);
                        console.log(`Updated today's WaterIntakeRecord to ${existingRecord.value} ${existingRecord.unit}`);
                    } else {
                        // If no record for today, create a new one
                        currentTracker.WaterIntakeRecord.push({
                            date: today, // Add today's date
                            value: selectedQty, // Add selectedQty
                            unit: "ml" // Set unit (default "ml")
                        });
                        console.log(`Added new WaterIntakeRecord for today: ${selectedQty} ml`);
                    }
                } else {
                    // If WaterIntakeRecord is empty, create a new record with the selectedQty
                    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

                    currentTracker.WaterIntakeRecord.push({
                        date: today, // Add today's date
                        value: selectedQty, // Add selectedQty
                        unit: "ml" // Set unit (default "ml")
                    });

                    console.log(`Added new WaterIntakeRecord for today: ${selectedQty} ml`);
                }
            } else {
                console.warn("No WellnessTrackersSchema record found.");
            }
        });
    } catch (error) {
        console.error("Error adding WaterIntakeRecord:", error);
    }
};

  ensureTrackerExists = async (realmInstance) => {
    if (!realmInstance) {
        console.error("Realm instance is not initialized.");
        return false;
    }

    try {
        const tracker = realmInstance.objects("WellnessTrackersSchema");
        
        if (tracker.length === 0) {
            realmInstance.write(() => {
                realmInstance.create("WellnessTrackersSchema", {
                    WaterIntakeRecord: [],
                    waterPerIntake: 150,
                    StepCountRecord: [],
                    CalorieBurned: [],
                });
            });
            console.log("Created initial WellnessTrackersSchema record");
            return true;
        }
        return true;
    } catch (error) {
        console.error("Error ensuring tracker exists:", error);
        return false;
    }
};

  addStepCountRecord = async (realmInstance, getHealthData) => {
    if (!realmInstance) {
        console.error("Realm instance is not initialized.");
        return;
    }

    try {
        // First ensure tracker exists
        await this.ensureTrackerExists(realmInstance);
        
        const totalSteps = await getHealthData();
        console.log("Total steps today so far:", totalSteps);

        realmInstance.write(() => {
            const tracker = realmInstance.objects("WellnessTrackersSchema");
            const currentTracker = tracker[tracker.length - 1];
            const today = new Date().toISOString().split("T")[0];

            if (currentTracker) {
                const existingRecord = currentTracker.StepCountRecord.find(record => record.date === today);

                if (existingRecord) {
                    existingRecord.value = totalSteps;
                    console.log(`Updated today's StepCountRecord to ${existingRecord.value} steps`);
                } else {
                    currentTracker.StepCountRecord.push({
                        date: today,
                        value: totalSteps,
                        unit: "steps"
                    });
                    console.log(`Added new StepCountRecord for today: ${totalSteps} steps`);
                }
            }
        });
    } catch (error) {
        console.error("Error adding StepCountRecord:", error);
    }
};

  addCaloriesBurnedRecord = async (realmInstance, getHealthData) => {
    if (!realmInstance) {
        console.error("Realm instance is not initialized.");
        return;
    }

    try {
        // First ensure tracker exists
        await this.ensureTrackerExists(realmInstance);
        
        const totalCalories = await getHealthData();
        console.log("Retrieved inKilocalories:", totalCalories);

        realmInstance.write(() => {
            const tracker = realmInstance.objects("WellnessTrackersSchema");
            const currentTracker = tracker[tracker.length - 1];
            const today = new Date().toISOString().split("T")[0];

            if (currentTracker) {
                const existingRecord = currentTracker.CalorieBurned.find(record => record.date === today);

                if (existingRecord) {
                    existingRecord.value = totalCalories;
                    console.log(`Updated today's CalorieBurned to ${existingRecord.value} kcal`);
                } else {
                    currentTracker.CalorieBurned.push({
                        date: today,
                        value: totalCalories,
                        unit: "kcal"
                    });
                    console.log(`Added new CalorieBurned for today: ${totalCalories} kcal`);
                }
            }
        });
    } catch (error) {
        console.error("Error adding CalorieBurned:", error);
    }
};

  writeWaterPerIntake = (realmInstance, selectedQty) => {
    if (!realmInstance) {
        console.error("Realm instance is not initialized.");
        return;
    }

    try {
        realmInstance.write(() => {
            // Access the WellnessTrackersSchema object (the most recent one, if any)
            const tracker = realmInstance.objects("WellnessTrackersSchema");

            if (tracker.length > 0) {
                const currentTracker = tracker[tracker.length - 1]; // Get the most recent tracker

                // Update the waterPerIntake value
                currentTracker.waterPerIntake = selectedQty;
                console.log(`Updated waterPerIntake to ${selectedQty}`);
            } else {
                // If no WellnessTrackersSchema exists, create a new record with the default value
                console.log("No existing tracker found, creating a new record with selectedQty");

                realmInstance.create("WellnessTrackersSchema", {
                    WaterIntakeRecord: [], // Empty array for WaterIntakeRecord
                    waterPerIntake: selectedQty,  // Set the selectedQty as the default value
                    StepCountRecord: [],  // Empty array for StepCountRecord
                    CalorieBurned: [],    // Empty array for CalorieBurned
                });

                console.log("New WellnessTrackersSchema record created with waterPerIntake:", selectedQty);
            }
        });
    } catch (error) {
        console.error("Error saving waterPerIntake:", error);
    }
};
  processRealmDataForGraph = (realmInstance,title,setGraphData) => {
    const today = new Date();

    // Generate the last 7 dates in "YYYY-MM-DD" format
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0]; // Convert to string "YYYY-MM-DD"
    });
    

    const tracker = realmInstance.objects("WellnessTrackersSchema");

    // Check if the tracker exists (length > 0)
    if (tracker.length > 0) {
        const currentTracker = tracker[tracker.length - 1]; // Get the most recent tracker
        const recordType = title === "Water Intake" ? "WaterIntakeRecord" : title === "Step Count" ? "StepCountRecord" : title=="Calories Burned"?"CalorieBurned":null;
        // Generate graph data for the last 7 days
        const graphData = last7Days.map((date) => {
          
            if (!currentTracker || !currentTracker[recordType]) {
                // Handle case where there's no WaterIntakeRecord
                console.log("Water intake record not found");
                return { date, value: 0, unit: "ml" };
            }

            // Find the record for the current date
            const record = currentTracker[recordType].find((entry) => entry.date === date);
            return record
                ? { date, value: record.value, unit: record.unit }
                : { date, value: 0, unit: "steps" }; // Return 0 if no record found
        });

        // Reverse the data to match chronological order from past to present
        setGraphData(graphData.reverse());
        console.log(graphData.reverse());
    } else {
        // If no tracker exists, create an empty WellnessTrackersSchema record
        console.log("No tracker found, creating a new empty record");

        realmInstance.write(() => {
            // Create a new WellnessTrackersSchema record with empty values
            realmInstance.create("WellnessTrackersSchema", {
                WaterIntakeRecord: [], // Empty array for WaterIntakeRecord
                waterPerIntake: 150,   // Set default waterPerIntake value
                StepCountRecord: [],   // Empty array for StepCountRecord
                CalorieBurned: [],     // Empty array for CalorieBurned
            });

            console.log("Empty WellnessTrackersSchema record created");
        });

        // After creating an empty record, fetch the data again
        this.processRealmDataForGraph(realmInstance,title,setGraphData);
    }
};

  clearDatabase = (realmInstance) => {
  if (!realmInstance) {
      console.error("Realm instance is not initialized.");
      return;
  }

  try {
      realmInstance.write(() => {
          // Delete all records in the WellnessTrackersSchema
          const allTrackers = realmInstance.objects("WellnessTrackersSchema");
          realmInstance.delete(allTrackers);
          console.log("All records in WellnessTrackersSchema have been deleted.");
      });
  } catch (error) {
      console.error("Error clearing the database:", error);
  }
};
};

export const WellnessTrackersManager = new WellnessTrackersManagerClass();

class PersonalInformationManagerClass{
    initializePersonalInformationRealm=async(setPersonalInformationRealmInstance)=>{
        try {
            // Open Realm for current chats
            const personalInfoRealmInstance = await Realm.open({
                path: 'medicalSummaryRealm.realm',
                schema: [MedicalSummarySchema],
                schemaVersion: 7,
              });
              console.log("Initialized Personal Information Realm Successfully:");
              setPersonalInformationRealmInstance(personalInfoRealmInstance);
              return true;
          } catch (error) {
            console.error("Error initializing Personal Information Realm:", error);
            return false;
          }
    }

    loadFromPersonalInformationRealm = async (realm, setters = {}) => {
      try {
        const medicalSummaries = realm.objects("MedicalSummary");
    
        if (medicalSummaries && medicalSummaries.length > 0) {
          const medicalSummary = medicalSummaries[medicalSummaries.length - 1];
    
          // Apply values robustly
          if (setters.setAge) setters.setAge(medicalSummary.age?.toString() || "0");
          if (setters.setGender) setters.setGender(medicalSummary.gender || "");
          if (setters.setHeight) setters.setHeight(medicalSummary.height?.toString() || "0");
          if (setters.setHeightUnit) setters.setHeightUnit(medicalSummary.heightUnit || "");
          if (setters.setWeight) setters.setWeight(medicalSummary.weight?.toString() || "0");
          if (setters.setWeightUnit) setters.setWeightUnit(medicalSummary.weightUnit || "");
          if (setters.setBloodGroup) setters.setBloodGroup(medicalSummary.bloodGroup || "");
    
          // Process arrays
          if (setters.setAllergies) {
            const allergiesArray = [...(medicalSummary.allergies || [])];
            setters.setAllergies(allergiesArray);
          }
    
          if (setters.setMedConditions) {
            const medConditionsArray = [...(medicalSummary.medConditions || [])];
            setters.setMedConditions(medConditionsArray);
          }
    
          if (setters.setMedications) {
            const medicationsArray = [...(medicalSummary.medications || [])];
            setters.setMedications(medicationsArray);
          }
    
          if (setters.setFamilyHistory) {
            const familyHistoryArray = [...(medicalSummary.familyHistory || [])];
            setters.setFamilyHistory(familyHistoryArray);
          }
    
          if (setters.setDietaryPreference) {
            const dietaryPreferenceArray = [...(medicalSummary.dietaryPreference || [])];
            setters.setDietaryPreference(dietaryPreferenceArray);
          }
    
          // Other properties
          if (setters.setHadVaccine) setters.setHadVaccine(medicalSummary.hadVaccine || false);
          if (setters.setLastVaccinated) setters.setLastVaccinated(medicalSummary.lastVaccinated || "");
          if (setters.setVaccineDescription) setters.setVaccineDescription(medicalSummary.vaccineDescription || "");
          if (setters.setExerciseRoutine) setters.setExerciseRoutine(medicalSummary.exerciseRoutine || "");
          if (setters.setDidSmoke) setters.setDidSmoke(medicalSummary.didSmoke || false);
          if (setters.setSmokingFrequency) setters.setSmokingFrequency(medicalSummary.smokingFrequency || "");
          if (setters.setDidDrink) setters.setDidDrink(medicalSummary.didDrink || false);
          if (setters.setDrinkingFrequency) setters.setDrinkingFrequency(medicalSummary.drinkingFrequency || "");
          if (setters.setSleepTime) setters.setSleepTime(medicalSummary.sleepTime || "");
          if (setters.setWorkTime) setters.setWorkTime(medicalSummary.workTime || "");
        } else {
          console.warn("No data found in Realm.");
        }
      } catch (error) {
        console.error("Failed to load data from Realm:", error);
      }
    };
    
    
    saveToRealm = async (realm,age,gender,height,heightUnit,weight,weightUnit,bloodGroup,allergies,medConditions,medications,familyHistory,hadVaccine,lastVaccinated,vaccineDescription,dietaryPreference,exerciseRoutine,didSmoke,smokingFrequency,didDrink,drinkingFrequency,sleepTime,workTime) => {
      try {
          realm.write(() => {
              realm.create("MedicalSummary", {
                  age: parseInt(age) || 0,
                  gender: gender || "",
                  height: parseFloat(height) || 0,
                  heightUnit: heightUnit || "",
                  weight: parseFloat(weight) || 0,
                  weightUnit: weightUnit || "",
                  bloodGroup: bloodGroup || "",
                  allergies: Array.isArray(allergies) && allergies.length > 0 ? allergies : [],
                  medConditions: Array.isArray(medConditions) && medConditions.length > 0 ? medConditions : [],
                  medications: Array.isArray(medications) && medications.length > 0 ? medications : [],
                  familyHistory: Array.isArray(familyHistory) && familyHistory.length > 0 ? familyHistory : [],
                  hadVaccine: hadVaccine || false,
                  lastVaccinated: lastVaccinated || "",
                  vaccineDescription: vaccineDescription || "", // Ensure it's a string
                  dietaryPreference: Array.isArray(dietaryPreference) && dietaryPreference.length > 0 ? dietaryPreference : [],
                  exerciseRoutine: exerciseRoutine || "",
                  didSmoke: didSmoke || false,
                  smokingFrequency: smokingFrequency || "",
                  didDrink: didDrink || false,
                  drinkingFrequency: drinkingFrequency || "",
                  sleepTime: sleepTime || "",
                  workTime: workTime || "",
              });
          });
          console.log("Data saved successfully to Realm.");
          console.log("Current Database Contents:", realm.objects("MedicalSummary"));
      } catch (error) {
          console.error("Failed to save data to Realm:", error);
      }
  };

}

export const PersonalInformationManager = new PersonalInformationManagerClass();