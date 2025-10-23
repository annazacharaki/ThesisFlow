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
    // Prepare the SQL query to select and group by thesis_id
    $query = "
        SELECT 
            thesis_id, 
            GROUP_CONCAT(status_change ORDER BY changed_at ASC) AS status_changes,
            GROUP_CONCAT(changed_at ORDER BY changed_at ASC) AS changed_at
        FROM 
            thesis_status_history
        WHERE 
            status_change IN ('Ενεργή', 'Περατωμένη')
        GROUP BY 
            thesis_id
    ";

    $result = mysqli_query($base, $query);

    if ($result) {
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $status_changes = explode(',', $row['status_changes']);
            $changed_at = explode(',', $row['changed_at']);

            $time_difference = null;
            $interval = null;
            if (count($changed_at) === 2) {
                $start_date = new DateTime($changed_at[0]);
                $end_date = new DateTime($changed_at[1]);
                $interval = $start_date->diff($end_date);
                $time_difference = $interval->days;
            }


            $data[] = [
                "thesis_id" => $row['thesis_id'],
                "time_difference" => $time_difference,
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

    // Close the database connection
    mysqli_close($base);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος."
    ]);
}
