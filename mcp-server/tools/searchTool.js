// Mock Search tool
exports.execute = async ({ query }) => {
  // Simulate search
  return { results: [`Result for "${query}"`] };
};
