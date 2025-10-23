<?php
// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the instructor_id from the POST data
    $instructor_id = $_POST['instructor_id'];

    // Prepare the SQL query with additional JOINs for Instructor, Student, and Committee Invitation tables
    $query = "
        SELECT 
            t.thesis_id, 
            t.title, 
            t.description, 
            t.assigned_student,
            t.instructor_id,
            ti.name AS instructor_name,
            ti.surname AS instructor_surname,
            ts.name AS student_name,
            ts.surname AS student_surname,
            ci.invitation_id AS committee_invitation_id,
            ci.instructor_id AS committee_instructor_id,
            ci.status AS committee_status,
            ci.created_at AS invitation_created_at,
            ci.updated_at AS invitation_updated_at,
            ci_i.name AS committee_instructor_name,
            ci_i.surname AS committee_instructor_surname
        FROM 
            thesis t
        LEFT JOIN 
            instructor ti 
        ON 
            t.instructor_id = ti.instructor_id
        LEFT JOIN 
            student ts 
        ON 
            t.assigned_student = ts.student_id
        LEFT JOIN 
            committee_invitations ci 
        ON 
            t.thesis_id = ci.thesis_id
        LEFT JOIN 
            instructor ci_i 
        ON 
            ci.instructor_id = ci_i.instructor_id
        WHERE 
            t.instructor_id = ? AND t.status = 'Υπό Ανάθεση'";

    $stmt = mysqli_prepare($base, $query);

    // Bind the parameter to the query
    mysqli_stmt_bind_param($stmt, "i", $instructor_id);

    // Execute the query
    if (mysqli_stmt_execute($stmt)) {
        // Get the result
        $result = mysqli_stmt_get_result($stmt);

        // Organize the data
        $theses = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $thesis_id = $row['thesis_id'];

            // Check if this thesis already exists in the array
            if (!isset($theses[$thesis_id])) {
                $theses[$thesis_id] = [
                    "thesis_id" => $row['thesis_id'],
                    "title" => $row['title'],
                    "description" => $row['description'],
                    "assigned_student" => $row['assigned_student'],
                    "student_name" => $row['student_name'] ? $row['student_name'] . " " . $row['student_surname'] : null,
                    "instructor_name" => $row['instructor_name'] . " " . $row['instructor_surname'],
                    "committee_invitations" => []
                ];
            }

            // Add committee invitation to the nested array if it exists
            if ($row['committee_invitation_id'] !== null) {
                $theses[$thesis_id]['committee_invitations'][] = [
                    "invitation_id" => $row['committee_invitation_id'],
                    "instructor_id" => $row['committee_instructor_id'],
                    "instructor_name" => $row['committee_instructor_name'] . " " . $row['committee_instructor_surname'],
                    "status" => $row['committee_status'],
                    "created_at" => $row['invitation_created_at'],
                    "updated_at" => $row['invitation_updated_at']
                ];
            }
        }

        // Reindex the array to remove keys
        $theses = array_values($theses);

        // Format the response
        $response = [
            "total" => count($theses),
            "rows" => $theses
        ];

        // Return the response in JSON format
        echo json_encode($response);
    } else {
        // Handle query execution error
        echo json_encode(["status" => "error", "message" => "Failed to retrieve data: " . mysqli_error($base)]);
    }

    // Close the statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
