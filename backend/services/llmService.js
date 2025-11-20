// const axios = require("axios");
// const dotenv = require("dotenv");
// dotenv.config();

// //  System prompt: guides the LLM how to respond
// const systemPrompt = `
// You are an intelligent assistant that decides which tool to use based on user input.

// Available tools:
// 1. gmail_tool — Send an email. Parameters: { to, subject, body }
// 2. search_tool — Search the web. Parameters: { query }
// 3. summarize_tool — Summarize text. Parameters: { text }
// 4. weather_tool — Get current weather for a specific city. Parameters: { location }

// Your job:
// - Read the user's message carefully.
// - Return a valid JSON object in this format:
//   { "action": "<tool_name>", "parameters": { ... } }

// Rules:
// - Extract real parameters from user text (e.g., email addresses, subjects, etc.).
// - If required info is missing, ask user politely for clarification in the "respond" action.
// - Never include explanations or extra text outside the JSON.
// `;

// // Function to call OpenAI API
// async function callLLM(userPrompt) {
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini", 
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//         temperature: 0.3, 
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     let content = response.data.choices[0].message.content.trim();

//     // Clean & parse JSON safely
//     try {
//       // Sometimes models wrap JSON in code blocks ```json ... ```
//       content = content.replace(/```json|```/g, "").trim();
//       const parsed = JSON.parse(content);
//       return parsed;
//     } catch (parseErr) {
//       console.error(" Error parsing LLM response:", content);
//       return {
//         action: "respond",
//         parameters: {
//           response:
//             "Sorry, I couldn’t understand that request properly. Could you rephrase it?",
//         },
//       };
//     }
//   } catch (err) {
//     console.error(" Error in callLLM:", err.response?.data || err.message);
//     return {
//       action: "respond",
//       parameters: {
//         response: "There was an issue connecting to the AI service.",
//       },
//     };
//   }
// }

// async function decideAction(userPrompt) {
//   return await callLLM(userPrompt);
// }

// module.exports = { decideAction };




// AGENT MULTIPLE TOOL CALLING

const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const systemPrompt = `
You are an intelligent Agent. You can use multiple tools in a sequence to complete a task.

Available tools:
1. gmail_tool — Send an email. Parameters: { to, subject, body }
2. search_tool — Search the web. Parameters: { query }
3. summarize_tool — Summarize text. Parameters: { text }
4. weather_tool — Get current weather. Parameters: { location }

Your Process:
1. Receive a user prompt.
2. If you need information (like "what is gravity" or "weather in Delhi") BEFORE you can send an email, use the search or weather tool FIRST.
3. Once you receive the tool result, use the next tool (like gmail_tool) with the information you gathered.
4. If the task is finished, use "respond".

Output JSON Format:
{ "action": "<tool_name>", "parameters": { ... } }
`;

// NOW ACCEPTS A MESSAGE HISTORY ARRAY, NOT JUST A STRING
async function decideAction(messageHistory) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: systemPrompt },
          ...messageHistory // Spread the conversation history here
        ],
        temperature: 0.3, 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    let content = response.data.choices[0].message.content.trim();

    try {
      content = content.replace(/```json|```/g, "").trim();
      return JSON.parse(content);
    } catch (parseErr) {
      console.error("JSON Parse Error:", content);
      // Force a retry or respond
      return { action: "respond", parameters: { response: "Error parsing AI decision." } };
    }
  } catch (err) {
    console.error("LLM API Error:", err.message);
    return { action: "respond", parameters: { response: "AI Service Unavailable." } };
  }
}

module.exports = { decideAction };