const API_KEY="AIzaSyDlpqIqg9-3L6wACVBx5UtB9Q-Ol_3V2nI"
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path= require('path');
const fs = require("fs");

const CHAT_HISTORY=JSON.parse(fs.readFileSync(path.join(__dirname,"../ProfilePageStack/ChatHistory.json"))) ;

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(API_KEY);
// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({
  history: CHAT_HISTORY
});
console.log(CHAT_HISTORY)
let result = await chat.sendMessage("I have 2 dogs in my house.");
console.log(result.response.text());
result = await chat.sendMessage("How many paws are in my house?");
console.log(result.response.text());