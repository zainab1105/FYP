<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wofety_fy"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userUsername = $_POST['username'];
    $userPassword = $_POST['password'];

    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $userUsername); // "s" denotes string type

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($userPassword, $row['password'])) {
            // Redirect to alert page
            header("Location: alert.html");
            exit();
        } else {
            echo "Invalid password. Please try again.";
        }
    } else {
        echo "No user found with that username. Please register first.";
    }
    

    $stmt->close();
    $conn->close();
}
?>
