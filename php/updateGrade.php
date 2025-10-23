<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from the POST request
    $thesis_id = $_POST['thesis_id'];
    $grade = $_POST['grade'];
    $role = $_POST['role'];

    // Validate inputs
    if (!$thesis_id || !$grade || !$role) {
        echo json_encode([
            "status" => "error",
            "message" => "Λείπουν απαιτούμενες παράμετροι."
        ]);
        exit;
    }

    if ($grade < 1 || $grade > 10) {
        echo json_encode([
            "status" => "error",
            "message" => "Η βαθμολογία πρέπει να είναι από 1 έως 10."
        ]);
        exit;
    }

    // Map role to the corresponding column
    $column = null;
    if ($role === "Επιβλέπων") {
        $column = "instructor_grade";
    } elseif ($role === "Μέλος Επιτροπής 1") {
        $column = "committee_member_1_grade";
    } elseif ($role === "Μέλος Επιτροπής 2") {
        $column = "committee_member_2_grade";
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Ο ρόλος δεν είναι έγκυρος."
        ]);
        exit;
    }

    // Prepare the SQL query to update the grade
    $query = "UPDATE thesis SET $column = ? WHERE thesis_id = ?";
    $stmt = mysqli_prepare($base, $query);

    if ($stmt) {
        // Bind the parameters to the query
        mysqli_stmt_bind_param($stmt, "di", $grade, $thesis_id);

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            // Check if any rows were affected
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                mysqli_stmt_close($stmt); // Close the previous statement before executing a new one

                // Retrieve the three grades to check if they are all set
                $checkQuery = "SELECT instructor_grade, committee_member_1_grade, committee_member_2_grade FROM thesis WHERE thesis_id = ?";
                $checkStmt = mysqli_prepare($base, $checkQuery);

                if ($checkStmt) {
                    mysqli_stmt_bind_param($checkStmt, "i", $thesis_id);
                    mysqli_stmt_execute($checkStmt);
                    mysqli_stmt_bind_result($checkStmt, $instructor_grade, $committee_member_1_grade, $committee_member_2_grade);
                    mysqli_stmt_fetch($checkStmt);

                    // Ensure no pending results before proceeding
                    mysqli_stmt_free_result($checkStmt);
                    mysqli_stmt_close($checkStmt);

                    // Check if all grades are set (not NULL)
                    if (!is_null($instructor_grade) && !is_null($committee_member_1_grade) && !is_null($committee_member_2_grade)) {
                        // Calculate the average grade
                        $average_grade = ($instructor_grade + $committee_member_1_grade + $committee_member_2_grade) / 3;

                        // Update the final_grade and status
                        $finalQuery = "UPDATE thesis SET final_grade = ? WHERE thesis_id = ?";
                        $finalStmt = mysqli_prepare($base, $finalQuery);

                        if ($finalStmt) {
                            mysqli_stmt_bind_param($finalStmt, "di", $average_grade, $thesis_id);
                            mysqli_stmt_execute($finalStmt);
                        }
                    }
                }

                $response = [
                    "status" => "success",
                    "message" => "Η βαθμολογία ενημερώθηκε με επιτυχία."
                ];
            } else {
                $response = [
                    "status" => "error",
                    "message" => "Δεν πραγματοποιήθηκε καμία αλλαγή. Ο κωδικός της διπλωματικής μπορεί να μην υπάρχει ή η βαθμολογία να είναι ήδη η ίδια."
                ];
            }
            echo json_encode($response);
        } else {
            // Handle query execution error
            echo json_encode([
                "status" => "error",
                "message" => "Απέτυχε η ενημέρωση της βαθμολογίας: " . mysqli_error($base)
            ]);
        }
    } else {
        // Handle statement preparation error
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η προετοιμασία της δήλωσης SQL: " . mysqli_error($base)
        ]);
    }

    // Close the database connection
    mysqli_close($base);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος."
    ]);
}
