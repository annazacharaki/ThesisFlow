// Load user data from local storage and redirect to login page if not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    window.location.assign("index.html"); // Redirect to login if no logged user found
}

// Define role-specific navigation bar paths
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",      // Path for student navbar
    "Instructor": "./navbar/instructorNavbar.html", // Path for instructor navbar
    "Secretariat": "./navbar/secretariatNavbar.html" // Path for secretariat navbar
};

// Load the appropriate navbar dynamically
if (loggedUser.role in navbarPaths) {
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]); // Load navbar content
}

// Load the footer dynamically
$("#footer-placeholder").load("footer.html");

// References to key HTML elements
const $table = $('#table'); // Reference to the thesis table
const thesisForm = document.getElementById('thesisForm'); // Form for submitting a thesis
const studentsDropdown = $("#students"); // Dropdown for students
const saveButton = document.getElementById("saveChanges"); // Button to save changes in the modal

/**
 * Handle thesis form submission
 */
thesisForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form's default submission behavior

    // Collect form data
    const formData = new FormData(this);
    formData.append("instructor_id", loggedUser.entity_id); // Add logged user's ID
    // formData.append("title", document.getElementById('title').value); // Thesis title
    // formData.append("summary", document.getElementById('description').value); // Thesis description
    // formData.append("topic_presentation", document.getElementById('pdfFile').files[0]); // PDF file upload
    console.log(formData);

    // Send form data via fetch
    fetch("./php/insertThesis.php", {
        method: "POST",
        body: formData, // Send the FormData object
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json(); // Parse response as JSON
        }).then(data => {
            console.log(data);

            if (data.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Επιτυχία", // "Success"
                    timer: 2000,
                }).then(() => location.reload()); // Reload page on success
            } else {
                Swal.fire({
                    icon: "error",
                    text: data.message, // Display error message from backend
                });
            }
        })
        .catch(error => console.error("Error:", error)); // Log any fetch errors
});

/**
 * Function to dynamically add options to a select element.
 * @param {HTMLElement} select - The select element to populate
 * @param {Array} options - Array of options to add
 */
function addOptionsToSelect(select, options) {
    // Add a placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = "Παρακαλώ επιλέξτε"; // "Please select"
    placeholderOption.value = ""; // Empty value
    placeholderOption.disabled = true; // Disable selection of placeholder
    placeholderOption.selected = true; // Mark as default selected
    select.append(placeholderOption);

    // Add all other options dynamically
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.textContent = option.text; // Option's visible text
        opt.setAttribute('data-tokens', option.tokens); // Set data-tokens for Bootstrap select
        opt.value = option.id; // Option's value
        select.append(opt);
    });

    // Refresh the Bootstrap selectpicker
    select.selectpicker('refresh');
}

// Fetch data to populate the students dropdown
fetch('./php/selectStudentDropdown.php')
    .then(response => response.json()) // Parse response JSON
    .then(data => {
        addOptionsToSelect(studentsDropdown, data); // Populate dropdown with fetched data
    })
    .catch(error => console.error('Error fetching JSON:', error)); // Log any errors

/**
 * Event handler for assigning a thesis to a student.
 */
window.operateEvents = {
    'click .studentAssingment': function (e, value, row) {
        // Enable save button when a student is selected
        studentsDropdown.on('changed.bs.select', function () {
            saveButton.disabled = !studentsDropdown.val(); // Disable save if no value is selected
        });

        // Handle save button click
        saveButton.addEventListener('click', function () {
            const studentRequestData = new URLSearchParams({
                thesis_id: row.thesis_id, // Selected thesis ID
                student_id: studentsDropdown.val(), // Selected student ID
            });

            // Send the request to assign the student
            fetch('./php/updateAssignedStudent.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: studentRequestData,
            })
                .then(response => response.json()) // Parse response JSON
                .then(data => {
                    if (data.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Επιτυχία", // "Success"
                            timer: 2000,
                        }).then(() => location.reload()); // Reload on success
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: data.message || "Unknown error.",
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error); // Log fetch errors
                    Swal.fire({
                        icon: "error",
                        text: "An unexpected error occurred. Please try again later.",
                    });
                });
        });
    }
};

/**
 * Formatter for operation buttons in the thesis table.
 * @param {any} value - Unused
 * @param {Object} row - The row data for the current thesis
 * @returns {string} - HTML string for buttons
 */
function operateFormatter(value, row) {
    if (row.assigned_student === null) {
        // Show "Assign" button for unassigned theses
        return '<button class="studentAssingment btn btn-primary" data-bs-toggle="modal" data-bs-target="#assignThesisModal">Ανάθεση</button>';
    } else {
        // Show "Unassign" button for assigned theses
        return `<button class="unassignStudent btn btn-danger" data-thesis-id="${row.thesis_id}">Αφαίρεση</button>`;
    }
}

