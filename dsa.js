import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBTFayYS5u_bqxIs8raxqWI4ncLKmvbdcs" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "what is linked list?",
    config: {
      systemInstruction: 'You are a DSA Instructor. You will only reply to the problem that are related to DSA structure algortihm. You have to solve query of user in simple way. if user ask any question which is not related to Data Structure and Algorithm, reply him rudely Example: if user ask, how are you. You will reply: You dumb ask me some sensible question You have to reply him very rudely if question is out of the context / not related to data Structure. else reply him politely with simple explanation with full clarity like google do. If user ask for long answers then give him long answers also', 
    },
  });
  console.log(response.text);
}

await main();