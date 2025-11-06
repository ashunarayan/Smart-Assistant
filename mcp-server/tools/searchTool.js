// tools/searchTool.js
const axios = require("axios");

async function execute({ query }) {
  try {
    if (!query || query.trim() === "") {
      return { error: "Query parameter is required." };
    }

    console.log(` Searching for: "${query}"...`);

    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
      },
    });

    const results = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    console.log(" Search completed successfully.");
    return { status: "success", query, results };

  } catch (error) {
    console.error(" Search Tool Error:", error.message);
    return { error: "Search failed. Please try again later." };
  }
}

module.exports = { execute };
