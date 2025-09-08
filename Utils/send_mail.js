// Send Email through nodemailer with smtp....

// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   secure: true,
//   host: "smtp.gmail.com",
//   port: 465,
//   auth: {
//     user: process.env.USER, // your Gmail
//     pass: process.env.PASS  // your App Password
//   }
// });

// const sendMail = async (mailOptions) => {
//   try {
//     await transporter.sendMail({
//       from: `"General Knowledge" <${process.env.USER}>`, // must include FROM
//       to: mailOptions.to,
//       subject: mailOptions.subject,
//       html: mailOptions.html
//     });
//   } catch (error) {
//     console.log("❌ Error in send email in utils folder:", error);
//   }
// };

// const isEmailValid = async (securityOptions) => {
//   try {
//    const info = await transporter.sendMail({
//       from: `"General Knowledge" <${process.env.USER}>`,
//       to: securityOptions.to,
//       subject: securityOptions.subject,
//       html: securityOptions.html
//     });

//     console.log(info);

//     return info
    
//   } catch (error) {
//     console.log("Error in security email in utils folder");
//   }
// };

// module.exports = { sendMail, isEmailValid };



// Send Email Through Gmail API with nodemailer...
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI,
  GMAIL_REFRESH_TOKEN,
  GMAIL_USER,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

async function sendEmail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const finalOptions = {
      from: `"General Knowledge" <${GMAIL_USER}>`,
      ...mailOptions,
    };

    const result = await transporter.sendMail(finalOptions);
    console.log("✅ Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
}

module.exports = { sendEmail };