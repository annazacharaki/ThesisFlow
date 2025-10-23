<?php
// Enable error logging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debug: Output log to file
error_log("insertNote.php script started");

// Include database connection
include 'dbConnect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $thesis_id = $_POST['thesis_id'] ?? null;
    $instructor_id = $_POST['instructor_id'] ?? null;
    $note = $_POST['note'] ?? null;

    // Debug: Check received data
    error_log("thesis_id: $thesis_id, instructor_id: $instructor_id, note: $note");

    if (!$thesis_id || !$instructor_id || !$note) {
        error_log("Missing parameters in POST request");
        echo json_encode([
            "status" => "error",
            "message" => "Όλα τα πεδία είναι υποχρεωτικά."
        ]);
        exit;
    }

    // Debug: Validate note length
    if (strlen($note) > 300) {
        error_log("Note exceeds 300 characters");
        echo json_encode([
            "status" => "error",
            "message" => "Το σχόλιο δεν μπορεί να υπερβαίνει τους 300 χαρακτήρες."
        ]);
        exit;
    }

    // Debug: Database query preparation
    $query = "INSERT INTO notes (thesis_id, instructor_id, note) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($base, $query);
    if (!$stmt) {
        error_log("Failed to prepare statement: " . mysqli_error($base));
        echo json_encode([
            "status" => "error",
            "message" => "Αποτυχία σύνδεσης με τη βάση δεδομένων."
        ]);
        exit;
    }

    // Debug: Bind parameters
    mysqli_stmt_bind_param($stmt, "iis", $thesis_id, $instructor_id, $note);

    // Execute the query
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "success",
            "message" => "Το σχόλιο προστέθηκε επιτυχώς."
        ]);
    } else {
        error_log("Failed to execute query: " . mysqli_error($base));
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η προσθήκη του σχολίου: " . mysqli_error($base)
        ]);
    }

    // Close the statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
    exit;
} else {
    error_log("Invalid request method");
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος."
    ]);
    exit;
}
