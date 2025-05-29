// backend/test-email.js - FIXED VERSION
const path = require('path');

// ✅ LOAD DOTENV FIRST - BEFORE ANY OTHER IMPORTS
require('dotenv').config({ path: path.join(__dirname, '.env') });

const nodemailer = require('nodemailer');
const { sendOrderConfirmationEmail, sendWelcomeEmail } = require('./src/services/emailService');

const testEmailService = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('Email Host:', process.env.EMAIL_HOST);
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email configured:', !!process.env.EMAIL_PASS);
    console.log('Current working directory:', process.cwd());
    console.log('Looking for .env at:', path.join(__dirname, '.env'));

    // Check if environment variables are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Environment variables not loaded!');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('EMAIL')));
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    console.log('🔗 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    console.log('📧 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: 'your-test-email@gmail.com', // Replace with your email
      subject: 'Test Email - Evendiona Backend',
      html: `
        <h1>Email Service Test</h1>
        <p>If you receive this email, your email service is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: `Email Service Test - If you receive this email, your email service is working correctly! Timestamp: ${new Date().toISOString()}`
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('💡 Authentication failed. Check your email credentials.');
      console.log('💡 Make sure you are using an App Password, not your regular Gmail password.');
    } else if (error.code === 'ECONNECTION') {
      console.log('💡 Connection failed. Check your network and SMTP settings.');
    }
  }
};

// Test order and welcome emails
const testOrderAndWelcomeEmails = async () => {
  // Check if environment variables are loaded
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Cannot test emails - environment variables not loaded!');
    return;
  }

  const testOrder = {
    orderNumber: 'EVN-TEST-001',
    createdAt: new Date(),
    items: [
      {
        name: 'Highland Mountains Tee',
        price: 999,
        quantity: 2,
        size: 'M',
        color: 'Black'
      }
    ],
    pricing: {
      subtotal: 1998,
      tax: 360,
      shipping: 0,
      total: 2358
    },
    paymentInfo: {
      method: 'cod'
    }
  };

  const testUser = {
    name: 'John Doe',
    email: 'your-test-email@gmail.com' // Replace with your email
  };

  console.log('Testing order confirmation email...');
  const orderResult = await sendOrderConfirmationEmail(testOrder, testUser);
  console.log('Order email result:', orderResult);

  console.log('Testing welcome email...');
  const welcomeResult = await sendWelcomeEmail(testUser);
  console.log('Welcome email result:', welcomeResult);
};

// Run tests
const runAllTests = async () => {
  await testEmailService();
  console.log('\n' + '='.repeat(50) + '\n');
  await testOrderAndWelcomeEmails();
};

runAllTests();
