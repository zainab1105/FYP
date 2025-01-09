const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

//Google auth set up
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('CLIENT_ID');

async function verifyToken(idToken) {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
}

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from .env
        pass: process.env.EMAIL_PASS   // Your app password from .env
    },
    secure: true,  // Add a comma here between auth and secure
    debug: true,   // Add this to get detailed logs
});

const app = express(); // Initialize app here
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Use cors middleware here
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your HTML files

// Endpoint to handle email sending
app.post('/send-alert', (req, res) => {
    const { email, location } = req.body;

    if (!email || !location) { // Validate input
        return res.status(400).json({ success: false, message: 'Email and location are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender email from .env
        to: email,
        subject: 'Emergency Alert',
        text: `This is an emergency alert! Your location is: ${location}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).json({ success: false, message: error.toString() });
        }
        console.log('Email sent:', info.response);
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
