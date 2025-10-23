<?php
// Συμπερίληψη του αρχείου σύνδεσης με τη βάση δεδομένων
include 'dbConnect.php';

header('Content-Type: application/json; charset=utf-8');


// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Λήψη του instructor_id από το αίτημα
    // $instructor_id = $_POST['instructor_id'];
   // $instructor_id = 15;
   
   
  // Get instructor_id from POST request
	$instructor_id = isset($_POST['instructor_id']) ? intval($_POST['instructor_id']) : 0;

	
    if ($instructor_id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid instructor ID"]);
        exit;
    }

    // Ερώτημα για τον υπολογισμό του συνολικού αριθμού διπλωματικών που έχει επιβλέψει
    $supervised_query = "
        SELECT COUNT(*) AS total_supervised
        FROM thesis
        WHERE instructor_id = ?;
    ";
    $stmt1 = mysqli_prepare($base, $supervised_query);
    mysqli_stmt_bind_param($stmt1, "i", $instructor_id);
    mysqli_stmt_execute($stmt1);
    mysqli_stmt_bind_result($stmt1, $total_supervised);
    mysqli_stmt_fetch($stmt1);
    mysqli_stmt_close($stmt1);

    // Ερώτημα για τον υπολογισμό του συνολικού αριθμού διπλωματικών στις οποίες συμμετέχει ως μέλος επιτροπής
    $committee_query = "
        SELECT COUNT(*) AS total_committee
        FROM thesis
        WHERE (committee_member_1 = ? OR committee_member_2 = ?);
    ";
    $stmt2 = mysqli_prepare($base, $committee_query);
    mysqli_stmt_bind_param($stmt2, "ii", $instructor_id, $instructor_id);
    mysqli_stmt_execute($stmt2);
    mysqli_stmt_bind_result($stmt2, $total_committee);
    mysqli_stmt_fetch($stmt2);
    mysqli_stmt_close($stmt2);

    // Προετοιμασία της απάντησης
    $response = [
        "status" => "success",
        "total_supervised" => $total_supervised,
        "total_committee" => $total_committee
    ];

    // Επιστροφή της απάντησης ως JSON
    echo json_encode($response);

    // Κλείσιμο της σύνδεσης με τη βάση δεδομένων
    mysqli_close($base);
// } else {
//     echo json_encode(["status" => "error", "message" => "Μη έγκυρη μέθοδος αιτήματος. Επιτρέπεται μόνο η POST."]);
// }
