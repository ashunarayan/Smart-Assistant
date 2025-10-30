// sendTest.js
const axios = require("axios");

async function sendTest() {
  try {
    const resp = await axios.post("http://localhost:4000/execute", {
      tool: "gmail_tool",
      parameters: {
        to: "ashutoshnagaji2003@gmail.com",
        subject: "MCP Test — Please ignore",
        body: "This is a test email sent by MCP Gmail tool."
      }
    }, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000
    });

    console.log("Response from MCP:", JSON.stringify(resp.data, null, 2));
  } catch (err) {
    console.error("Error sending test:", err.response ? err.response.data : err.message);
  }
}

sendTest();
