let userLocation = "";

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
              alert(`This is an emergency alert! Your location is: ${location}`);
            },
            (error) => {
              console.error('Error retrieving location:', error);
            }
          );          

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
