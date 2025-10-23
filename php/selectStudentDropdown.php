<?php
// Include the database connection file
include 'dbConnect.php';

// Set the response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Prepare the SQL query to fetch all students
$query = "SELECT student_id, name, surname, student_number FROM student";

// Execute the query
$result = mysqli_query($base, $query);

// Check if the query executed successfully
if ($result) {
    // Fetch the data
    $students = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = [
            "id" => $row['student_id'], // Add student_id to the response
            "text" => $row['name'] . " " . $row['surname'],
            "tokens" => $row['student_number']
        ];
    }

    // Return the JSON-encoded data
    echo json_encode($students);
} else {
    // Handle query execution error
    echo json_encode(["status" => "error", "message" => "Failed to retrieve data: " . mysqli_error($base)]);
}

// Close the database connection
mysqli_close($base);
