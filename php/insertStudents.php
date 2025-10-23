<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "dbConnect.php";

// Set content type to JSON
header('Content-Type: application/json');

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

// Prepare insert statements for students and personnel
$student_stmt = $base->prepare(
    "INSERT INTO student (student_id, name, surname, student_number, street, number, city, postcode, father_name, landline_telephone, mobile_telephone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$student_stmt->bind_param("isssssssssss", $student_id, $name, $surname, $student_number, $street, $number, $city, $postcode, $father_name, $landline_telephone, $mobile_telephone, $email);

$personnel_stmt = $base->prepare(
    "INSERT INTO personnel (username, password, role, student_id) VALUES (?, ?, 'Student', ?)"
);
$personnel_stmt->bind_param("ssi", $username, $password, $student_id);

// Loop through each student entry and insert into both tables
foreach ($data as $student) {
    if (!isset($student['id'], $student['name'], $student['surname'], $student['student_number'])) {
        echo json_encode(["status" => "error", "message" => "Missing required student fields"]);
        exit;
    }

    // Set variables for student table
    $student_id = intval($student['id']);
    $name = $student['name'];
    $surname = $student['surname'];
    $student_number = $student['student_number'];
    $street = $student['street'];
    $number = $student['number'];
    $city = $student['city'];
    $postcode = $student['postcode'];
    $father_name = $student['father_name'];
    $landline_telephone = $student['landline_telephone'];
    $mobile_telephone = $student['mobile_telephone'];
    $email = $student['email'];

    // Execute student insert
    if (!$student_stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to insert student: " . $base->error]);
        exit;
    }

    // Set variables for personnel table
    $username = $student_number; // Username is student number
    $password = "default_password"; // Securely hash the default password

    // Execute personnel insert
    if (!$personnel_stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to insert personnel: " . $base->error]);
        exit;
    }
}

// Close statements and connection
$student_stmt->close();
$personnel_stmt->close();
$base->close();

// Return success response
echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
