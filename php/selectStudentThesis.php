<?php
// Include the database connection file
include 'dbConnect.php';

// Set the response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the student_id from the POST data
    $student_id = $_POST['student_id'];
    // $student_id = 30;

    if (!$student_id) {
        echo json_encode([
            "status" => "error",
            "message" => "Το student_id είναι υποχρεωτικό."
        ]);
        exit;
    }

    // Prepare the SQL query
    $query = "
        SELECT 
            t.*,
            s.student_id,
            CONCAT(s.name, ' ', s.surname) AS student_name,
            i.instructor_id AS instructor_id,
            i.name AS instructor_name,
            i.surname AS instructor_surname,
            i.email AS instructor_email,
            i.topic AS instructor_topic,
            i.landline AS instructor_landline,
            i.mobile AS instructor_mobile,
            i.department AS instructor_department,
            i.university AS instructor_university,
            cm1.instructor_id AS committee_member_1_id,
            cm1.name AS committee_member_1_name,
            cm1.surname AS committee_member_1_surname,
            cm1.email AS committee_member_1_email,
            cm1.topic AS committee_member_1_topic,
            cm1.landline AS committee_member_1_landline,
            cm1.mobile AS committee_member_1_mobile,
            cm1.department AS committee_member_1_department,
            cm1.university AS committee_member_1_university,
            cm2.instructor_id AS committee_member_2_id,
            cm2.name AS committee_member_2_name,
            cm2.surname AS committee_member_2_surname,
            cm2.email AS committee_member_2_email,
            cm2.topic AS committee_member_2_topic,
            cm2.landline AS committee_member_2_landline,
            cm2.mobile AS committee_member_2_mobile,
            cm2.department AS committee_member_2_department,
            cm2.university AS committee_member_2_university,
            h.changed_at
        FROM 
            thesis t
        LEFT JOIN 
            student s ON t.assigned_student = s.student_id
        LEFT JOIN 
            instructor i ON t.instructor_id = i.instructor_id
        LEFT JOIN 
            instructor cm1 ON t.committee_member_1 = cm1.instructor_id
        LEFT JOIN 
            instructor cm2 ON t.committee_member_2 = cm2.instructor_id
        LEFT JOIN 
            thesis_status_history h ON t.thesis_id = h.thesis_id AND h.status_change IN ('Ενεργή')
        WHERE 
            t.assigned_student = ?
    ";

    // Prepare the statement
    $stmt = mysqli_prepare($base, $query);
    if (!$stmt) {
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η προετοιμασία του ερωτήματος: " . mysqli_error($base)
        ]);
        exit;
    }

    // Bind the student_id parameter
    mysqli_stmt_bind_param($stmt, 'i', $student_id);

    // Execute the query
    mysqli_stmt_execute($stmt);

    // Get the result
    $result = mysqli_stmt_get_result($stmt);

    if ($result) {
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                "thesis_id" => $row['thesis_id'],
                "thesis_title" => $row['title'],
                "thesis_description" => $row['description'],
                "topic_presentation_file_name" => $row['topic_presentation_file_name'],
                "topic_presentation_file_path" => $row['topic_presentation_file_path'],
                "draft_thesis_file_name" => $row['draft_thesis_file_name'],
                "draft_thesis_file_path" => $row['draft_thesis_file_path'],
                "examination_report_file_name" => $row['examination_report_file_name'],
                "examination_report_file_path" => $row['examination_report_file_path'],
                "assigned_student" => [
                    "student_id" => $row['student_id'],
                    "student_name" => $row['student_name']
                ],
                "instructor" => [
                    "instructor_id" => $row['instructor_id'],
                    "name" => $row['instructor_name'],
                    "surname" => $row['instructor_surname'],
                    "email" => $row['instructor_email'],
                    "topic" => $row['instructor_topic'],
                    "landline" => $row['instructor_landline'],
                    "mobile" => $row['instructor_mobile'],
                    "department" => $row['instructor_department'],
                    "university" => $row['instructor_university']
                ],
                "committee_member_1" => [
                    "id" => $row['committee_member_1_id'],
                    "name" => $row['committee_member_1_name'],
                    "surname" => $row['committee_member_1_surname'],
                    "email" => $row['committee_member_1_email'],
                    "topic" => $row['committee_member_1_topic'],
                    "landline" => $row['committee_member_1_landline'],
                    "mobile" => $row['committee_member_1_mobile'],
                    "department" => $row['committee_member_1_department'],
                    "university" => $row['committee_member_1_university']
                ],
                "committee_member_2" => [
                    "id" => $row['committee_member_2_id'],
                    "name" => $row['committee_member_2_name'],
                    "surname" => $row['committee_member_2_surname'],
                    "email" => $row['committee_member_2_email'],
                    "topic" => $row['committee_member_2_topic'],
                    "landline" => $row['committee_member_2_landline'],
                    "mobile" => $row['committee_member_2_mobile'],
                    "department" => $row['committee_member_2_department'],
                    "university" => $row['committee_member_2_university']
                ],
                "status" => $row['status'],
                "final_grade" => $row['final_grade'],
                "instructor_grade" => $row['instructor_grade'],
                "committee_member_1_grade" => $row['committee_member_1_grade'],
                "committee_member_2_grade" => $row['committee_member_2_grade'],
                "nemertis_link" => $row['nemertis_link'],
                "changed_at" => $row['changed_at']
            ];
        }

        echo json_encode([
            "status" => "success",
            "data" => $data
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Απέτυχε η εκτέλεση του ερωτήματος: " . mysqli_error($base)
        ]);
    }

    // Close the statement and the database connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}