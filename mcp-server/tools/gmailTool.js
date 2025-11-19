
// const { google } = require("googleapis");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// oAuth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });

// async function execute({ to, subject, body }) {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: "ashutoshnagaji2003@gmail.com",
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });

//     const mailOptions = {
//       from: "Ashu (MCP Server) <your_email@gmail.com>",
//       to,
//       subject,
//       text: body,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(" Email sent:", result.response);

//     return { status: "sent", to, subject };
//   } catch (error) {
//   console.error("Detailed Gmail send error:", error);
//   return { error: "Failed to send email" };
// }

// }

// module.exports = { execute };



const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

async function execute({ to, subject, body, auth }) {
  try {
    // Validate Auth
    if (!auth || !auth.refreshToken) {
        return { error: "Authorization missing. User must be logged in." };
    }

    console.log(`Authenticating as ${auth.userEmail}...`);

    // 1. Set credentials dynamically for THIS user
    oAuth2Client.setCredentials({
      refresh_token: auth.refreshToken,
    });

    // 2. Get fresh Access Token
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: auth.userEmail,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: auth.refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: auth.userEmail,
      to,
      subject,
      text: body,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    return { status: "sent", to, subject };
  } catch (error) {
    console.error("Gmail Tool Error:", error.message);
    return { error: "Failed to send email." };
  }
}

module.exports = { execute };



// const nodemailer = require("nodemailer");
// require("dotenv").config();

// async function execute({ to, subject, body }) {
//   try {
//     console.log(" Step 1: Creating transporter...");

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, 
//       },
//     });

//     console.log(" Transporter ready. Sending email...");

//     const mailOptions = {
//       from: `Ashu (Smart Assistant) <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text: body,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(" Email sent successfully!");
//     console.log(result.response);

//     return { status: "sent", to, subject };
//   } catch (error) {
//     console.error(" Detailed Gmail send error:");
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     return { error: "Failed to send email" };
//   }
// }

// module.exports = { execute };  
