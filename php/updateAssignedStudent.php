<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the thesis_id and student_id from POST data
    $thesis_id = $_POST['thesis_id'];
    $student_id = $_POST['student_id'];

    if ($student_id == '') {
        // Set assigned_student to NULL
        $query = "UPDATE thesis SET assigned_student = NULL WHERE thesis_id = ?";
        $stmt = mysqli_prepare($base, $query);
        mysqli_stmt_bind_param($stmt, "i", $thesis_id);
    } else {
        // Assign student_id
        $query = "UPDATE thesis SET assigned_student = ? WHERE thesis_id = ?";
        $stmt = mysqli_prepare($base, $query);
        mysqli_stmt_bind_param($stmt, "ii", $student_id, $thesis_id);
    }

    // Execute the query
    try {
        mysqli_stmt_execute($stmt);

        // Check if any rows were affected
        if (mysqli_stmt_affected_rows($stmt) > 0) {
            echo json_encode(["status" => "success", "message" => "Thesis updated successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "No matching thesis found or no changes made."]);
        }
    } catch (mysqli_sql_exception $e) {
        // Handle duplicate entry error
        if ($e->getCode() === 1062) { // 1062 is the error code for duplicate entry
            echo json_encode([
                "status" => "error",
                "message" => "The student is already assigned to another thesis. Please choose a different student."
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
    }

    // Close the statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