// Event listener for the "Unassign" button
$(document).on('click', '.unassignStudent', function () {
    const thesisId = $(this).data('thesis-id'); // Get thesis ID from button's data attribute

    // Confirm unassignment
    Swal.fire({
        title: "Είστε σίγουροι;", // "Are you sure?"
        text: "Η ανάθεση θα αναιρεθεί.", // "The assignment will be removed."
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Danger color
        cancelButtonColor: "#3085d6", // Safe color
        confirmButtonText: "Ναι!", // "Yes"
        cancelButtonText: "Ακύρωση" // "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            // Send request to unassign the student
            fetch('./php/updateAssignedStudent.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ thesis_id: thesisId, student_id: '' }), // Unassign student
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        // Remove committee invitations after unassignment
                        return fetch('./php/deleteCommitteInvitations.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ thesis_id: thesisId }),
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            text: data.message || "Failed to unassign the student.",
                        });
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Επιτυχία", // "Success"
                            text: "Η ανάθεση αναιρέθηκε και οι προσκλήσεις διαγράφηκαν.", // "Assignment removed and invitations deleted."
                            timer: 2000,
                        }).then(() => location.reload());
                    }
                })
                .catch(error => {
                    console.error("Error:", error); // Log fetch errors
                    Swal.fire({
                        icon: "error",
                        text: "An unexpected error occurred. Please try again later.",
                    });
                });
        }
    });
});

/**
 * Fetch and initialize thesis data for the table.
 */
$(function () {
    fetch('./php/selectUnassignedTheses.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ instructor_id: loggedUser.entity_id }), // Include instructor ID
    })
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            $table.bootstrapTable({ data }); // Populate table with data
        })
        .catch(error => console.error('Error fetching thesis data:', error)); // Log fetch errors
});

/**
 * Detailed formatter for each row in the thesis table.
 * @param {number} index - Index of the row
 * @param {Object} row - Data for the row
 * @returns {string} - HTML content for the row's details
 */
function detailFormatter(index, row) {
    let html = [];
    html.push(`<div class="container">`);
    html.push(`<p><strong>Αριθμός Διπλωματικής:</strong> ${row.thesis_id}</p>`);
    html.push(`
        <br />
        <strong>Τροποποίηση Περιγραφής:</strong>
        <form id="topicDescriptionForm-${row.thesis_id}"> <!-- Form for adding a thesis topic -->
            <div class="mt-3">
                <input type="file" id="file-${row.thesis_id}" name="file" accept="application/pdf" required>
                <button type="submit" class="btn btn-primary">Προσθήκη</button> <!-- Submit button -->
            </div>
        </form>
    `);

    if (row.assigned_student === null) {
        html.push(`<h5 class="mt-3">Ανάθεση φοιτητή πρώτα.</h5>`); // "Assign a student first."
    } else {
        // Render committee invitations
        if (row.committee_invitations && row.committee_invitations.length > 0) {
            html.push(`<h6 class="mt-3">Προσκλήσεις:</h6>`); // "Invitations"
            html.push(`<ul>`);
            row.committee_invitations.forEach(invite => {
                html.push(`
                    <li><strong>Καθηγητής:</strong> ${invite.instructor_name} - <strong>Κατάσταση:</strong> ${invite.status} - <strong>Δημιουργήθηκε:</strong> ${new Date(invite.created_at).toLocaleString("el-GR")} - <strong>Απάντηση:</strong> ${invite.updated_at ? new Date(invite.updated_at).toLocaleString("el-GR") : "Δεν έχει απαντηθεί ακόμα"}</li>
                `); // Render each invitation with details
            });
            html.push(`</ul>`);
        } else {
            html.push(`<p>Δεν υπάρχουν Προσκλήσεις.</p>`); // "No invitations found."
        }
    }

    html.push(`</div>`);
    return html.join(""); // Return combined HTML
}

document.addEventListener("submit", function (event) {
    if (event.target.id.startsWith("topicDescriptionForm")) {
        event.preventDefault(); // Prevent default form submission

        const formIndex = event.target.id.split("-")[1]; // Extract the form index
        const fileInput = document.getElementById(`file-${formIndex}`);

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("thesis_id", formIndex); // Pass thesis ID to the server
        formData.append("file", file);
        formData.append("column_name", "topic_presentation_file_name");
        formData.append("column_path", "topic_presentation_file_path");

        // Send the data to the backend PHP script
        fetch("./php/uploadDocument.php", { // Use the correct script path
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Επιτυχία',
                        text: data.message,
                    }).then(() => location.reload()); // Reload page on success
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Σφάλμα',
                        text: data.message,
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Σφάλμα',
                    text: "Παρουσιάστηκε σφάλμα κατά τη μεταφόρτωση.",
                });
            });
    }
});
