const WaterIntakeSchema={
    name:"WaterIntakeSchema",
    properties:{
        date:"string",
        value:"double",
        unit:"string"
    }
}

const StepCountSchema={
    name:"StepCountSchema",
    properties:{
        date:"string",
        value:"double",
        unit:"string"
    }
}

const CalorieBurnedSchema={
    name:"CalorieBurnedSchema",
    properties:{
        date:"string",
        value:"double",
        unit:"string"
    }
}

const WellnessTrackersSchema={
    name:"WellnessTrackersSchema",
    properties:{
      WaterIntakeRecord:{type:"list",objectType:"WaterIntakeSchema"},
      waterPerIntake:'double',
      StepCountRecord:{type:"list",objectType:"StepCountSchema"},
      CalorieBurned:{type:"list",objectType:"CalorieBurnedSchema"}
    }
}

export{
    WaterIntakeSchema,
    StepCountSchema,
    CalorieBurnedSchema,
    WellnessTrackersSchema
}