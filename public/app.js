let userLocation = "";  // Global variable to hold user's location

// Initializing the map and get the user's location
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                userLocation = `Latitude: ${latitude}, Longitude: ${longitude}`;  // Sets user location

                // Alert with user location
                alert(`This is an emergency alert! Your location is: ${userLocation}`);

                // Initializes the map
                const map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: latitude, lng: longitude },
                    zoom: 14
                });

                new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map
                });
            },
            (error) => {
                console.error('Error retrieving location:', error);
                alert("Error getting location: " + error.message);
                userLocation = "Location could not be retrieved";  // Sets userLocation as error
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
        userLocation = "Location not available";  // Sets userLocation as unavailable
    }
}

// Sends alert to emergency contact with the user's location
async function sendAlert() {
    const phoneNumber = document.getElementById('emergency-contact').value;

    if (!phoneNumber || userLocation === "Location could not be retrieved" || userLocation === "Location not available") {
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

// Initializes the map when the page loads
window.onload = initMap;
