<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the thesis_id from the POST data
    $thesis_id = $_POST['thesis_id'];

    // Prepare the SQL query to delete entries from committee_invitations
    $query = "DELETE FROM committee_invitations WHERE thesis_id = ?";
    $stmt = mysqli_prepare($base, $query);

    // Bind the parameter to the query
    mysqli_stmt_bind_param($stmt, "i", $thesis_id);

    // Execute the query
    if (mysqli_stmt_execute($stmt)) {
        // Check the number of affected rows
        $affected_rows = mysqli_stmt_affected_rows($stmt);

        // Format the response
        $response = [
            "status" => "success",
            "message" => "Entries deleted successfully.",
            "deleted_count" => $affected_rows
        ];

        // Return the response in JSON format
        echo json_encode($response);
    } else {
        // Handle query execution error
        echo json_encode(["status" => "error", "message" => "Failed to delete entries: " . mysqli_error($base)]);
    }

    // Close the statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
