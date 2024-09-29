async function sendAlert() {
    const recipientEmail = document.getElementById('recipient-email').value;
    const responseMessage = document.getElementById('response-message');

    if (!recipientEmail || !userLocation) {
        alert("Please fill out all fields and ensure location is loaded.");
        return;
    }

    const sendAlertButton = document.getElementById('send-alert-btn');
    sendAlertButton.disabled = true;
    responseMessage.innerText = "Sending alert...";
    responseMessage.className = ""; // Reset class name

    try {
        const response = await fetch('/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientEmail, location: userLocation })
        });

        if (!response.ok) {
            const errorData = await response.json();
            responseMessage.innerText = "Failed to send alert: " + (errorData.error || "Unknown error");
            responseMessage.className = ""; // Reset to default
        } else {
            const data = await response.json();
            responseMessage.innerText = "🎉 Email alert sent successfully! 🎉 Message ID: " + data.messageId;
            responseMessage.className = "success-message"; // Add success class
        }
    } catch (error) {
        responseMessage.innerText = "Error: " + error.message;
        responseMessage.className = ""; // Reset to default
    } finally {
        sendAlertButton.disabled = false;
    }
}
    