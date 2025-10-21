const express = require('express');
const app = express();
app.use(express.json());

const gmailTool = require('./tools/gmailTool');
const searchTool = require('./tools/searchTool');
const summarizeTool = require('./tools/summarizeTool');

app.post('/execute', async (req, res) => {
  const { tool, parameters } = req.body;
  let result;
  switch (tool) {
    case 'gmail_tool':
      result = await gmailTool.execute(parameters);
      break;
    case 'search_tool':
      result = await searchTool.execute(parameters);
      break;
    case 'summarize_tool':
      result = await summarizeTool.execute(parameters);
      break;
    default:
      return res.status(400).json({ error: 'Unknown tool' });
  }
  res.json({ tool, result });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
