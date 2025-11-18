
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const gmailTool = require("./tools/gmailTool");
const searchTool = require("./tools/searchTool");
const summarizeTool = require("./tools/summarizeTool");
const weatherTool = require("./tools/weatherTool");
const app = express();
app.use(express.json());

const tools = {
  gmail_tool: gmailTool,
  search_tool: searchTool,
  summarize_tool: summarizeTool,
  weather_tool: weatherTool,
};

app.post("/execute", async (req, res) => {
  try {
    const { tool, parameters } = req.body;
    const selectedTool = tools[tool];

    if (!selectedTool) {
      return res.status(400).json({ error: `Unknown tool: ${tool}` });
    }

    const result = await selectedTool.execute(parameters);
    res.json({ tool, result });
  } catch (error) {
    console.error(" Tool execution error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` MCP server running on port ${PORT}`);
});
