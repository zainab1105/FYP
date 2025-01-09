let userLocation = "";
let savedEmails = []; // Array to hold saved emails

// Initialize the map and get user location
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            userLocation = `https://www.google.com/maps?q=${latitude},${longitude}`; // Corrected location format

            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: latitude, lng: longitude },
                zoom: 14
            });

            new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map
            });
        }, error => {
            alert("Error getting location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Handle sending alert to the last saved email
async function sendAlert() {
    if (savedEmails.length === 0 || !userLocation) {
        alert("Please save at least one email and ensure location is loaded.");
        return;
    }

    const sendAlertButton = document.getElementById('send-alert-btn');
    const responseMessage = document.getElementById('response-message');
    sendAlertButton.disabled = true;
    responseMessage.innerText = "Sending alert...";

    // Send alert to all saved emails
    try {
        for (const email of savedEmails) {
            const response = await fetch('/send-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientEmail: email, location: userLocation })
            });

            if (!response.ok) {
                const errorData = await response.json();
                responseMessage.innerText = "Failed to send alert to " + email + ": " + (errorData.error || "Unknown error");
            } else {
                const data = await response.json();
                responseMessage.innerText = "Email alert sent successfully to " + email + "!";
            }
        }
    } catch (error) {
        responseMessage.innerText = "Error: " + error.message;
    } finally {
        sendAlertButton.disabled = false;
    }
}

// Save email to list
function saveEmail() {
    const emailInput = document.getElementById('recipient-email');
    const emailList = document.getElementById('email-list');
    const emailValue = emailInput.value.trim();

    if (emailValue !== "" && !savedEmails.includes(emailValue)) {
        savedEmails.push(emailValue);

        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-item');

        const emailText = document.createElement('span');
        emailText.innerText = emailValue;

        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fas', 'fa-times');
        removeIcon.style.cursor = 'pointer';
        removeIcon.style.marginLeft = '150px';
        removeIcon.onclick = () => removeEmail(emailValue, listItem);

        listItem.appendChild(emailText);
        listItem.appendChild(removeIcon);
        emailList.appendChild(listItem);

        emailInput.value = ""; // Clear input field after saving
    } else {
        alert("Please enter a valid email address or it is already saved.");
    }
}

// Remove email from saved list
function removeEmail(email, listItem) {
    savedEmails = savedEmails.filter(savedEmail => savedEmail !== email);
    listItem.remove();
}

// Initialize the map and Google Sign-In when the page loads
window.onload = function() {
    // Initialize Google Maps
    initMap();

    // Initialize Google Sign-In
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '998791790071-fokl9jqimkm72imood2og6rvcbuqt5cr.apps.googleusercontent.com'
        });
    });
};
