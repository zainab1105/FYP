let userLocation = "";

// Get saved emails from local storage if they exist
const savedEmails = JSON.parse(localStorage.getItem('recipientEmails')) || [];

// Function to get user location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            userLocation = `Latitude: ${lat}, Longitude: ${lon}`;
            // Optionally, you can also update the map view here
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function sendAlert() {
    const responseMessage = document.getElementById('response-message');
    responseMessage.className = ""; // Reset to default class

    if (savedEmails.length === 0 || !userLocation) {
        alert("Please ensure at least one email is saved and the location is loaded.");
        return;
    }

    const sendAlertButton = document.getElementById('send-alert-btn');
    sendAlertButton.disabled = true;
    responseMessage.innerText = "Sending alert...";

    try {
        const response = await fetch('/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientEmails: savedEmails, location: userLocation }) // Send array of emails
        });

        if (!response.ok) {
            const errorData = await response.json();
            responseMessage.innerText = "Failed to send alert: " + (errorData.error || "Unknown error");
            responseMessage.className = "error-message"; // Add error class
        } else {
            const data = await response.json();
            responseMessage.innerText = "Email alert sent successfully. Message ID: " + data.messageId;
            responseMessage.className = "success-message"; // Add success class
        }
    } catch (error) {
        responseMessage.innerText = "Error: " + error.message;
        responseMessage.className = "error-message"; // Add error class
    } finally {
        sendAlertButton.disabled = false;
    }
}

// Function to add a new email
function addEmail() {
    const emailInput = document.getElementById('emailInput');
    const newEmail = emailInput.value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    if (!newEmail || !emailRegex.test(newEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!savedEmails.includes(newEmail)) {
        savedEmails.push(newEmail); // Add new email to the array
        localStorage.setItem('recipientEmails', JSON.stringify(savedEmails)); // Save updated emails to local storage
        emailInput.value = ''; // Clear input field
        displayEmails(); // Update email display
    } else {
        alert("Email already exists in the list.");
    }
}

// Function to display saved emails
function displayEmails() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = savedEmails.map(email => `<li>${email}</li>`).join(''); // Display all saved emails
}

// Call getUserLocation() to set the user's location
getUserLocation();
displayEmails(); // Initial call to display existing emails

// Event listener for adding email
document.getElementById('addEmailButton').addEventListener('click', addEmail);
