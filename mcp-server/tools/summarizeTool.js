// Mock Summarize tool (calls GPT, here just returns a mock)
exports.execute = async ({ text }) => {
  // Simulate summarization
  return { summary: `Summary of: ${text}` };
};
