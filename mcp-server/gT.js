const { execute } = require("./tools/gmailTool.js");

execute({
  to: "apurvasrivastava2403@gmail.com",
  subject: "Testing Gmail OAuth2",
  body: "This is a test email from Ashu's MCP Gmail tool. mcp tool work kar raha hai.ye mail mai apne project se send kiya hu.agar pahuch gaya to whatsaap pe bata dena.all ok"
}).then(console.log).catch(console.error);
  