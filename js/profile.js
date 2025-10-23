// Load user data from local storage and redirect to the login page if the user is not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    window.location.assign("index.html"); // Redirect to login page
}

// Define paths for role-specific navigation bars
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",      // Path for student navbar
    "Instructor": "./navbar/instructorNavbar.html", // Path for instructor navbar
    "Secretariat": "./navbar/secretariatNavbar.html" // Path for secretariat navbar
};

// Load the appropriate navbar based on the user's role
if (loggedUser.role in navbarPaths) {
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]); // Load the navbar dynamically
}

// Load the footer content dynamically
$("#footer-placeholder").load("footer.html");

/**
 * Function to validate email format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email format
    return regex.test(email);
}

/**
 * Function to validate mobile phone numbers.
 * @param {string} mobile - The mobile number to validate.
 * @returns {boolean} - True if valid (starts with 69 and 8 digits follow), false otherwise.
 */
function validateMobile(mobile) {
    const regex = /^69\d{8}$/; // Greek mobile number starts with '69' and has 10 digits
    return regex.test(mobile);
}

/**
 * Function to validate landline phone numbers.
 * @param {string} landline - The landline number to validate.
 * @returns {boolean} - True if valid (starts with 2 and 9 digits follow), false otherwise.
 */
function validateLandline(landline) {
    const regex = /^2\d{9}$/; // Greek landline starts with '2' and has 10 digits
    return regex.test(landline);
}

// Wait until the DOM content is fully loaded
$(document).ready(function () {

    // Handle submission of the address section
    $('#submitAddress').click(function () {
        // Retrieve and trim values from address fields
        const street = $('#street').val().trim();
        const number = $('#number').val().trim();
        const city = $('#city').val().trim();
        const postcode = $('#postcode').val().trim();

        // Validate that all fields are filled
        if (!street || !number || !city || !postcode) {
            Swal.fire({
                icon: "error",
                title: "Σφάλμα", // "Error"
                text: "Συμπληρώστε όλα τα πεδία της διεύθυνσης.", // "Fill in all address fields."
            });
            return; // Exit function if validation fails
        }

        // Construct the full address string
        const fullAddress = `${street} ${number}, ${city}, ${postcode}`;

        // Send the address to the server
        updateStudentInfo('fullAddress', fullAddress);

        // Clear the input fields after successful submission
        $('#street, #number, #city, #postcode').val('');
    });

    // Handle submission of individual fields like email, mobile, etc.
    $('.submit-btn').click(function () {
        const fieldId = $(this).data('field'); // Get the field ID from the button's data attribute
        const fieldValue = $(`#${fieldId}`).val().trim(); // Get and trim the field's value
        let isValid = true; // Validation status flag
        let errorMessage = ''; // Error message

        // Validation logic based on the field type
        if (fieldValue === '') {
            isValid = false;
            errorMessage = 'Το πεδίο δεν μπορεί να είναι κενό.'; // "The field cannot be empty."
        } else if (fieldId === 'email' && !validateEmail(fieldValue)) {
            isValid = false;
            errorMessage = 'Εισάγετε ένα έγκυρο email.'; // "Enter a valid email."
        } else if (fieldId === 'mobile' && !validateMobile(fieldValue)) {
            isValid = false;
            errorMessage = 'Εισάγετε ένα έγκυρο κινητό.'; // "Enter a valid mobile number."
        } else if (fieldId === 'landline' && fieldValue && !validateLandline(fieldValue)) {
            isValid = false;
            errorMessage = 'Εισάγετε ένα έγκυρο σταθερό τηλέφωνο.'; // "Enter a valid landline number."
        }

        // Show error message if validation fails
        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Σφάλμα", // "Error"
                text: errorMessage,
            });
        } else {
            console.log(fieldId, fieldValue); // Log the field being updated for debugging
            updateStudentInfo(fieldId, fieldValue); // Send data to the server
            $(`#${fieldId}`).val(''); // Clear the input field
        }
    });
});

/**
 * Function to send updates to the server for student fields.
 * @param {string} fieldId - The ID of the field being updated.
 * @param {string} fieldValue - The value of the field being updated.
 */
function updateStudentInfo(fieldId, fieldValue) {

    // Prepare the data payload for the POST request
    const payload = new URLSearchParams();
    payload.append('fieldId', fieldId); // Field being updated
    payload.append('fieldValue', fieldValue); // New value
    payload.append('student_id', loggedUser.entity_id); // Student ID from loggedUser data

    // Send the request to the server
    fetch('./php/updateStudentInfo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Form data type
        body: payload,
    })
        .then(response => response.json()) // Parse the JSON response from the server
        .then(data => {
            if (data.status === 'success') {
                // Display a success alert
                Swal.fire({
                    icon: "success",
                    title: "Επιτυχία", // "Success"
                    text: data.message,
                });
                console.log("Field updated successfully:", data.message);
            } else {
                // Display an error alert
                Swal.fire({
                    icon: "error",
                    title: "Σφάλμα", // "Error"
                    text: data.message,
                });
                console.error("Error updating field:", data.message);
            }
        })
        .catch(error => {
            // Handle network or unexpected errors
            Swal.fire({
                icon: "error",
                title: "Σφάλμα", // "Error"
                text: "Παρουσιάστηκε πρόβλημα κατά την επικοινωνία με τον διακομιστή.", // "There was an issue with the server communication."
            });
            console.error("Fetch error:", error);
        });
}
