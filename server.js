const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'khanzainab6002@gmail.com',  // Your email address
        pass: 'jcis jepj iwoh prat'  // Replace with the app password
    }
});


app.post('/send-alert', (req, res) => {
    const { recipientEmail, location } = req.body;

    if (!recipientEmail || !location) {
        return res.status(400).json({ success: false, error: 'Recipient email and location are required.' });
    }

    const message = `Emergency Alert! The user is at location: ${location}. Please help!`;

    const mailOptions = {
        from: 'khanzainab6002@gmail.com',
        to: recipientEmail,
        subject: 'Emergency Alert',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error); // Log the error message for debugging
            return res.status(500).json({ success: false, error: 'Failed to send alert: ' + error.message });
        }
        res.json({ success: true, messageId: info.messageId });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
