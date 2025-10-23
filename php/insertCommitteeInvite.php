<?php
// Include the database connection file
include 'dbConnect.php';

// Set the response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve parameters from the POST request
    $thesis_id = $_POST['thesis_id'] ?? null;
    $committee_member_id = $_POST['committee_member_id'] ?? null;

    // Validate input
    if (!$thesis_id || !$committee_member_id) {
        echo json_encode([
            "status" => "error",
            "message" => "Το thesis_id και το committee_member_id είναι υποχρεωτικά."
        ]);
        exit;
    }

    // Prepare the SQL query to insert the committee invitation
    $query = "
        INSERT INTO committee_invitations (thesis_id, instructor_id, status, created_at)
        VALUES (?, ?, 'Εκκρεμής', NOW())
    ";

    // Prepare the statement
    $stmt = mysqli_prepare($base, $query);
    if (!$stmt) {
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η προετοιμασία του ερωτήματος: " . mysqli_error($base)
        ]);
        exit;
    }

    // Bind parameters
    mysqli_stmt_bind_param($stmt, 'ii', $thesis_id, $committee_member_id);

    // Execute the query
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "success",
            "message" => "Η πρόσκληση επιτροπής δημιουργήθηκε επιτυχώς."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η δημιουργία της πρόσκλησης επιτροπής: " . mysqli_stmt_error($stmt)
        ]);
    }

    // Close the statement and the database connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος. Χρησιμοποιήστε POST."
    ]);
}
