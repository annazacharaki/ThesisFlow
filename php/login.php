<?php

// Start the session
session_start();

// Include the database connection file
include 'dbConnect.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the username and password from the POST request
    $username = $_POST['username'];
    $password = $_POST['password'];


    // Prepare a query to find the user in the personnel table
    $query = "SELECT p.personnel_id, p.username, p.password, p.role, 
                     s.student_id, s.name AS student_name, s.surname AS student_surname,
                     i.instructor_id, i.name AS instructor_name, i.surname AS instructor_surname,
                     sec.secretariat_id, sec.name AS secretariat_name, sec.surname AS secretariat_surname
              FROM personnel p
              LEFT JOIN student s ON p.student_id = s.student_id
              LEFT JOIN instructor i ON p.instructor_id = i.instructor_id
              LEFT JOIN secretariat sec ON p.secretariat_id = sec.secretariat_id
              WHERE p.username = ? AND p.password = ?";

    $stmt = mysqli_prepare($base, $query);
    mysqli_stmt_bind_param($stmt, "ss", $username, $password);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    // Check if a user was found
    if ($row = mysqli_fetch_assoc($result)) {
        // Build the session and response
        $_SESSION['user_id'] = $row['personnel_id'];
        $_SESSION['role'] = $row['role'];

        // Add entity-specific details
        if ($row['role'] === 'Student') {
            $_SESSION['entity_id'] = $row['student_id'];
            $_SESSION['first_name'] = $row['student_name'];
            $_SESSION['last_name'] = $row['student_surname'];
        } elseif ($row['role'] === 'Instructor') {
            $_SESSION['entity_id'] = $row['instructor_id'];
            $_SESSION['first_name'] = $row['instructor_name'];
            $_SESSION['last_name'] = $row['instructor_surname'];
        } elseif ($row['role'] === 'Secretariat') {
            $_SESSION['entity_id'] = $row['secretariat_id'];
            $_SESSION['first_name'] = $row['secretariat_name'];
            $_SESSION['last_name'] = $row['secretariat_surname'];
        }

        // Build response to return
        $response = [
            "status" => "success",
            "user_id" => $_SESSION['user_id'],
            "role" => $_SESSION['role'],
            "entity_id" => $_SESSION['entity_id'],
            "first_name" => $_SESSION['first_name'],
            "last_name" => $_SESSION['last_name']
        ];

        echo json_encode($response);
    } else {
        // No user found
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }

    // Close the statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($base);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
