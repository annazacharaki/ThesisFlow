<?php
// Include the database connection file
include 'dbConnect.php';

// Set the response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Prepare the SQL query to select all instructors
    $query = "SELECT * FROM instructor";

    // Execute the query
    $result = mysqli_query($base, $query);

    if ($result) {
        $instructors = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $instructors[] = [
                "id" => $row['instructor_id'],
                "text" => $row['name'] . " " . $row['surname'],

            ];
        }

        // Return the instructors as JSON
        echo json_encode($instructors);
    } else {
        // Handle query execution error
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η εκτέλεση του ερωτήματος: " . mysqli_error($base)
        ]);
    }

    // Close the database connection
    mysqli_close($base);
} catch (Exception $e) {
    // Handle unexpected errors
    echo json_encode([
        "status" => "error",
        "message" => "Σφάλμα κατά την εκτέλεση: " . $e->getMessage()
    ]);
}
