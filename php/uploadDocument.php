<?php
// Συμπερίληψη του αρχείου σύνδεσης με τη βάση δεδομένων
include 'dbConnect.php';

// Έλεγχος αν ένα αρχείο έχει μεταφορτωθεί μέσω μεθόδου POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Λήψη των δεδομένων από το frontend
    $thesis_id = $_POST['thesis_id']; // ID της διπλωματικής εργασίας
    $file = $_FILES['file']; // Ανάκτηση του μεταφορτωμένου αρχείου
    $column_name = $_POST['column_name']; // Όνομα της στήλης για το όνομα του αρχείου
    $column_path = $_POST['column_path']; // Όνομα της στήλης για τη διαδρομή του αρχείου

    $uploadDir = "./database/"; // Ο φάκελος προορισμού για τα αρχεία
    $uploadDir2 = "../database/"; // Ο φάκελος προορισμού για τα αρχεία

    $filePath = $uploadDir . basename($file['name']); // Πλήρης διαδρομή του νέου αρχείου
    $filePath2 = $uploadDir2 . basename($file['name']); // Πλήρης διαδρομή του νέου αρχείου

    // Επικύρωση του τύπου αρχείου (μόνο PDF επιτρέπονται)
    if ($file['type'] === 'application/pdf') {
        // Ανάκτηση της τρέχουσας διαδρομής αρχείου από τη βάση δεδομένων
        $query = "SELECT $column_path FROM thesis WHERE thesis_id = ?";
        $stmt = mysqli_prepare($base, $query);
        mysqli_stmt_bind_param($stmt, "i", $thesis_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $currentFilePath);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);

        // Διαγραφή του υπάρχοντος αρχείου αν υπάρχει
        if (!empty($currentFilePath) && file_exists($currentFilePath)) {
            // Εάν η διαγραφή αποτύχει, επιστρέφεται μήνυμα σφάλματος
            if (!unlink($currentFilePath)) {
                echo json_encode(["status" => "error", "message" => "Αποτυχία διαγραφής του παλιού αρχείου."]);
                exit;
            }
        }

        // Μετακίνηση του νέου αρχείου στον προορισμό
        if (move_uploaded_file($file['tmp_name'], $filePath2)) {
            // Ενημέρωση των πληροφοριών αρχείου στη βάση δεδομένων
            $updateQuery = "UPDATE thesis SET $column_name = ?, $column_path = ? WHERE thesis_id = ?";
            $updateStmt = mysqli_prepare($base, $updateQuery);
            mysqli_stmt_bind_param($updateStmt, "ssi", $file['name'], $filePath, $thesis_id);

            // Εκτέλεση της ενημέρωσης στη βάση δεδομένων
            if (mysqli_stmt_execute($updateStmt)) {
                echo json_encode(["status" => "success", "message" => "Το αρχείο ανέβηκε με επιτυχία."]);
            } else {
                // Επιστροφή μηνύματος σφάλματος αν η ενημέρωση αποτύχει
                echo json_encode(["status" => "error", "message" => "Αποτυχία ενημέρωσης της βάσης δεδομένων: " . mysqli_error($base)]);
            }

            // Κλείσιμο της δήλωσης και της σύνδεσης
            mysqli_stmt_close($updateStmt);
            mysqli_close($base);
        } else {
            // Επιστροφή μηνύματος σφάλματος αν η μεταφόρτωση αποτύχει
            echo json_encode(["status" => "error", "message" => "Αποτυχία μεταφόρτωσης αρχείου"]);
        }
    } else {
        // Επιστροφή μηνύματος σφάλματος αν το αρχείο δεν είναι PDF
        echo json_encode(["status" => "error", "message" => "Μόνο αρχεία PDF επιτρέπονται."]);
    }
} else {
    // Επιστροφή μηνύματος σφάλματος για μη έγκυρη μέθοδο αιτήματος
    echo json_encode(["status" => "error", "message" => "Μη έγκυρη μέθοδος αιτήματος."]);
}
