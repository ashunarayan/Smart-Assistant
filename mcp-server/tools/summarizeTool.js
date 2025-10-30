// tools/summarizeTool.js
async function execute({ text }) {
  // Simulate summarization (mock GPT call)
  console.log(" Summarizing text...");
  return { summary: `Summary of: ${text}` };
}

module.exports = { execute };
