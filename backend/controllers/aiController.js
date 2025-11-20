// const llmService = require('../services/llmService');
// const axios = require('axios');

// exports.handlePrompt = async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const user = req.user; // Get logged-in user details

//     // 1. Ask LLM what to do
//     const llmResult = await llmService.decideAction(prompt);

//     // 2. If LLM selects a tool (like gmail_tool or search_tool)
//     if (llmResult.action !== 'respond') {
      
//       // --- FIX STARTS HERE ---
//       // We must define this variable BEFORE checking for specific tools
//       let executionParams = { ...llmResult.parameters }; 

//       // Only if it is Gmail, we inject the auth tokens
//       if (llmResult.action === 'gmail_tool') {
//         // Safety check
//         if (!user || !user.refresh_token) {
//              return res.status(400).json({ 
//                success: false, 
//                error: "Authentication Error: No refresh token found. Please logout and login again." 
//              });
//         }

//         // Add auth details to the existing params
//         executionParams.auth = {
//             refreshToken: user.refresh_token,
//             userEmail: user.email
//         };
//       }
//       // --- FIX ENDS HERE ---

//       // 3. Send to MCP Server
//       // Now 'executionParams' is definitely defined and ready to use
//       const mcpResult = await axios.post('http://localhost:4000/execute', {
//         tool: llmResult.action,
//         parameters: executionParams 
//       });

//       return res.json({
//         success: true,
//         action: llmResult.action,
//         result: mcpResult.data,
//       });
//     }

//     // 4. Otherwise, return LLM's direct response
//     return res.json({
//       success: true,
//       action: 'respond',
//       result: llmResult.parameters.response,
//     });
    
//   } catch (err) {
//     console.error("AI Controller Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

const llmService = require('../services/llmService');
const axios = require('axios');

exports.handlePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user;

    // Initialize conversation history with the User's first message
    let messages = [{ role: "user", content: prompt }];
    
    // Loop to allow multiple steps (Limit to 5 steps to prevent infinite loops)
    let steps = 0;
    const MAX_STEPS = 5;

    while (steps < MAX_STEPS) {
      steps++;
      console.log(` Step ${steps}: Asking LLM...`);

      // 1. Ask LLM what to do based on current history
      const llmResult = await llmService.decideAction(messages);
      console.log(" LLM Decided:", llmResult.action);

      // STOP CONDITION: If LLM wants to talk to user, we are done.
      if (llmResult.action === 'respond') {
        return res.json({
          success: true,
          action: 'respond',
          result: llmResult.parameters.response,
        });
      }

      // 2. Prepare Tool Execution
      let executionParams = { ...llmResult.parameters };

      // Inject Auth for Gmail
      if (llmResult.action === 'gmail_tool') {
        if (!user || !user.refresh_token) {
             return res.status(400).json({ success: false, error: "Auth missing for email." });
        }
        executionParams.auth = {
            refreshToken: user.refresh_token,
            userEmail: user.email
        };
      }

      // 3. Execute the Tool
      let toolOutput;
      try {
        const mcpResponse = await axios.post('http://localhost:4000/execute', {
          tool: llmResult.action,
          parameters: executionParams
        });
        toolOutput = mcpResponse.data.result;
      } catch (error) {
        toolOutput = "Tool Execution Failed: " + error.message;
      }

      // 4. IMPORTANT: Add the result back to memory so LLM knows what happened
      // We add TWO messages: 
      // A. What the AI *wanted* to do (assistant role)
      // B. What the Tool *actually* returned (function/system context)
      
      messages.push({ 
          role: "assistant", 
          content: JSON.stringify(llmResult) 
      });

      messages.push({ 
          role: "user", 
          content: `Tool '${llmResult.action}' Output: ${JSON.stringify(toolOutput)}` 
      });
      
      // The loop now repeats! The LLM will see the tool output in the next iteration.
    }

    res.json({ success: false, error: "Too many steps. Task aborted." });

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};