<?php
// Συμπερίληψη του αρχείου σύνδεσης με τη βάση δεδομένων
include 'dbConnect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Λήψη του thesis_id και του GA_number από τα δεδομένα POST
    $thesis_id = $_POST['thesis_id'];
    $GA_number = $_POST['GA_number'];

    // Προετοιμασία του SQL ερωτήματος για την ενημέρωση του GA_number για το συγκεκριμένο thesis_id
    $query = "UPDATE thesis SET GA_number = ? WHERE thesis_id = ?";
    $stmt = mysqli_prepare($base, $query);

    if ($stmt) {
        // Δέσμευση των παραμέτρων στο ερώτημα
        mysqli_stmt_bind_param($stmt, 'ii', $GA_number, $thesis_id);

        // Εκτέλεση του ερωτήματος
        if (mysqli_stmt_execute($stmt)) {
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                echo json_encode(["status" => "success", "message" => "Ο αριθμός συνέλεθσης ενημερώθηκε με επιτυχία."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Δεν ενημερώθηκαν εγγραφές. Ελέγξτε αν υπάρχει το thesis_id."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Αποτυχία ενημέρωσης του αριθμού συνέλεθσης: " . mysqli_error($base)]);
        }

        // Κλείσιμο της δήλωσης
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Αποτυχία προετοιμασίας του ερωτήματος: " . mysqli_error($base)]);
    }

    // Κλείσιμο της σύνδεσης με τη βάση δεδομένων
    mysqli_close($base);
} else {
    echo json_encode(["status" => "error", "message" => "Μη έγκυρη μέθοδος αιτήματος. Επιτρέπεται μόνο η POST."]);
}
?>
