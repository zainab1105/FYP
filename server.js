require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Set up the Nodemailer transporter using environment variables for security
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,  // Email from .env file
        pass: process.env.EMAIL_PASS  // Password from .env file
    }
});

// Route to add a new emergency email to the list
// Route to add a new emergency email to the list
app.post('/add-email', (req, res) => {
    const { newEmail } = req.body;

    // Check if emails.json file exists, if not, create it with an empty array
    if (!fs.existsSync('emails.json')) {
        fs.writeFileSync('emails.json', JSON.stringify([])); // Create an empty array if file does not exist
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // This regex checks for a valid email format
    if (!newEmail || !emailRegex.test(newEmail)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    try {
        let emails = JSON.parse(fs.readFileSync('emails.json', 'utf8'));

        if (!emails.includes(newEmail)) {  // Avoid duplicates
            emails.push(newEmail);
            fs.writeFileSync('emails.json', JSON.stringify(emails));
            res.json({ success: true, message: 'Email added successfully' });
        } else {
            res.status(400).json({ success: false, error: 'Email already exists' });
        }
    } catch (error) {
        console.error("Error reading or writing email file:", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// Route to get all saved emails
app.get('/emails', (req, res) => {
    try {
        const emails = fs.existsSync('emails.json') ? JSON.parse(fs.readFileSync('emails.json', 'utf8')) : [];
        res.json({ emails });
    } catch (error) {
        console.error("Error reading email list:", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Route to send an emergency alert to all saved email addresses
app.post('/send-alert', (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ success: false, error: 'Location is required.' });
    }

    try {
        const emails = JSON.parse(fs.readFileSync('emails.json', 'utf8'));

        const message = `Emergency Alert! The user is at location: ${location}. Please help!`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: emails.join(", "),  // Send to all emails in the list
            subject: 'Emergency Alert',
            text: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error.message);
                return res.status(500).json({ success: false, error: 'Failed to send alert: ' + error.message });
            }
            res.json({ success: true, messageId: info.messageId });
        });
    } catch (error) {
        console.error("Error reading email list:", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
