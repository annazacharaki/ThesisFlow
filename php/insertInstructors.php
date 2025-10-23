<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "dbConnect.php";

// Set content type to JSON
header('Content-Type: application/json');

// Function to extract the username from an email address
function getUsernameFromEmail($email)
{
    // Check if the email is valid
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Split the email at the @ symbol
        $parts = explode('@', $email);
        // Return the part before the @ symbol
        return $parts[0];
    } else {
        return "Invalid email address.";
    }
}

// Get JSON input from POST request
$json = file_get_contents('php://input');

if ($json === false) {
    echo json_encode(["status" => "error", "message" => "Unable to read input"]);
    exit;
}

$data = json_decode($json, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

// Prepare insert statements for instructors and personnel
$instructor_stmt = $base->prepare(
    "INSERT INTO instructor (instructor_id, name, surname, email, topic, landline, mobile, department, university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$instructor_stmt->bind_param("issssssss", $instructor_id, $name, $surname, $email, $topic, $landline, $mobile, $department, $university);

$personnel_stmt = $base->prepare(
    "INSERT INTO personnel (username, password, role, instructor_id) VALUES (?, ?, 'Instructor', ?)"
);
$personnel_stmt->bind_param("ssi", $username, $password, $instructor_id);

// Loop through each instructor entry and insert into both tables
foreach ($data as $instructor) {
    if (!isset($instructor['id'], $instructor['name'], $instructor['surname'])) {
        echo json_encode(["status" => "error", "message" => "Missing required instructor fields"]);
        exit;
    }

    // Set variables for instructor table
    $instructor_id = intval($instructor['id']);
    $name = $instructor['name'];
    $surname = $instructor['surname'];
    $email = $instructor['email'];
    $topic = $instructor['topic'];
    $landline = $instructor['landline'];
    $mobile = $instructor['mobile'];
    $department = $instructor['department'];
    $university = $instructor['university'];

    // Execute instructor insert
    if (!$instructor_stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to insert instructor: " . $base->error]);
        exit;
    }

    // Set variables for personnel table
    $username = getUsernameFromEmail($email);
    $password = "default_password";

    // Execute personnel insert
    if (!$personnel_stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to insert personnel: " . $base->error]);
        exit;
    }
}

// Close statements and connection
$instructor_stmt->close();
$personnel_stmt->close();
$base->close();

// Return success response
echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
