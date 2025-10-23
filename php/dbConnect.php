<?php

$base = mysqli_connect("localhost", "root", "", "thesisflow") or die("Unable to connect");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}
