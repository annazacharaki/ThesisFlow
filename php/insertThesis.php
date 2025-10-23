<?php
// Include the database connection file
include 'dbConnect.php';

// Check if a file is uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $instructor_id = $_POST['instructor_id']; // Retrieve instructor_id
    $file = $_FILES['file'];
    $uploadDir = "./database/"; // Ο φάκελος προορισμού για τα αρχεία
    $uploadDir2 = "../database/"; // Ο φάκελος προορισμού για τα αρχεία

    $filePath = $uploadDir . basename($file['name']); // Πλήρης διαδρομή του νέου αρχείου
    $filePath2 = $uploadDir2 . basename($file['name']); // Πλήρης διαδρομή του νέου αρχείου

    // Validate and move the file
    if ($file['type'] === 'application/pdf') {
        if (move_uploaded_file($file['tmp_name'], $filePath2)) {
            // Insert file info into database
            $query = "INSERT INTO thesis (instructor_id, title, description, topic_presentation_file_name, topic_presentation_file_path) VALUES (?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($base, $query);
            mysqli_stmt_bind_param($stmt, "issss", $instructor_id, $title, $description, $file['name'], $filePath);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(["status" => "success", "message" => "Thesis uploaded successfully."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to upload thesis: " . mysqli_error($base)]);
            }

            // Close the statement and connection
            mysqli_stmt_close($stmt);
            mysqli_close($base);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload file"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Only PDF files are allowed."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
