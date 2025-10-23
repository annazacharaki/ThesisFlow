// Select the login form element using its ID attribute.
// This assumes there is an HTML element with id="loginForm".
const loginForm = document.getElementById("loginForm");

// Add an event listener to the login form to handle the "submit" event.
// The callback function will be executed when the form is submitted.
loginForm.addEventListener("submit", (e) => {
    // Prevent the default behavior of form submission, which would normally reload the page.
    e.preventDefault();

    // Remove any existing login alert element.
    // Select the alert element using its ID (assumes an element with id="loginAlert").
    const dismissAlert = document.getElementById("loginAlert");

    // Check if the alert element exists in the DOM.
    if (dismissAlert !== null) {
        // Remove the alert element to dismiss it from the UI.
        dismissAlert.remove();
    }

    // Retrieve the value of the "username" input field (assumes an input with id="username").
    const username = document.getElementById("username").value;

    // Retrieve the value of the "password" input field (assumes an input with id="password").
    const password = document.getElementById("password").value;

    // Input validation: Check if the username input is empty.
    if (username === '') {
        // Display an alert asking the user to enter their email.
        alert('Please enter your email!');
        // Attempt to focus on the username input field for convenience.
        document.getElementById("username").focus();
    }
    // Input validation: Check if the password input is empty.
    else if (password === '') {
        // Display an alert asking the user to enter their password.
        alert('Please enter Password');
        // Attempt to focus on the password input field for convenience.
        document.getElementById("password").focus();
    }
    else {
        // If both username and password are provided, send a request to the server for validation.

        // Use the fetch API to make an HTTP POST request to the "login.php" backend script.
        fetch('./php/login.php', {
            method: 'POST', // Specify the HTTP method as POST.
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Specify the content type.
            },
            // The body contains the data to send in URL-encoded format.
            // URLSearchParams automatically encodes the object into key=value pairs.
            body: new URLSearchParams({
                username: username, // Send the username as a parameter.
                password: password  // Send the password as a parameter.
            })
        })
            // Handle the server's response, which is expected to be in JSON format.
            .then(response => response.json())
            .then(data => {
                // Log the server response to the console for debugging.
                console.log(data);

                // Check if the server returned a "success" status.
                if (data.status === 'success') {
                    // Store the user data in localStorage to persist the login session.
                    // JSON.stringify() converts the object into a JSON string.
                    localStorage.setItem("logged_user", JSON.stringify(data));

                    // Redirect the user to the home page after a successful login.
                    window.location.assign("home.html");
                } else {
                    // If the login attempt failed, log the error and display an alert to the user.
                    console.error('Login failed:', data.message);
                    alert(`Login failed: ${data.message}`);
                }
            })
            // Handle any errors that occur during the fetch request or response handling.
            .catch(error => console.error('Error:', error));
    }
});

// Use jQuery to dynamically load the footer content into a placeholder element.
// This assumes there is an element with id="footer-placeholder".
$("#footer-placeholder").load("footer.html");
