let userLocation = "";

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            userLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;

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

async function sendAlert() {
    const recipientEmail = document.getElementById('recipient-email').value;
    const responseMessage = document.getElementById('response-message');

    if (!recipientEmail || !userLocation) {
        alert("Please ensure a valid email is entered and location is loaded.");
        return;
    }

    const sendAlertButton = document.getElementById('send-alert-btn');
    sendAlertButton.disabled = true;
    responseMessage.innerText = "Sending alert...";

    try {
        const response = await fetch('/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientEmail, location: userLocation })
        });

        if (!response.ok) {
            const errorData = await response.json();
            responseMessage.innerText = "Failed to send alert: " + (errorData.error || "Unknown error");
        } else {
            const data = await response.json();
            responseMessage.innerText = "Email alert sent successfully! Message ID: " + data.messageId;
        }
    } catch (error) {
        responseMessage.innerText = "Error: " + error.message;
    } finally {
        sendAlertButton.disabled = false;
        document.getElementById('recipient-email').value = ""; // Clear input
    }
}

function handleSignIn(event) {
    event.preventDefault();
    // Implement sign-in logic here
}

function handleSignUp(event) {
    event.preventDefault();
    // Implement sign-up logic here
}
