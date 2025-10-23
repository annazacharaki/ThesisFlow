// The window.onload event triggers when the entire page (including images, scripts, and stylesheets) has fully loaded.
window.onload = function () {
    // Retrieve the "logged_user" object from the browser's local storage.
    // localStorage.getItem("logged_user") fetches the value stored under the "logged_user" key.
    // JSON.parse() converts the JSON string stored in localStorage back into a JavaScript object.
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));

    // Check if there is no logged-in user (i.e., logged_user is null).
    // This indicates that no user session has been stored.
    if (logged_user == null) {
        // Redirect the user to the "index.html" page (likely the login page).
        window.location.assign("index.html");
        // End the function here to prevent further execution.
    }

    // Determine the role of the logged-in user and load the appropriate navigation bar.
    // The role is assumed to be a property of the logged_user object.

    if (logged_user.role === "Student") {
        // If the user is a Student, load the student-specific navbar into the placeholder element.
        // $("#nav-placeholder") targets an element with the ID "nav-placeholder".
        // .load() is a jQuery function that loads the content of an external HTML file into the selected element.
        $("#nav-placeholder").load("./navbar/studentNavbar.html");
    } else if (logged_user.role === "Instructor") {
        // If the user is an Instructor, load the instructor-specific navbar.
        $("#nav-placeholder").load("./navbar/instructorNavbar.html");
    } else if (logged_user.role === "Secretariat") {
        // If the user is a Secretariat, load the secretariat-specific navbar.
        $("#nav-placeholder").load("./navbar/secretariatNavbar.html");
    }

    // Load the footer content into the placeholder element with ID "footer-placeholder".
    // This is done regardless of the user role.
    $("#footer-placeholder").load("footer.html");
};
