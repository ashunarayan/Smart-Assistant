// System prompt for LLM: describes available tools and selection logic
const systemPrompt = `
You are an intelligent assistant. Your job is to analyze the user's prompt and decide which tool to use.
Available tools:
- gmail_tool: Send an email. Parameters: { to, subject, body }
- search_tool: Search the web. Parameters: { query }
- summarize_tool: Summarize text. Parameters: { text }
If the prompt matches a tool, respond with: { "action": "<tool_name>", "parameters": { ... } }
If no tool matches, respond with: { "action": "respond", "parameters": { "response": "<your reply>" } }
Always return a valid JSON object.
`;

// Replace with actual LLM API call (e.g., OpenAI)
async function callLLM(userPrompt) {
  // Mock: returns tool based on keywords
  if (userPrompt.includes('email')) {
    return { action: 'gmail_tool', parameters: { to: 'riya@example.com', subject: 'Hello', body: 'Hi Riya!' } };
  }
  if (userPrompt.includes('search')) {
    return { action: 'search_tool', parameters: { query: 'Elon Musk latest projects' } };
  }
  if (userPrompt.includes('summarize')) {
    return { action: 'summarize_tool', parameters: { text: 'Some text to summarize.' } };
  }
  return { action: 'respond', parameters: { response: 'I can help you with emails, search, or summarization.' } };
}

exports.decideAction = async (userPrompt) => {
  // In production, send systemPrompt + userPrompt to LLM and parse JSON response
  return await callLLM(userPrompt);
};
