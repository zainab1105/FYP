// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // Import cors
// const path = require('path');
// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Load environment variables
// const axios = require('axios'); // Add axios for HTTP requests

// const app = express();

// app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // or another service
//     auth: {
//         user: process.env.EMAIL_USER,  // Your email address from .env
//         pass: process.env.EMAIL_PASS   // Your app password from .env
//     },
//     secure: true,  // Secure connection
//     debug: true,   // Detailed logs for debugging
// });

// // Middleware
// app.use(cors()); // Use cors middleware
// app.use(bodyParser.json()); // Parse incoming request bodies as JSON

// // Endpoint to handle email sending
// app.post('/send-alert', async (req, res) => {
//     const { email, location } = req.body;

//     if (!email || !location) { // Validate input
//         return res.status(400).json({ success: false, message: 'Email and location are required.' });
//     }

//     // Extract latitude and longitude from location string
//     const [lat, lng] = location.split(',');

//     // Google Maps Static API URL
//     const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&markers=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

//     const htmlContent = `
//         <p>This is an emergency alert! Your location is:</p>
//         <p><strong>Latitude:</strong> ${lat}, <strong>Longitude:</strong> ${lng}</p>
//         <p><strong>Location Map:</strong></p>
//         <img src="${mapUrl}" alt="Location Map" />
//         <p>Click <a href="https://www.google.com/maps?q=${lat}%20${lng}" target="_blank">here</a> to view the location on Google Maps.</p>
//     `;

//     const mailOptions = {
//         from: process.env.EMAIL_USER,  // Sender email from .env
//         to: email,
//         subject: 'Emergency Alert',
//         html: htmlContent  // Send HTML content with embedded map
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully');
//         return res.status(200).json({ success: true, message: 'Email sent successfully!' });
//     } catch (error) {
//         console.log('Error:', error);
//         return res.status(500).json({ success: false, message: error.toString() });
//     }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// //Google auth set up
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client('CLIENT_ID');

// async function verifyToken(idToken) {
//     const ticket = await client.verifyIdToken({
//         idToken: idToken,
//         audience: CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     console.log(payload);
// }
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables
const axios = require('axios'); // Add axios for HTTP requests

const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from .env
        pass: process.env.EMAIL_PASS   // Your app password from .env
    },
    secure: true,  // Secure connection
    debug: true,   // Detailed logs for debugging
});

    // Middleware
    app.use(cors()); // Use cors middleware
    app.use(bodyParser.json()); // Parse incoming request bodies as JSON

    // Endpoint to handle email sending
    app.post('/send-alert', async (req, res) => {
    const { email, location } = req.body;

    if (!email || !location) { // Validate input
        return res.status(400).json({ success: false, message: 'Email and location are required.' });
    }

    // Extract latitude and longitude from location string
    // const [lat, lng] = location.split(',');

    // Extract only the numerical coordinates from the location string
    const coordinates = location.match(/-?\d+(\.\d+)?/g); // Extract numeric latitude and longitude

    if (!coordinates || coordinates.length < 2) {
        return res.status(400).json({ success: false, message: 'Invalid location format.' });
    }

    // Assign latitude and longitude
    const lat = coordinates[0].trim();
    const lng = coordinates[1].trim();

    // Format location for maps (space-separated)
    const formattedLocation = `${lat} ${lng}`;

    // Google Maps Static API URL
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    function generateStaticMap(lat, lng) {
        const width = 600; // Width of the static map
        const height = 400; // Height of the static map
        const zoom = 13; // Zoom level 
    
        return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red&mapnik`;
    }    

    // Email Content
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender email from .env
        to: email,
        subject: 'Emergency Alert',
        html: `
            <p>This is an emergency alert! Your location is:</p>
            <p><strong> Latitude: ${lat} </strong> <strong>Longitude: ${lng} <strong></p>
            <img src="${generateStaticMap(lat, lng)}" alt="Emergency Location Map" width="600" height="300">
            <p>If the map doesn't load, <a href="${mapUrl}" target="_blank">click here</a> to view your location on Google Maps.</p>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({ success: false, message: error.toString() });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});