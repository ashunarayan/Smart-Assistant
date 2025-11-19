

// const { google } = require("googleapis");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// async function execute({ to, subject, body, auth }) {
//   try {
//     console.log("--- GMAIL TOOL DEBUG START ---");
    
//     if (!auth || !auth.refreshToken) {
//         return { error: "Authorization missing. User must be logged in." };
//     }

//     // DEBUG: Check if env vars are loaded
//     if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//         console.error("CRITICAL: Google Client ID/Secret missing in MCP .env");
//         return { error: "Server misconfiguration (Missing .env credentials)" };
//     }

//     console.log(`1. Authenticating as: ${auth.userEmail}`);
//     console.log(`2. Using Refresh Token (first 10 chars): ${auth.refreshToken.substring(0,10)}...`);

//     oAuth2Client.setCredentials({
//       refresh_token: auth.refreshToken,
//     });

//     // Try to generate an access token manually to see if the Refresh Token is valid
//     console.log("3. Attempting to fetch Access Token...");
//     const accessTokenResponse = await oAuth2Client.getAccessToken();
//     const accessToken = accessTokenResponse?.token;

//     if (!accessToken) {
//         throw new Error("Failed to generate Access Token. Your Refresh Token might be invalid or revoked.");
//     }
//     console.log("4. Access Token generated successfully!");

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: auth.userEmail,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: auth.refreshToken,
//         accessToken: accessToken,
//       },
//     });

//     const mailOptions = {
//       from: auth.userEmail,
//       to,
//       subject,
//       text: body,
//     };

//     console.log("5. Sending email via Nodemailer...");
//     const result = await transporter.sendMail(mailOptions);
//     console.log(" Email sent successfully!");

//     return { status: "sent", to, subject };
//   } catch (error) {
//     console.error(" GMAIL TOOL ERROR DETAILS:");
//     console.error(error.message);
//     // If it's a Google API error, it often has more info in 'response'
//     if(error.response) console.error(error.response.data);
    
//     return { error: "Failed to send email: " + error.message };
//   }
// }

// module.exports = { execute };




const { google } = require("googleapis");
require("dotenv").config();

// Initialize OAuth Client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

async function execute({ to, subject, body, auth }) {
  try {
    console.log("--- GMAIL API TOOL STARTED ---");
    
    if (!auth || !auth.refreshToken) {
        return { error: "Authorization missing. User must be logged in." };
    }

    // 1. Set the User's Credentials
    console.log(`1. Setting credentials for: ${auth.userEmail}`);
    oAuth2Client.setCredentials({
      refresh_token: auth.refreshToken,
    });

    // 2. Initialize the Gmail API Service
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    // 3. Construct the Email (MIME Format)
    // We must manually build the email string including headers
    console.log("2. Constructing email...");
    
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: <${auth.userEmail}>`,
      `To: <${to}>`,
      `Subject: ${utf8Subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      `MIME-Version: 1.0`,
      ``,
      body
    ];
    const message = messageParts.join('\n');

    // 4. Encode to Base64URL (Required by Gmail API)
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // 5. Send the Request
    console.log("3. Sending via Gmail REST API...");
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(" Email sent successfully! ID:", res.data.id);
    return { status: "sent", to, subject, messageId: res.data.id };

  } catch (error) {
    console.error(" GMAIL API ERROR:");
    console.error(error.message);
    
    if (error.response) {
        console.error("API Detail:", error.response.data);
    }
    return { error: "Failed to send email via API: " + error.message };
  }
}

module.exports = { execute };