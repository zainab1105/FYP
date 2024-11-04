const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express(); // Initialize app here
const PORT = process.env.PORT || 3000;

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("100219468018-ohnsjn7me4r86optric85cnmulo8aih0.apps.googleusercontent.com");

// Middleware
app.use(cors()); // Use cors middleware here
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your HTML files

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another service
    auth: {
        user: 'khanzainab6002@gmail.com',  // Your email address
        pass: 'jcis jepj iwoh prat'  // Replace with the app password
    }
});

// Endpoint to handle email sending
app.post('/send-alert', (req, res) => {
    const { email, location } = req.body;

    if (!email || !location) { // Validate input
        return res.status(400).json({ success: false, message: 'Email and location are required.' });
    }

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Emergency Alert',
        text: 'This is an emergency alert! Your location is: ${location}'
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
    console.log('Server is running on http://localhost:${PORT}');
});

app.post('/google-signin', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "100219468018-ohnsjn7me4r86optric85cnmulo8aih0.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // Verify user or save to DB, etc.
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: "Google sign-in verification failed" });
    }
});
console.log("Google Auth Library Loaded");
