const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Email configuration
// NOTE: You'll need to configure these with your actual email credentials
// For Gmail, you'll need an "App Password" - see README.md
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'join.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

// Handle membership application
app.post('/api/join', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'admin@onlyfoods.com',
      subject: 'New Membership Application - OnlyFoods',
      html: `
        <h2>New Membership Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application. Please try again.' });
  }
});

// Handle order submission
app.post('/api/order', async (req, res) => {
  const { name, email, phone, items, specialInstructions } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      cc: process.env.ADMIN_EMAIL || 'admin@onlyfoods.com',
      subject: 'Order Confirmation - OnlyFoods',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">Order Confirmation</h2>
          <p>Thank you for your order, ${name}!</p>
          
          <h3>Order Details:</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Items:</strong></p>
            <p style="white-space: pre-wrap;">${items}</p>
            ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ''}
          </div>
          
          <h3>Next Steps:</h3>
          <ol>
            <li>Complete your payment via Venmo (link provided on order page)</li>
            <li>Pick up your order at the designated location and time</li>
          </ol>
          
          <p>We'll see you soon!</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">OnlyFoods Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Order submitted successfully! Check your email for confirmation.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to submit order. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
