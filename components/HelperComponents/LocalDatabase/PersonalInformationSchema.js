
const MedicalSummarySchema = {
    name: "MedicalSummary",
    properties: {
    age: "int",
    gender: "string",
    height: "double",
    heightUnit: "string",
    weight: "double",
    weightUnit: "string",
    bloodGroup: "string",
    allergies: { type: "list", objectType: "string" },
    medConditions: { type: "list", objectType: "string" },
    medications: { type: "list", objectType: "string" },
    familyHistory: { type: "list", objectType: "string" },
    hadVaccine: "bool?",
    lastVaccinated: "string",
    vaccineDescription: "string",
    dietaryPreference: { type: "list", objectType: "string" },
    exerciseRoutine: "string",
    didSmoke: "bool?",
    smokingFrequency: "string",
    didDrink: "bool?",
    drinkingFrequency: "string",
    sleepTime: "string",
    workTime: "string",
    },
};

export  { 

    MedicalSummarySchema 
};
