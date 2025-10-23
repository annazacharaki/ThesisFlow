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
    // Retrieve input parameters
    $fieldId = $_POST['fieldId'] ?? null;
    $fieldValue = $_POST['fieldValue'] ?? null;
    $student_id = $_POST['student_id'] ?? null;

    // Define allowed fields and corresponding database column names
    $allowedFields = [
        'email' => 'email',
        'mobile' => 'mobile_telephone',
        'landline' => 'landline_telephone',
        'fullAddress' => ['street', 'number', 'city', 'postcode']
    ];

    // Check if the fieldId is allowed
    if (!array_key_exists($fieldId, $allowedFields)) {
        echo json_encode([
            "status" => "error",
            "message" => "Το fieldId δεν είναι έγκυρο."
        ]);
        exit;
    }

    try {
        // Handle fullAddress separately
        if ($fieldId === 'fullAddress') {
            // Split fullAddress into parts
            $parts = preg_split('/, ?/', $fieldValue);
            if (count($parts) !== 3) {
                throw new Exception("Η διεύθυνση πρέπει να έχει τη μορφή: Οδός Αριθμός, Πόλη, Ταχυδρομικός Κώδικας.");
            }

            list($street_number, $city, $postcode) = $parts;

            // Split street and number
            $streetParts = explode(' ', $street_number, 2);
            if (count($streetParts) !== 2) {
                throw new Exception("Η οδός και ο αριθμός πρέπει να είναι στη μορφή: Οδός Αριθμός.");
            }

            list($street, $number) = $streetParts;

            // Update all related fields
            $query = "
                UPDATE student 
                SET street = ?, number = ?, city = ?, postcode = ? 
                WHERE student_id = ?
            ";
            $stmt = mysqli_prepare($base, $query);
            mysqli_stmt_bind_param($stmt, 'sisii', $street, $number, $city, $postcode, $student_id);
        } else {
            // General update for other fields
            $columnName = $allowedFields[$fieldId];
            $query = "UPDATE student SET $columnName = ? WHERE student_id = ?";
            $stmt = mysqli_prepare($base, $query);
            mysqli_stmt_bind_param($stmt, 'si', $fieldValue, $student_id);
        }

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode([
                "status" => "success",
                "message" => "Το πεδίο ενημερώθηκε επιτυχώς."
            ]);
        } else {
            throw new Exception("Απέτυχε η ενημέρωση του πεδίου: " . mysqli_stmt_error($stmt));
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    } finally {
        // Close the statement and database connection
        if (isset($stmt)) mysqli_stmt_close($stmt);
        mysqli_close($base);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος. Χρησιμοποιήστε POST."
    ]);
}
