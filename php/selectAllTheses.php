<?php
// Include the database connection file to establish a connection with the database
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the instructor_id from the POST data
    $instructor_id = $_POST['instructor_id'];

    // If no instructor ID is provided, return an error response and exit
    if ($instructor_id === null) {
        echo json_encode(["status" => "error", "message" => "No ID provided."]);
        exit;
    }

    // Prepare the SQL query to fetch thesis details and related information
    $query = "
        SELECT
            t.*,                                 -- Thesis
            CONCAT(s.name, ' ', s.surname) AS assigned_student_name, -- Full name of the student assigned to the thesis
            CONCAT(ins1.name, ' ', ins1.surname) AS instructor_name, -- Full name of the primary instructor
            ins1.instructor_id AS instructor_id,         -- ID of the primary instructor
            t.committee_member_1 AS committee_member_1_id, -- ID of the first committee member
            CONCAT(ins2.name, ' ', ins2.surname) AS committee_member_1_name, -- Full name of the first committee member
            t.committee_member_2 AS committee_member_2_id, -- ID of the second committee member
            CONCAT(ins3.name, ' ', ins3.surname) AS committee_member_2_name, -- Full name of the second committee member
            tsh.status_change,                          -- Status change event description
            tsh.changed_at,                             -- Timestamp of the status change
            CASE
                WHEN t.instructor_id = ? THEN 'Επιβλέπων' -- Role: Supervisor (Primary Instructor)
                WHEN t.committee_member_1 = ? THEN 'Μέλος Επιτροπής 1' -- Role: First Committee Member
                WHEN t.committee_member_2 = ? THEN 'Μέλος Επιτροπής 2' -- Role: Second Committee Member
            END AS role                                  -- Determine the role based on the matching ID
        FROM
            thesis t                                    -- Main table containing thesis data
        LEFT JOIN
            thesis_status_history tsh                  -- Join with thesis status history for status changes
        ON
            t.thesis_id = tsh.thesis_id                -- Match thesis ID between thesis and status history tables
        LEFT JOIN
            instructor ins1                            -- Join with instructor table for primary instructor details
        ON
            t.instructor_id = ins1.instructor_id       -- Match the instructor ID for primary instructor details
        LEFT JOIN
            instructor ins2                            -- Join with instructor table for first committee member details
        ON
            t.committee_member_1 = ins2.instructor_id  -- Match the ID for the first committee member details
        LEFT JOIN
            instructor ins3                            -- Join with instructor table for second committee member details
        ON
            t.committee_member_2 = ins3.instructor_id  -- Match the ID for the second committee member details
        LEFT JOIN
            student s                                  -- Join with student table to get student details
        ON
            t.assigned_student = s.student_id          -- Match the student ID for the assigned student details
        WHERE
            t.instructor_id = ? OR                     -- Filter by the primary instructor
            t.committee_member_1 = ? OR                -- Filter by the first committee member
            t.committee_member_2 = ?                   -- Filter by the second committee member
        ORDER BY t.thesis_id, tsh.changed_at;          -- Order by thesis ID and status change timestamp
    ";

    // Prepare the SQL statement to prevent SQL injection attacks
    $stmt = mysqli_prepare($base, $query);
    mysqli_stmt_bind_param($stmt, 'iiiiii', $instructor_id, $instructor_id, $instructor_id, $instructor_id, $instructor_id, $instructor_id);

    // Execute the prepared statement to retrieve data
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result) {
        // Initialize an associative array to hold the theses data
        $theses = [];
        $thesis_ids = []; // Array to track processed thesis IDs for fetching notes later

        // Loop through the result set and process each row of data
        while ($row = mysqli_fetch_assoc($result)) {
            $thesisId = $row['thesis_id'];

            // If the thesis ID is not already in the array, initialize its structure
            if (!isset($theses[$thesisId])) {
                $theses[$thesisId] = [
                    "thesis_id" => $row['thesis_id'],        // Thesis ID
                    "title" => $row['title'],               // Thesis title
                    "description" => $row['description'],   // Thesis description
                    "assigned_student" => $row['assigned_student_name'], // Full name of assigned student
                    "status" => $row['status'],             // Current thesis status
                    "final_grade" => $row['final_grade'],   // Final grade of the thesis
                    "draft_thesis_file_name" => $row['draft_thesis_file_name'],
                    "draft_thesis_file_path" => $row['draft_thesis_file_path'],
                    "material_links" => $row['material_links'],
                    "instructor" => [
                        "instructor_id" => $row['instructor_id'], // ID of the primary instructor
                        "instructor_name" => $row['instructor_name'], // Full name of the primary instructor
                        "instructor_grade" => $row['instructor_grade'], // Grade given by the primary instructor
                    ],
                    "committee_member_1" => [
                        "committee_member_1_id" => $row['committee_member_1_id'], // ID of the first committee member
                        "committee_member_1_name" => $row['committee_member_1_name'], // Full name of the first committee member
                        "grade" => $row['committee_member_1_grade'], // Grade given by the first committee member
                    ],
                    "committee_member_2" => [
                        "committee_member_2_id" => $row['committee_member_2_id'], // ID of the second committee member
                        "committee_member_2_name" => $row['committee_member_2_name'], // Full name of the second committee member
                        "grade" => $row['committee_member_2_grade'], // Grade given by the second committee member
                    ],
                    "role" => $row['role'],                 // Role of the instructor related to the thesis
                    "status_changes" => [],                 // Initialize an array to track status changes
                    "notes" => []                           // Initialize an array to hold notes for the thesis
                ];
                $thesis_ids[] = $thesisId; // Track the thesis ID for later use
            }

            // Add status change details to the thesis if they exist
            if ($row['status_change'] && $row['changed_at']) {
                $theses[$thesisId]['status_changes'][] = [
                    "status_change" => $row['status_change'], // Description of the status change
                    "changed_at" => $row['changed_at']       // Timestamp of the status change
                ];
            }
        }

        // Fetch notes associated with the retrieved theses
        if (!empty($thesis_ids)) {
            $notes_query = "
                SELECT
                    thesis_id,                          -- Thesis ID associated with the note
                    note_id,                            -- Unique ID of the note
                    note,                               -- Content of the note
                    date                                -- Creation date of the note
                FROM
                    notes                               -- Notes table
                WHERE
                    thesis_id IN (" . implode(',', array_fill(0, count($thesis_ids), '?')) . ") -- Filter by retrieved thesis IDs
                    AND instructor_id = ?               -- Ensure the notes belong to the given instructor
                ORDER BY date;                         -- Order the notes by their creation date
            ";

            // Prepare the statement for notes query
            $notes_stmt = mysqli_prepare($base, $notes_query);

            // Prepare the types string and parameters array for binding
            $types = str_repeat('i', count($thesis_ids)) . 'i'; // Dynamic type string for binding IDs
            $params = array_merge($thesis_ids, [$instructor_id]); // Merge thesis IDs and instructor ID into a single array

            // Create references for the parameters to be used in bind_param
            $params_ref = [];
            foreach ($params as $key => &$value) {
                $params_ref[$key] = &$value;
            }

            // Use call_user_func_array to bind parameters dynamically
            array_unshift($params_ref, $types); // Add the types string to the start of the parameter array
            call_user_func_array([$notes_stmt, 'bind_param'], $params_ref);

            // Execute the notes query
            mysqli_stmt_execute($notes_stmt);
            $notes_result = mysqli_stmt_get_result($notes_stmt);

            // Process notes and associate them with their respective theses
            if ($notes_result) {
                while ($note_row = mysqli_fetch_assoc($notes_result)) {
                    $thesisId = $note_row['thesis_id'];
                    $theses[$thesisId]['notes'][] = [
                        "note_id" => $note_row['note_id'], // Note ID
                        "note" => $note_row['note'],       // Note content
                        "date" => $note_row['date']       // Creation date of the note
                    ];
                }
            }
        }

        // Convert the associative array to a sequential array for the JSON response
        $rows = array_values($theses);

        // Prepare the final JSON response with total count and thesis data
        $response = [
            "total" => count($rows), // Total number of theses retrieved
            "rows" => $rows          // Array of thesis data
        ];

        // Return the JSON-encoded data as the response
        echo json_encode($response);
    } else {
        // Handle query execution errors by returning an error message
        echo json_encode([
            "status" => "error",
            "message" => "Failed to retrieve data: " . mysqli_error($base)
        ]);
    }

    // Close the database connection after processing
    mysqli_close($base);
} else {
    // Handle invalid request method by returning an error message
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
