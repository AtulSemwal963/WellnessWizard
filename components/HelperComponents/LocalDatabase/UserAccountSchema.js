import {ArchivedChatsSchema} from './ArchivedChatsSchema'
import {PartSchema,MessageSchema,CurrentChatSchema} from './CurrentChatSchema'
import { ArchivedGuideSchema,GuideSchema } from './ArchivedGuides';

const UserAccountSchema={
    name:"UserAccount",
    properties:{
        id:"string",
        sub:"string",
        email:"string",
        name:"string",
        picture:"string",
        currentChat:{type:"object",objectType:"CurrentChat"},
        archivedChats:{type:"object",objectType:"ArchivedChats"}, 
        archivedGuides:{type:"object",objectType:"ArchivedGuide"}
    },
    primaryKey:"sub"
}

export default UserAccountSchema;