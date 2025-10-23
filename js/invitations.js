// Load user data from local storage and redirect to login page if not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    // If user data does not exist in local storage, redirect to login page
    window.location.assign("index.html");
}

// Define paths for different navigation bars based on user roles
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",      // Path for students
    "Instructor": "./navbar/instructorNavbar.html", // Path for instructors
    "Secretariat": "./navbar/secretariatNavbar.html" // Path for secretariat
};

// Check if the user's role exists in navbarPaths and load the appropriate navbar
if (loggedUser.role in navbarPaths) {
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]); // Load corresponding navbar into the placeholder
}

// Load the footer dynamically
$("#footer-placeholder").load("footer.html");

// Initialize the table element using jQuery
let $table = $('#table');

// Fetch data for the table and initialize it using bootstrapTable
$(function () {
    // Send a POST request to retrieve committee invitations
    fetch('./php/selectCommitteeInvitations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ instructor_id: loggedUser.entity_id }) // Pass the instructor's ID
    })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            console.log(data);
            if (data.status === "error") {
                // Initialize the table with no data if an error occurs
                $table.bootstrapTable();
            } else {
                // Populate the table with data
                $table.bootstrapTable({ data });
            }
        })
        .catch(error => console.error('Error:', error)); // Handle network or fetch errors
});

/**
 * Convert a date string into a human-readable format.
 * @param {string} dateString - A date string to format
 * @returns {string} - Formatted date string
 */
const formatDate = (dateString) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
};

/**
 * Custom formatter for operation buttons in the table rows.
 * @param {any} value - Unused parameter (data value for the column)
 * @param {Object} row - The current row object
 * @returns {string} - HTML for the action buttons
 */
function operateFormatter(value, row) {
    return `
        <button class="btn btn-success btn-sm accept_btn" data-id="${row.invitation_id}">Accept</button>
        <button class="btn btn-danger btn-sm reject_btn" data-id="${row.invitation_id}">Reject</button>
    `;
}

/**
 * Event handlers for the table buttons
 */
window.operateEvents = {
    /**
     * Handle "Accept" button click.
     */
    'click .accept_btn': function (e, value, row) {
        Swal.fire({
            title: "Είστε σίγουροι;",
            text: "Αποδοχή πρόσκλησης.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Αποδοχή!",
            cancelButtonText: "Άκυρο"
        }).then((result) => {
            if (result.isConfirmed) {
                // Send a POST request to update the committee member's status to "Accepted"
                fetch('./php/updateCommitteeMember.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        thesis_id: row.thesis_id,
                        committee_member_id: loggedUser.entity_id,
                        status: "Δεκτό" // Status: Accepted
                    })
                })
                    .then(response => response.json()) // Parse response
                    .then(data => {
                        if (data.status === "success") {
                            Swal.fire({
                                icon: "success",
                                title: "Επιτυχία",
                                text: data.message,
                                timer: 2000
                            }).then(() => location.reload()); // Reload the page to update data
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Σφάλμα",
                                text: data.message
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Σφάλμα",
                            text: "Προέκυψε απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά."
                        });
                    });
            }
        });
    },

    /**
     * Handle "Reject" button click.
     */
    'click .reject_btn': function (e, value, row) {
        Swal.fire({
            title: "Είστε σίγουροι;",
            text: "Απόριψη πρόσκλησης.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Απόριψη",
            cancelButtonText: "Άκυρο"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('./php/updateCommitteeMember.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        thesis_id: row.thesis_id,
                        committee_member_id: loggedUser.entity_id,
                        status: "Απορρίφθηκε" // Status: Rejected
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            Swal.fire({
                                icon: "success",
                                title: "Επιτυχία",
                                text: data.message,
                                timer: 2000
                            }).then(() => location.reload());
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Σφάλμα",
                                text: data.message
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Σφάλμα",
                            text: "Προέκυψε απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά."
                        });
                    });
            }
        });
    }
};

/**
 * Formatter to display detailed information about the row.
 * @param {number} index - Row index
 * @param {Object} row - Row data
 * @returns {string} - HTML for additional details
 */
function detailFormatter(index, row) {
    let html = [];
    row.comments = []; // Initialize comments (unused in provided code)
    html.push(`<div class="container">`);
    html.push(`<p><strong>Περιγραφή:</strong> ${row.description}</p>`); // Description of the invitation
    html.push(`<p><strong>Φοιτητής:</strong> ${row.assigned_student}</p>`); // Student name
    return html.join(''); // Combine HTML array into a single string
}
