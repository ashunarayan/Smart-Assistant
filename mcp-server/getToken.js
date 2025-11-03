require("dotenv").config();
console.log("Loaded ENV:", process.env.GOOGLE_CLIENT_ID);
const { google } = require("googleapis");
const readline = require("readline");
const { exec } = require("child_process"); 

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

const url = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("\n Authorize this app by visiting this URL (opened automatically):\n");
console.log(url);
exec(`start ${url}`); //  Auto-opens browser on Windows

console.log("\nAfter allowing access, copy the 'code' from the browser URL.\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the authorization code here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code.trim());
    console.log("\n Tokens received successfully:\n", tokens);

    if (tokens.refresh_token) {
      console.log(
        "\n Save this line in your .env file:\nGOOGLE_REFRESH_TOKEN=" +
          tokens.refresh_token
      );
    } else {
      console.log(
        "\n No refresh_token returned. Try re-running with prompt:'consent' (already set)."
      );
    }
  } catch (error) {
    console.error(" Error retrieving access token:", error);
  } finally {
    rl.close();
  }
});
