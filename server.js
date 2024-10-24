const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public')); // Ensure to serve static files

app.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign-in.html'));
});

app.get('/alert', (req, res) => {
    res.sendFile(path.join(__dirname, 'alert.html'));
});

// Add other necessary routes

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
