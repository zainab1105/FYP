let savedEmails = []; // Array to hold saved emails
let userLocation = "";

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US'; // Language for speech recognition
recognition.interimResults = true; // To get partial results
recognition.continuous = true; // Keep the recognition on until manually stopped

// Start recognition when the page loads
document.addEventListener('DOMContentLoaded', () => {
    recognition.start(); // Start speech recognition automatically on page load
    getUserLocation();
});

// Speech recognition event listeners
recognition.addEventListener('result', (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim(); // Get the transcript in lowercase
    console.log("Recognized:", transcript);

    if (transcript.includes("send alert")) {
        sendAlert(); // Call sendAlert when "send alert" is detected
    }
});

// Handle errors in speech recognition
recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error:', event.error);
});

// Function to get the user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            userLocation = `Latitude: ${lat}, Longitude: ${lon}`;
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to save email
function saveEmail() {
    const emailInput = document.getElementById('recipient-email');
    const emailList = document.getElementById('email-list');
    const emailValue = emailInput.value.trim();

    if (emailValue !== "" && !savedEmails.includes(emailValue)) {
        savedEmails.push(emailValue);
        
        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-item');
        
        // Add email text
        const emailText = document.createElement('span');
        emailText.innerText = emailValue;

        // Add Font Awesome cross icon
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fas', 'fa-times');
        removeIcon.style.cursor = 'pointer';
        removeIcon.style.marginLeft = '150px';
        removeIcon.onclick = () => removeEmail(emailValue, listItem);

        listItem.appendChild(emailText);
        listItem.appendChild(removeIcon);
        emailList.appendChild(listItem);

        emailInput.value = ""; // Clear input after saving
        alert("Email saved!");
    } else {
        alert("Email is either empty or already saved.");
    }
}

// Function to remove email from saved list
function removeEmail(email, listItem) {
    savedEmails = savedEmails.filter(savedEmail => savedEmail !== email);
    listItem.remove();
    alert("Email removed!");
}

// Function to send alert
async function sendAlert() {
    const location = userLocation;

    if (savedEmails.length === 0 || !location) {
        document.getElementById('response-message').innerHTML = 
            '<p class="error-message">Please save at least one email and allow location access.</p>';
        return;
    }

    let allSuccess = true;
    for (let email of savedEmails) {
        try {
            const response = await fetch('/send-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, location })
            });

            if (!response.ok) {
                const errorData = await response.text(); // Read as text to see the error message
                throw new Error(`Failed to send email alert: ${errorData}`);
            }

            const data = await response.json();
            if (!data.success) {
                allSuccess = false;
                document.getElementById('response-message').innerHTML += 
                    `<p class="error-message">Failed to send email alert to ${email}.</p>`;
            }
        } catch (error) {
            allSuccess = false;
            document.getElementById('response-message').innerHTML += 
                `<p class="error-message">Error sending email alert to ${email}: ${error.message}</p>`;
        }
    }

    if (allSuccess) {
        document.getElementById('response-message').innerHTML = 
            '<p class="success-message">Email alerts sent successfully to all saved emails!</p>';
    }
}

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Initialize the map
            const map = L.map('map').setView([lat, lon], 14);

            // Add a tile layer (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add a marker at the user's location
            L.marker([lat, lon]).addTo(map)
                .bindPopup("Your Location")
                .openPopup();
        }, error => {
            console.error("Unable to retrieve your location:", error);
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

window.onload = initMap;  // Ensure this function runs when the page loads

function Welcome() {
    const audio = document.getElementById('audio');
    audio.muted = false; // Unmute the audio
    audio.play().catch(error => {
        console.error("Autoplay issue:", error);
        alert("Click anywhere to enable audio playback.");
    });
}

document.addEventListener('click', () => {
    const audio = document.getElementById('audio');
    if (audio.paused) {
        audio.play();
    }
});


// // Initialize the map and Google Sign-In when the page loads
// window.onload = function() {
//     // Initialize Google Maps
//     initMap();

//     // Initialize Google Sign-In
//     gapi.load('auth2', function() {
//         gapi.auth2.init({
//             client_id: '998791790071-fokl9jqimkm72imood2og6rvcbuqt5cr.apps.googleusercontent.com'
//         });
//     });
// };
