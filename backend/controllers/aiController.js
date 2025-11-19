const llmService = require('../services/llmService');
const axios = require('axios');

// Handles incoming user prompt
exports.handlePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user; // Access logged-in user details
    // 1. Send prompt to LLM to get action decision
    const llmResult = await llmService.decideAction(prompt);

    // 2. If LLM selects a tool, execute via MCP
    if (llmResult.action === 'gmail_tool') {
        if (!user.refresh_token) {
             return res.status(400).json({ success: false, error: "No permission to send emails. Please logout and login again." });
        }
        executionParams.auth = {
            refreshToken: user.refresh_token,
            userEmail: user.email
        };
      }

      // Call MCP Server
      const mcpResult = await axios.post('http://localhost:4000/execute', {
        tool: llmResult.action,
        parameters: executionParams
      });

      return res.json({
        success: true,
        action: llmResult.action,
        result: mcpResult.data,
      });
  
    // 3. Otherwise, return LLM's direct response
    return res.json({
      success: true,
      action: 'respond',
      result: llmResult.parameters.response,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
