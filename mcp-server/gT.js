const { execute } = require("./tools/gmailTool.js");

execute({
  to: "ashutoshnagaji2003@gmail.com",
  subject: "Testing Gmail OAuth2",
  body: "This is a test email from Ashu's MCP Gmail tool."
}).then(console.log).catch(console.error);
  