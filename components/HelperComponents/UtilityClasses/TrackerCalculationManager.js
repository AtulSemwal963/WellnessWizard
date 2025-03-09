class TrackersGoalCalculatorClass{
    calculateRequiredWaterIntake = (exerciseRoutine,weightUnit,weight,setReqWaterIntake) => {
        let waterFactor = 0; // Additional water needed for exercise
        let weightFactor = 0; // Base water intake based on weight
        let totalWater = 0; // Total water intake
    
        // Calculate water factor based on exercise routine
        if (exerciseRoutine === "Less than 30 minutes per week") {
            waterFactor = 0; // Minimal additional water for very low exercise
        } else if (exerciseRoutine === "Around 2 hours per week") {
            waterFactor = (2 * 500) / 7; // ~500 ml/hour, spread over 7 days
        } else if (exerciseRoutine === "Around 5 hours per week") {
            waterFactor = (5 * 500) / 7;
        } else if (exerciseRoutine === "Around 8 hours per week") {
            waterFactor = (8 * 500) / 7;
        }
    
        // Calculate weight factor
        if (weightUnit === "kg") {
            weightFactor = weight * 30; // ~30 ml per kg of body weight
        } else if (weightUnit === "lb") {
            weightFactor = weight * 30 * 0.453592; // Convert lb to kg, then multiply by 30 ml
        }
    
        // Total water intake in ml
        totalWater = weightFactor + waterFactor;
    
        // Convert to liters for display, if needed
        const totalWaterInLiters = totalWater / 1000;
    
        console.log("Required Water (ml):", Math.ceil(totalWater));
        console.log("Required Water (liters):", totalWaterInLiters.toFixed(2));
    
        // Set the required water intake in your state
        setReqWaterIntake(totalWaterInLiters.toFixed(2)); // Sets value in ml
    };
    
    calculateDailyStepsGoal(age,gender,weight,weightUnit,height,heightUnit,setStepCount) {
        stepLengthFeet = 2.3
        if (gender !== "Male" && gender !== "Female") {
          throw new Error("Gender must be either 'male' or 'female'.");
        }
      
        // Convert weight to kilograms if it's in pounds
        let weightKg = weight;
        if (weightUnit === "lbs") {
          weightKg = weight * 0.453592; // 1 pound = 0.453592 kg
          console.log(`Converted weight to kg: ${weightKg}`);
        } else if (weightUnit !== "kg") {
          throw new Error("Weight unit must be 'kg' or 'lbs'.");
        }
      
        // Convert height to centimeters if it's in meters or feet
        let heightCm = height;
        if (heightUnit === "m") {
          heightCm = height * 100; // 1 meter = 100 cm
          console.log(`Converted height to cm: ${heightCm}`);
        } else if (heightUnit === "ft") {
          heightCm = height * 30.48; // 1 foot = 30.48 cm
          console.log(`Converted height to cm: ${heightCm}`);
        } else if (heightUnit !== "cm") {
          throw new Error("Height unit must be 'cm', 'm', or 'ft'.");
        }
      
        // Calculate BMI (BMI = weight (kg) / height (m)^2)
        const heightM = heightCm / 100; // Convert height to meters for BMI calculation
        const BMI = weightKg / (heightM * heightM); // BMI formula
        console.log(`Calculated BMI: ${BMI}`);
      
        // Calculate BMR (Basal Metabolic Rate) based on gender
        let BMR;
        if (gender === "Male") {
          BMR = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
        } else if (gender === "Female") {
          BMR = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
        }
        console.log(`Calculated BMR: ${BMR}`);
      
        // Convert step length to centimeters (1 foot = 30.48 cm)
        const stepLengthCm = stepLengthFeet * 30.48;
        console.log(`Converted step length to cm: ${stepLengthCm}`);
      
        // Calculate daily steps goal using BMR, BMI, and step length
        const dailyStepsGoal = (BMR / BMI) * stepLengthCm;
        console.log(`Calculated Daily Steps Goal: ${dailyStepsGoal}`);
      
        // Return rounded daily steps goal
        const roundedStepsGoal = Math.round(dailyStepsGoal);
        console.log(`Rounded Daily Steps Goal: ${roundedStepsGoal}`);
        setStepCount(Math.round(roundedStepsGoal / 10) * 10); 
      };

      calculateCaloriesToBurn(age,weight,weightUnit,height,heightUnit,gender,setReqCalories,activityLevel = "moderately_active") {
        // Convert weight to kilograms
        let weightKg=weight;
        let heightCm=height;

        if (weightUnit === "lb") {
            weightKg = weight * 0.453592; // 1 lb = 0.453592 kg
        }
      
        // Convert height to centimeters
        if (heightUnit === "m") {
            heightCm=height * 100; // 1 m = 100 cm
        } else if (heightUnit === "ft") {
            heightCm=height * 30.48; // 1 ft = 30.48 cm
        } 
        // else if (heightUnit === "in") {
        //     height = height * 2.54; // 1 in = 2.54 cm
        // }
      
        // Calculate BMR using the Mifflin-St Jeor Equation
        let BMR;
        if (gender == "Male") {
            BMR = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        } else if (gender == "Female") {
            BMR = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        } else {
            throw new Error("Invalid gender. Please provide 'male' or 'female'.");
        }
      
        // Define activity factors
        const activityFactors = {
            sedentary: 1.2,              // Little or no exercise
            lightly_active: 1.375,       // Light exercise 1–3 days/week
            moderately_active: 1.55,     // Moderate exercise 3–5 days/week
            very_active: 1.725,          // Hard exercise 6–7 days/week
            extra_active: 1.9            // Very hard exercise/physical job
        };
      
        // Calculate TDEE
        const activityFactor = activityFactors[activityLevel];
        if (!activityFactor) {
            throw new Error("Invalid activity level. Valid options: sedentary, lightly_active, moderately_active, very_active, extra_active.");
        }
      
        const TDEE = BMR * activityFactor;
        console.log("Req Cal: "+Math.round(TDEE))
        setReqCalories(Math.round(TDEE/10)*10); // Return the result rounded to the nearest whole number
      }
}

export const TrackersGoalCalculator=new TrackersGoalCalculatorClass();