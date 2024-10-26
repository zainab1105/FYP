let userLocation = "";
let savedEmails = []; // Array to hold saved emails

// ... Other existing functions remain unchanged

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

        // Add Font Awesome cross icon for removal
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

async function sendAlert() {
    const email = savedEmails.length > 0 ? savedEmails[savedEmails.length - 1] : ""; // Get the last saved email

    if (!email || !userLocation) {
        alert("Please enter a valid contact number and ensure location is loaded.");
        return;
    }

    try {
        const response = await fetch('/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, location: userLocation }) // Send email and location
        });

        const data = await response.json();
        if (response.ok) {
            alert("Emergency alert sent successfully!");
        } else {
            alert("Failed to send alert: " + data.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}
