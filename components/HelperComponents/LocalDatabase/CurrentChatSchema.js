const PartSchema={
    name:"PartSchema",
    properties:{
        text:"string"
    }
}

const MessageSchema={
    name:"MessageSchema",
    properties:{
        messageId:"string",
        role:"string",
        highlighted:"bool",
        parts:{type:'list',objectType:'PartSchema'}
    }
}

const CurrentChatSchema={
    name:"CurrentChat",
    properties:{
        timestamp:'string',
        message:{type:'list',objectType:'MessageSchema'}
    },
    primaryKey:'timestamp',
};

export {PartSchema,MessageSchema,CurrentChatSchema};