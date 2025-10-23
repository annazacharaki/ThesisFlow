<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the thesis_id from the POST request
    $thesis_id = $_POST['thesis_id'] ?? null;
    $number = $_POST['number'] ?? null;
    $year = $_POST['year'] ?? null;

    // Validate the input
    if (!$thesis_id) {
        echo json_encode([
            "status" => "error",
            "message" => "Λείπει το αναγνωριστικό της διπλωματικής εργασίας."
        ]);
        exit;
    }

    // Prepare the SQL query to update the thesis status
    $query = "UPDATE thesis SET status = 'Ακυρωμένη', GA_number = ?, GA_year = ? WHERE thesis_id = ?";
    $stmt = mysqli_prepare($base, $query);

    if ($stmt) {
        // Bind the parameters to the query
        mysqli_stmt_bind_param($stmt, "iii", $number, $year, $thesis_id);

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            // Check if any rows were affected
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                $response = [
                    "status" => "success",
                    "message" => "Η διπλωματική εργασία ακυρώθηκε με επιτυχία."
                ];
            } else {
                $response = [
                    "status" => "error",
                    "message" => "Δεν πραγματοποιήθηκε καμία αλλαγή. Ο κωδικός της διπλωματικής μπορεί να μην υπάρχει ή να έχει ήδη ακυρωθεί."
                ];
            }
        } else {
            // Handle query execution error
            $response = [
                "status" => "error",
                "message" => "Απέτυχε η ακύρωση της διπλωματικής: " . mysqli_error($base)
            ];
        }

        // Close the statement
        mysqli_stmt_close($stmt);
    } else {
        // Handle statement preparation error
        $response = [
            "status" => "error",
            "message" => "Απέτυχε η προετοιμασία της δήλωσης SQL: " . mysqli_error($base)
        ];
    }

    // Return the response as JSON
    echo json_encode($response);

    // Close the database connection
    mysqli_close($base);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος."
    ]);
}
