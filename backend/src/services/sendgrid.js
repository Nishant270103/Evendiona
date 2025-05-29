// backend/services/sendgrid.js - SENDGRID SETUP
const sgMail = require('@sendgrid/mail');

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmailSendGrid = async (user, otp) => {
  try {
    const msg = {
      to: user.email,
      from: {
        email: 'noreply@evendiona.com', // ✅ Your domain email
        name: 'Evendiona'
      },
      subject: 'Email Verification - Evendiona',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification 📧</h2>
          <p>Hi ${user.name},</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</div>
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    };

    const response = await sgMail.send(msg);
    console.log('✅ SendGrid email sent:', response[0].statusCode);
    return { success: true, messageId: response[0].headers['x-message-id'] };

  } catch (error) {
    console.error('❌ SendGrid error:', error);
    return { success: false, error: error.message };
  }
};
