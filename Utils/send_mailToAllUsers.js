require("dotenv").config();
const brevo = require("@getbrevo/brevo");

const client = new brevo.TransactionalEmailsApi();
client.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendMailToAll(users, subject, html) {
  try {
    const sendSmtpEmail = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      to: users.map((user) => ({ email: user.email })), // ✅ list of recipients
      subject,
      htmlContent: html,
    };

    const result = await client.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent to all users:", result.messageId || result);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.body || error.message);
    throw error;
  }
}

module.exports = { sendMailToAll };