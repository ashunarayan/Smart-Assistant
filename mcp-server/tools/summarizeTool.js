// tools/summarizeTool.js

const axios = require("axios");

async function execute({ query }) {
  try {
    if (!query || query.trim() === "") {
      return { error: "Query parameter is required." };
    }

    console.log(` Searching on Google for: "${query}"...`);

    
    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
      },
    });

    const items = response.data.items || [];
    if (items.length === 0) {
      return { error: "No results found for the given query." };
    }

    
    const snippets = items.map(item => item.snippet).slice(0, 5); 
    const combinedText = snippets.join(" ");

    
    const summary = generateSummary(combinedText);

    return {
      status: "success",
      query,
      summary,
      
      
    };

  } catch (error) {
    console.error(" Summarize Tool Error:", error.response?.data || error.message);
    return { error: "Failed to fetch or summarize data." };
  }
}

function generateSummary(text) {
  if (!text) return "No content available to summarize.";
  const sentences = text.split(/[.?!]/).filter(Boolean);
  const shortSummary = sentences.slice(0, 9).join(". ") + ".";
  return shortSummary.trim();
}

module.exports = { execute };
