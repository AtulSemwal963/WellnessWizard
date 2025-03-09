
import { createGlobalState } from "react-hooks-global-state";


const  initialState={
    age:0,
    gender:"",
    height:0,
    heightUnit:"",
    weight:0,
    weightUnit:"",
    bloodGroup:"",
    allergies:[],
    medConditions:[],
    medications:[],
    familyHistory:[],
    hadVaccine:null,
    lastVaccinated:"",
    vaccineDescription:"",
    dietaryPreference:[],
    exerciseRoutine:[],
    didSmoke:null,
    smokingFrequency:"",
    didDrink:null,
    drinkingFrequency:"",
    sleepTime:"",
    workTime:""
  }


const { setGlobalState, useGlobalState } = createGlobalState(initialState);


export {
  useGlobalState,
  setGlobalState,
};
