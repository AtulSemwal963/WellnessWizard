import {PartSchema,MessageSchema,CurrentChatSchema} from './CurrentChatSchema'

const ArchivedChatsSchema={
  name:"ArchivedChats",
  properties:{
    chatId:"string",
    chatName:"string",
    chatDate:"string",
    chat:{ type: "object", objectType: "CurrentChat" },
  },
  primaryKey:"chatId"
}

export {ArchivedChatsSchema}