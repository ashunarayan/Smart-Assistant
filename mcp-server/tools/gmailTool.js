// Mock Gmail tool
exports.execute = async ({ to, subject, body }) => {
  // Simulate sending email
  return { status: 'sent', to, subject, body };
};
