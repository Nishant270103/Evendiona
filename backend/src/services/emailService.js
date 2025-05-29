// backend/src/services/emailService.js - FIXED VERSION
const nodemailer = require('nodemailer');

// ✅ CORRECT: createTransport (not createTransporter)
const createTransporter = () => {
  return nodemailer.createTransport({  // ✅ Fixed: createTransport
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Order confirmation email template
const generateOrderConfirmationHTML = (order, user) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Evendiona</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
            .content { background: white; padding: 30px 20px; }
            .order-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmed! 🎉</h1>
                <p>Thank you for your purchase, ${user.name}!</p>
            </div>
            <div class="content">
                <p>Hi ${user.name},</p>
                <p>Your order has been confirmed and we're preparing it for shipment.</p>
                
                <div class="order-info">
                    <h3>Order Information</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${orderDate}</p>
                    <p><strong>Total:</strong> ₹${order.pricing.total.toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentInfo.method.toUpperCase()}</p>
                </div>

                <h3>Order Items</h3>
                ${order.items.map(item => `
                    <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                        <strong>${item.name}</strong><br>
                        Size: ${item.size} • Color: ${item.color} • Qty: ${item.quantity}<br>
                        Price: ₹${(item.price * item.quantity).toLocaleString()}
                    </div>
                `).join('')}

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" class="button">
                        Track Your Order
                    </a>
                </div>

                <p>Thank you for choosing Evendiona!</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
const sendOTPEmail = async (user, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: user.email,
      subject: 'Email Verification - Evendiona',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
                .content { background: white; padding: 30px 20px; text-align: center; }
                .otp-box { background: #f3f4f6; border: 2px dashed #6b7280; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .otp-code { font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 8px; margin: 10px 0; }
                .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Email Verification 📧</h1>
                    <p>Welcome to Evendiona!</p>
                </div>
                <div class="content">
                    <p>Hi ${user.name},</p>
                    <p>Thank you for signing up with Evendiona! Please verify your email address to complete your registration.</p>
                    
                    <div class="otp-box">
                        <p><strong>Your Verification Code:</strong></p>
                        <div class="otp-code">${otp}</div>
                        <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes</p>
                    </div>

                    <div class="warning">
                        <p><strong>⚠️ Security Notice:</strong></p>
                        <p style="margin: 5px 0; font-size: 14px;">
                          • Never share this OTP with anyone<br>
                          • Evendiona will never ask for your OTP over phone<br>
                          • This OTP is valid for 10 minutes only
                        </p>
                    </div>

                    <p>If you didn't create an account with us, please ignore this email.</p>
                    <p>Need help? Contact us at support@evendiona.com</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Hi ${user.name},
        
        Welcome to Evendiona! Please verify your email address.
        
        Your verification code: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't create an account with us, please ignore this email.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();  // ✅ This now works

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: user.email,
      subject: `Order Confirmed! #${order.orderNumber} - Evendiona`,
      html: generateOrderConfirmationHTML(order, user),
      text: `
        Hi ${user.name},
        
        Thank you for your order! Your order #${order.orderNumber} has been confirmed.
        
        Order Total: ₹${order.pricing.total.toLocaleString()}
        
        Track your order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders
        
        Thank you for choosing Evendiona!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();  // ✅ This now works

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: user.email,
      subject: 'Welcome to Evendiona! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
                .content { background: white; padding: 30px 20px; }
                .button { background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Evendiona! 🎉</h1>
                </div>
                <div class="content">
                    <p>Hi ${user.name},</p>
                    <p>Welcome to Evendiona! We're excited to have you as part of our community.</p>
                    <p>Discover our premium collection of T-shirts designed for comfort, style, and quality.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/collection" class="button">
                            Shop Collection
                        </a>
                    </div>
                    <p>Happy shopping!<br>The Evendiona Team</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Hi ${user.name},

        Welcome to Evendiona! We're excited to have you as part of our community.

        Discover our premium collection of T-shirts designed for comfort, style, and quality.

        Shop now: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/collection

        Happy shopping!
        The Evendiona Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  generateOTP
};
