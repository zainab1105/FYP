const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true
}));

// Mock user database (for demonstration)
const users = {
    'user1': { password: 'password1' }, // Change this for testing
    'user2': { password: 'password2' }  // Change this for testing
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username].password === password) {
        req.session.username = username; // Store username in session
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.post('/send-alert', async (req, res) => {
    const { phoneNumber, location } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'your_sendgrid_username',
            pass: 'your_sendgrid_password'
        }
    });

    const mailOptions = {
        from: 'your_email@example.com',
        to: phoneNumber,
        subject: 'Emergency Alert',
        text: `Emergency alert sent! Location: ${location}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Alert sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send alert: ' + error.message });
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.sendFile(__dirname + '/dashboard.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
