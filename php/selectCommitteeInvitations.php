<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the instructor_id from the POST request
    $instructor_id = $_POST['instructor_id'] ?? null;

    // Validate the input
    if (!$instructor_id) {
        echo json_encode([
            "status" => "error",
            "message" => "Λείπει το αναγνωριστικό του επιβλέποντα."
        ]);
        exit;
    }

    // Prepare the SQL query to select everything from committee_invitations and additional details
    $query = "
        SELECT 
            ci.*, 
            t.title AS thesis_title, 
            t.description AS thesis_description, 
            t.status AS thesis_status,
            t.final_grade AS thesis_final_grade,
            i.instructor_id, 
            CONCAT(i.name, ' ', i.surname) AS instructor_name,
            s.student_id, 
            CONCAT(s.name, ' ', s.surname) AS student_name
        FROM 
            committee_invitations ci
        LEFT JOIN 
            thesis t ON ci.thesis_id = t.thesis_id
        LEFT JOIN 
            instructor i ON t.instructor_id = i.instructor_id
        LEFT JOIN 
            student s ON t.assigned_student = s.student_id
        WHERE 
            ci.instructor_id = ? AND ci.status = 'Εκκρεμής'";

    $stmt = mysqli_prepare($base, $query);

    if ($stmt) {
        // Bind the parameters to the query
        mysqli_stmt_bind_param($stmt, "i", $instructor_id);

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            // Fetch the results
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $data = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $data[] = [
                        "invitation_id" => $row['invitation_id'],
                        "thesis_id" => $row['thesis_id'],
                        "title" => $row['thesis_title'],
                        "created_at" => $row['created_at'],
                        "description" => $row['thesis_description'],
                        "assigned_student" => $row['student_name'],
                        "instructor" => [
                            "instructor_id" => $row['instructor_id'],
                            "instructor_name" => $row['instructor_name'],
                        ],
                    ];
                }
                echo json_encode([
                    "total" => count($data),
                    "rows" => $data
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Δεν βρέθηκαν αποτελέσματα."
                ]);
            }
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Απέτυχε η εκτέλεση του ερωτήματος: " . mysqli_error($base)
            ]);
        }

        // Close the statement
        mysqli_stmt_close($stmt);
    } else {
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
