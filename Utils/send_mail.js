const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.USER, // your Gmail
    pass: process.env.PASS  // your App Password
  }
});

const sendMail = async (mailOptions) => {
  try {
    transporter.sendMail({
      from: `"General Knowledge" <${process.env.USER}>`, // must include FROM
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.log("❌ Error in send email in utils folder:", error);
  }
};

const isEmailValid = async (securityOptions) => {
  try {
    transporter.sendMail({
      from: `"General Knowledge" <${process.env.USER}>`,
      to: securityOptions.to,
      subject: securityOptions.subject,
      html: securityOptions.html
    });
    
  } catch (error) {
    console.log("Error in security email in utils folder");
  }
};

module.exports = { sendMail, isEmailValid };
