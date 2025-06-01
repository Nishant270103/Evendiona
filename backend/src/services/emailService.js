// backend/src/services/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS  // your Gmail app password
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: true,  // Enable logging for debug
  debug: true    // Show debug output
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to send messages');
  }
});

const sendOTPEmail = async (email, otp, userName = '') => {
  try {
    const mailOptions = {
      from: `"Evendiona" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code for Evendiona',
      html: `
        <h2>Hello ${userName || 'User'},</h2>
        <p>Your OTP code is:</p>
        <h1 style="font-weight:bold;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,<br/>Evendiona Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
