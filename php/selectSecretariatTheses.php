<?php
// Include the database connection file
include 'dbConnect.php';

// Set the response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Combined query to fetch thesis details with aggregated status changes
    $query = "
        SELECT 
            t.thesis_id,
            t.title AS thesis_title,
            t.description AS thesis_description,
            t.status AS thesis_status,
            t.final_grade,
            t.GA_number,
            t.nemertis_link AS nemertis_link,
            -- Student details
            s.student_id,
            CONCAT(s.name, ' ', s.surname) AS student_name,
            s.email AS student_email,
            -- Instructor details
            i.instructor_id AS instructor_id,
            CONCAT(i.name, ' ', i.surname) AS instructor_name,
            i.email AS instructor_email,
            i.landline AS instructor_landline,
            i.mobile AS instructor_mobile,
            i.department AS instructor_department,
            i.university AS instructor_university,
            -- Committee Member 1 details
            cm1.instructor_id AS committee_member_1_id,
            CONCAT(cm1.name, ' ', cm1.surname) AS committee_member_1_name,
            cm1.email AS committee_member_1_email,
            cm1.landline AS committee_member_1_landline,
            cm1.mobile AS committee_member_1_mobile,
            cm1.department AS committee_member_1_department,
            cm1.university AS committee_member_1_university,
            -- Committee Member 2 details
            cm2.instructor_id AS committee_member_2_id,
            CONCAT(cm2.name, ' ', cm2.surname) AS committee_member_2_name,
            cm2.email AS committee_member_2_email,
            cm2.landline AS committee_member_2_landline,
            cm2.mobile AS committee_member_2_mobile,
            cm2.department AS committee_member_2_department,
            cm2.university AS committee_member_2_university,
            -- Status history aggregation
            GROUP_CONCAT(h.changed_at ORDER BY h.changed_at ASC SEPARATOR ', ') AS changed_at
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
            t.status IN ('Ενεργή', 'Υπό Εξέταση')
        GROUP BY 
            t.thesis_id
    ";

    // Execute the query
    $result = mysqli_query($base, $query);

    if (!$result) {
        throw new Exception("Απέτυχε η εκτέλεση του ερωτήματος: " . mysqli_error($base));
    }

    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = [
            "thesis_id" => $row['thesis_id'],
            "thesis_title" => $row['thesis_title'],
            "thesis_description" => $row['thesis_description'],
            "thesis_status" => $row['thesis_status'],
            "final_grade" => $row['final_grade'],
            "nemertis_link" => $row['nemertis_link'],
            "GA_number" => $row['GA_number'],
            "student" => $row['student_id'] ? [
                "student_id" => $row['student_id'],
                "name" => $row['student_name'],
                "email" => $row['student_email']
            ] : null,
            "instructor" => [
                "instructor_id" => $row['instructor_id'],
                "name" => $row['instructor_name'],
                "email" => $row['instructor_email'],
                "landline" => $row['instructor_landline'],
                "mobile" => $row['instructor_mobile'],
                "department" => $row['instructor_department'],
                "university" => $row['instructor_university']
            ],
            "committee_member_1" => [
                "id" => $row['committee_member_1_id'],
                "name" => $row['committee_member_1_name'],
                "email" => $row['committee_member_1_email'],
                "landline" => $row['committee_member_1_landline'],
                "mobile" => $row['committee_member_1_mobile'],
                "department" => $row['committee_member_1_department'],
                "university" => $row['committee_member_1_university']
            ],
            "committee_member_2" => [
                "id" => $row['committee_member_2_id'],
                "name" => $row['committee_member_2_name'],
                "email" => $row['committee_member_2_email'],
                "landline" => $row['committee_member_2_landline'],
                "mobile" => $row['committee_member_2_mobile'],
                "department" => $row['committee_member_2_department'],
                "university" => $row['committee_member_2_university']
            ],
            "changed_at" => $row['changed_at']
        ];
    }

    // Structure the output
    $output = [
        "total" => count($rows),
        "rows" => $rows
    ];

    // Return the JSON response
    echo json_encode($output, JSON_UNESCAPED_UNICODE);

    // Free the result set
    mysqli_free_result($result);
} catch (Exception $e) {
    // Return an error response
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    // Close the database connection
    mysqli_close($base);
}
