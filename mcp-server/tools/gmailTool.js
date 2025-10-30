
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

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function execute({ to, subject, body }) {
  try {
    console.log("🔹 Step 1: Getting access token...");
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("✅ Access Token received.");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "sriashu0504@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken?.token,
      },
    });

    console.log("🔹 Step 2: Sending email...");
    const mailOptions = {
      from: "Ashu (MCP Server) <sriashu0504@gmail.com>",
      to,
      subject,
      text: body,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log(result);

    return { status: "sent", to, subject };
  } catch (error) {
    console.error("❌ Detailed Gmail send error:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    if (error.response) {
      console.error("Error response:", error.response);
    }

    return { error: "Failed to send email" };
  }
}

module.exports = { execute };
