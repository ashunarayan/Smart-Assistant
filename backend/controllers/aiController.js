const llmService = require('../services/llmService');
const axios = require('axios');

exports.handlePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user; // Get logged-in user details

    // 1. Ask LLM what to do
    const llmResult = await llmService.decideAction(prompt);

    // 2. If LLM selects a tool (like gmail_tool or search_tool)
    if (llmResult.action !== 'respond') {
      
      // --- FIX STARTS HERE ---
      // We must define this variable BEFORE checking for specific tools
      let executionParams = { ...llmResult.parameters }; 

      // Only if it is Gmail, we inject the auth tokens
      if (llmResult.action === 'gmail_tool') {
        // Safety check
        if (!user || !user.refresh_token) {
             return res.status(400).json({ 
               success: false, 
               error: "Authentication Error: No refresh token found. Please logout and login again." 
             });
        }

        // Add auth details to the existing params
        executionParams.auth = {
            refreshToken: user.refresh_token,
            userEmail: user.email
        };
      }
      // --- FIX ENDS HERE ---

      // 3. Send to MCP Server
      // Now 'executionParams' is definitely defined and ready to use
      const mcpResult = await axios.post('http://localhost:4000/execute', {
        tool: llmResult.action,
        parameters: executionParams 
      });

      return res.json({
        success: true,
        action: llmResult.action,
        result: mcpResult.data,
      });
    }

    // 4. Otherwise, return LLM's direct response
    return res.json({
      success: true,
      action: 'respond',
      result: llmResult.parameters.response,
    });
    
  } catch (err) {
    console.error("AI Controller Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};