<?php
// Συμπερίληψη του αρχείου σύνδεσης με τη βάση δεδομένων
include 'dbConnect.php';

// Έλεγχος αν το αίτημα είναι μέσω POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Λήψη των δεδομένων από το frontend
    $thesis_id = $_POST['thesis_id']; // ID της διπλωματικής εργασίας
    $column_name = $_POST['column_name']; // Όνομα της στήλης για τον σύνδεσμο
    $link = $_POST['link']; // Ο σύνδεσμος προς αποθήκευση

    // Επικύρωση ότι τα δεδομένα είναι διαθέσιμα
    if (empty($thesis_id) || empty($column_name) || empty($link)) {
        echo json_encode(["status" => "error", "message" => "Το thesis_id, το column_name και ο σύνδεσμος είναι απαραίτητα."]);
        exit;
    }

    // Προετοιμασία του SQL ερωτήματος για την ενημέρωση του συνδέσμου
    $query = "UPDATE thesis SET $column_name = ? WHERE thesis_id = ?";
    $stmt = mysqli_prepare($base, $query);

    if ($stmt) {
        // Δέσμευση των παραμέτρων στο ερώτημα
        mysqli_stmt_bind_param($stmt, "si", $link, $thesis_id);

        // Εκτέλεση του ερωτήματος
        if (mysqli_stmt_execute($stmt)) {
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                echo json_encode(["status" => "success", "message" => "Ο σύνδεσμος ενημερώθηκε με επιτυχία."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Δεν ενημερώθηκαν εγγραφές."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Αποτυχία ενημέρωσης του συνδέσμου: " . mysqli_error($base)]);
        }

        // Κλείσιμο της δήλωσης
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "message" => "Αποτυχία προετοιμασίας του ερωτήματος: " . mysqli_error($base)]);
    }

    // Κλείσιμο της σύνδεσης με τη βάση δεδομένων
    mysqli_close($base);
} else {
    // Επιστροφή μηνύματος σφάλματος για μη έγκυρη μέθοδο αιτήματος
    echo json_encode(["status" => "error", "message" => "Μη έγκυρη μέθοδος αιτήματος. Επιτρέπεται μόνο η POST."]);
}
