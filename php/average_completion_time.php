<?php
// Include the database connection file
include 'dbConnect.php';

// Set the response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
	// Get instructor_id from POST request
	$instructor_id = isset($_POST['instructor_id']) ? intval($_POST['instructor_id']) : 0;

	
    if ($instructor_id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid instructor ID"]);
        exit;
    }

    // Query to calculate average completion time for supervised theses
    $query_supervised = "SELECT t.thesis_id, 
                     (SELECT MIN(changed_at) FROM thesis_status_history WHERE thesis_id = t.thesis_id AND status_change = 'Ενεργή') AS start_date,
                     (SELECT MAX(changed_at) FROM thesis_status_history WHERE thesis_id = t.thesis_id AND status_change = 'Περατωμένη') AS completion_date
              FROM thesis t
              WHERE t.instructor_id = ?";
    
    $stmt_supervised = mysqli_prepare($base, $query_supervised);
    mysqli_stmt_bind_param($stmt_supervised, "i", $instructor_id);
    mysqli_stmt_execute($stmt_supervised);
    $result_supervised = mysqli_stmt_get_result($stmt_supervised);

    $total_days_supervised = 0;
    $thesis_count_supervised = 0;

    while ($row = mysqli_fetch_assoc($result_supervised)) {
        if ($row['start_date'] && $row['completion_date']) {
            $start_date = strtotime($row['start_date']);
            $completion_date = strtotime($row['completion_date']);
            
            if ($completion_date > $start_date) {
                $days = ($completion_date - $start_date) / (60 * 60 * 24);
                $total_days_supervised += $days;
                $thesis_count_supervised++;
            }
        }
    }
    mysqli_stmt_close($stmt_supervised);

    // Query to calculate average completion time for committee member theses
    $query_committee = "SELECT t.thesis_id, 
                     (SELECT MIN(changed_at) FROM thesis_status_history WHERE thesis_id = t.thesis_id AND status_change = 'Ενεργή') AS start_date,
                     (SELECT MAX(changed_at) FROM thesis_status_history WHERE thesis_id = t.thesis_id AND status_change = 'Περατωμένη') AS completion_date
              FROM thesis t
              WHERE t.committee_member_1 = ? OR t.committee_member_2 = ?";
    
    $stmt_committee = mysqli_prepare($base, $query_committee);
    mysqli_stmt_bind_param($stmt_committee, "ii", $instructor_id, $instructor_id);
    mysqli_stmt_execute($stmt_committee);
    $result_committee = mysqli_stmt_get_result($stmt_committee);

    $total_days_committee = 0;
    $thesis_count_committee = 0;

    while ($row = mysqli_fetch_assoc($result_committee)) {
        if ($row['start_date'] && $row['completion_date']) {
            $start_date = strtotime($row['start_date']);
            $completion_date = strtotime($row['completion_date']);
            
            if ($completion_date > $start_date) {
                $days = ($completion_date - $start_date) / (60 * 60 * 24);
                $total_days_committee += $days;
                $thesis_count_committee++;
            }
        }
    }
    mysqli_stmt_close($stmt_committee);
    
    $average_time_supervised = $thesis_count_supervised > 0 ? round($total_days_supervised / $thesis_count_supervised, 2) : 0;
    $average_time_committee = $thesis_count_committee > 0 ? round($total_days_committee / $thesis_count_committee, 2) : 0;

    // Return the results in JSON format
    echo json_encode([
        "status" => "success",
        "avg_supervised_time" => $average_time_supervised,
        "thesis_count_supervised" => $thesis_count_supervised,
        "avg_committee_time" => $average_time_committee,
        "thesis_count_committee" => $thesis_count_committee
    ]);

    // Close the database connection
    mysqli_close($base);
} catch (Exception $e) {
    // Handle unexpected errors
    echo json_encode([
        "status" => "error",
        "message" => "Σφάλμα κατά την εκτέλεση: " . $e->getMessage()
    ]);
}

