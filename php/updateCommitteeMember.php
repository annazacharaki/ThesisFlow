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
    $thesis_id = $_POST['thesis_id'] ?? null;
    $committee_member_id = $_POST['committee_member_id'] ?? null;
    $status = $_POST['status'] ?? null;

    // Validate inputs
    if (!$thesis_id || !$committee_member_id || !$status) {
        echo json_encode([
            "status" => "error",
            "message" => "Τα thesis_id, committee_member_id και status είναι υποχρεωτικά."
        ]);
        exit;
    }

    // Start transaction
    mysqli_begin_transaction($base);

    try {
        // Step 1: Handle status Απορρίφθηκε (Rejected)
        if ($status === 'Απορρίφθηκε') {
            $update_rejected_query = "
                UPDATE committee_invitations 
                SET status = 'Απορρίφθηκε' 
                WHERE thesis_id = ? AND instructor_id = ?
            ";
            $stmt_update_rejected = mysqli_prepare($base, $update_rejected_query);
            mysqli_stmt_bind_param($stmt_update_rejected, 'ii', $thesis_id, $committee_member_id);
            mysqli_stmt_execute($stmt_update_rejected);

            // Commit and return success
            mysqli_commit($base);
            echo json_encode([
                "status" => "success",
                "message" => "Η πρόσκληση επιτροπής Απορρίφθηκε."
            ]);
            exit;
        }

        // Step 2: Handle status Δεκτό (Accepted)
        if ($status === 'Δεκτό') {
            // Retrieve current committee_member_1 and committee_member_2
            $select_query = "SELECT committee_member_1, committee_member_2 FROM thesis WHERE thesis_id = ?";
            $stmt = mysqli_prepare($base, $select_query);
            mysqli_stmt_bind_param($stmt, 'i', $thesis_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($row = mysqli_fetch_assoc($result)) {
                $committee_member_1 = $row['committee_member_1'];
                $committee_member_2 = $row['committee_member_2'];

                // Determine which committee_member field to update
                if (empty($committee_member_1)) {
                    $update_committee_query = "UPDATE thesis SET committee_member_1 = ? WHERE thesis_id = ?";
                } elseif (empty($committee_member_2)) {
                    $update_committee_query = "UPDATE thesis SET committee_member_2 = ? WHERE thesis_id = ?";
                } else {
                    throw new Exception("Και οι δύο θέσεις μέλους επιτροπής είναι ήδη γεμάτες.");
                }

                // Execute the update for committee member
                $stmt_update_committee = mysqli_prepare($base, $update_committee_query);
                mysqli_stmt_bind_param($stmt_update_committee, 'ii', $committee_member_id, $thesis_id);
                mysqli_stmt_execute($stmt_update_committee);

                // Update committee_invitations status to 'Δεκτό'
                $update_invite_query = "
                    UPDATE committee_invitations 
                    SET status = 'Δεκτό' 
                    WHERE thesis_id = ? AND instructor_id = ?
                ";
                $stmt_update_invite = mysqli_prepare($base, $update_invite_query);
                mysqli_stmt_bind_param($stmt_update_invite, 'ii', $thesis_id, $committee_member_id);
                mysqli_stmt_execute($stmt_update_invite);

                // If committee_member_2 was updated, delete invitations and update thesis status
                if (!empty($committee_member_1) && empty($committee_member_2)) {
                    $delete_invites_query = "DELETE FROM committee_invitations WHERE thesis_id = ? AND status = 'Εκκρεμής'";
                    $stmt_delete_invites = mysqli_prepare($base, $delete_invites_query);
                    mysqli_stmt_bind_param($stmt_delete_invites, 'i', $thesis_id);
                    mysqli_stmt_execute($stmt_delete_invites);

                    $update_thesis_status_query = "UPDATE thesis SET status = 'Ενεργή' WHERE thesis_id = ?";
                    $stmt_update_thesis_status = mysqli_prepare($base, $update_thesis_status_query);
                    mysqli_stmt_bind_param($stmt_update_thesis_status, 'i', $thesis_id);
                    mysqli_stmt_execute($stmt_update_thesis_status);
                }

                // Commit transaction
                mysqli_commit($base);

                // Success response
                echo json_encode([
                    "status" => "success",
                    "message" => "Η πρόσκληση επιτροπής έγινε δεκτή."
                ]);
            } else {
                throw new Exception("Δεν βρέθηκε η διπλωματική εργασία με το συγκεκριμένο thesis_id.");
            }
        } else {
            throw new Exception("Η τιμή του status πρέπει να είναι είτε 'Δεκτό' είτε 'Απορρίφθηκε'.");
        }
    } catch (Exception $e) {
        // Rollback transaction in case of error
        mysqli_rollback($base);
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    } finally {
        // Close all prepared statements and database connection
        if (isset($stmt)) mysqli_stmt_close($stmt);
        if (isset($stmt_update_committee)) mysqli_stmt_close($stmt_update_committee);
        if (isset($stmt_update_invite)) mysqli_stmt_close($stmt_update_invite);
        if (isset($stmt_delete_invites)) mysqli_stmt_close($stmt_delete_invites);
        if (isset($stmt_update_thesis_status)) mysqli_stmt_close($stmt_update_thesis_status);
        mysqli_close($base);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Μη έγκυρη μέθοδος αιτήματος. Χρησιμοποιήστε POST."
    ]);
}
