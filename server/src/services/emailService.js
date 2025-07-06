require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = null;

async function setupTransporter() {
  if (!transporter) {
    // If ETHEREAL credentials are not set, generate a test account
    if (!process.env.ETHEREAL_USER || !process.env.ETHEREAL_PASS) {
      const testAccount = await nodemailer.createTestAccount();
      console.log('Generated Ethereal test account:', testAccount);

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // Show generated credentials
      console.log('👤 Ethereal Test Email:', testAccount.user);
      console.log('🔑 Ethereal Test Pass:', testAccount.pass);
    } else {
      // Use environment credentials (your own Ethereal account)
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: process.env.ETHEREAL_USER,
          pass: process.env.ETHEREAL_PASS,
        },
      });
    }
  }

  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = await setupTransporter();

    const info = await transporter.sendMail({
      from: '"FarmWork Hub" <no-reply@farmworkhub.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Message sent: %s", info.messageId);
    console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = {
  sendEmail,
};
