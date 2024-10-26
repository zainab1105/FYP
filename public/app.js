let userLocation = "";

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            userLocation = https://www.google.com/maps?q=${latitude},${longitude};

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
    const phoneNumber = document.getElementById('emergency-contact').value;

    if (!phoneNumber || !userLocation) {
        alert("Please enter a valid contact number and ensure location is loaded.");
        return;
    }

    try {
        const response = await fetch('/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, location: userLocation })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Emergency alert sent successfully!");
        } else {
            alert("Failed to send alert: " + data.error);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Initialize the map when the page loads
window.onload = initMap;