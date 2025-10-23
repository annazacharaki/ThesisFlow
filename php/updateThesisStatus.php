<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the thesis_id from the POST data
    $thesis_id = $_POST['thesis_id'];
    $status = $_POST['status'];

    // Prepare the SQL query to update the thesis status
    $query = "UPDATE thesis SET status = ? WHERE thesis_id = ?";
    $stmt = mysqli_prepare($base, $query);

    // Bind the parameter to the query
    mysqli_stmt_bind_param($stmt, "si", $status, $thesis_id);

    // Execute the query
    if (mysqli_stmt_execute($stmt)) {
        // Check if any rows were affected
        if (mysqli_stmt_affected_rows($stmt) > 0) {
            $response = [
                "status" => "success",
                "message" => "Η κατάσταση της διπλωματικής εργασίας ενημερώθηκε σε Υπό Εξέταση."
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "Δεν πραγματοποιήθηκε καμία αλλαγή. Ο κωδικός της διπλωματικής μπορεί να μην υπάρχει ή να έχει ήδη αυτή την κατάσταση."
            ];
        }
        echo json_encode($response);
    } else {
        // Handle query execution error
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η ενημέρωση της κατάστασης της διπλωματικής: " . mysqli_error($base)
        ]);
    }

    // Close the statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος."
    ]);
}
