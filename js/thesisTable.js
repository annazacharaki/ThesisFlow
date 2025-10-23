// Load user data from local storage and redirect to login page if the user is not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    window.location.assign("index.html"); // Redirect to the login page
}

// Define paths for role-based navigation bars
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",      // Path for student navbar
    "Instructor": "./navbar/instructorNavbar.html", // Path for instructor navbar
    "Secretariat": "./navbar/secretariatNavbar.html" // Path for secretariat navbar
};

// Load the appropriate navbar dynamically based on user role
if (loggedUser.role in navbarPaths) {
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]); // Load navbar using jQuery
}

// Load the footer content dynamically
$("#footer-placeholder").load("footer.html");

// Global variables
let thesesData; // Stores all thesis data fetched from the backend
let $table = $('#table'); // Reference to the thesis table
const statusFilter = document.getElementById("statusFilter"); // Status filter dropdown
const roleFilter = document.getElementById("roleFilter");     // Role filter dropdown

/**
 * Fetch and initialize the table with thesis data.
 */
$(function () {
    fetch('./php/selectAllTheses.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ instructor_id: loggedUser.entity_id }), // Send the instructor ID
    })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            thesesData = data; // Store fetched data globally
            console.log(data); // Log for debugging
            $table.bootstrapTable({ data }); // Initialize the table with the fetched data
        })
        .catch(error => console.error('Error fetching thesis data:', error));
});

/**
 * Format student names for the table.
 * @param {string} value - The value of the column
 * @returns {string} - Formatted string
 */
function studentFormatter(value) {
    return value ? value : 'Χωρίς Ανάθεση'; // Display "Χωρίς Ανάθεση" if no student is assigned
}

/**
 * Format grades for the table.
 * @param {number} value - The grade value
 * @returns {string} - Formatted grade or default text
 */
function gradeFormatter(value) {
    return value !== null && value !== undefined ? value : 'Δεν έχει καταχωρηθεί';
}

/**
 * Generate detailed information for a selected thesis.
 * @param {number} index - Row index
 * @param {Object} row - Row data
 * @returns {string} - HTML content for details
 */
function detailFormatter(index, row) {
    let html = [];
    html.push(`<div class="container">`);

    // Thesis details
    html.push(`<p><strong>Περιγραφή:</strong> ${row.description}</p>`);
    html.push(`<p><strong>Επιβλέπων:</strong> ${row.instructor.instructor_name}</p>`);
    html.push(`<p><strong>Μέλος Επιτροπής 1:</strong> ${row.committee_member_1.committee_member_1_name || "Χωρίς Ανάθεση"}</p>`);
    html.push(`<p><strong>Μέλος Επιτροπής 2:</strong> ${row.committee_member_2.committee_member_2_name || "Χωρίς Ανάθεση"}</p>`);
    html.push(`<p><strong>Βαθμός επιβλέποντα:</strong> ${row.instructor.instructor_grade || "Δεν έχει καταχωρηθεί"}</p>`);
    html.push(`<p><strong>Βαθμός Μέλους Επιτροπής 1:</strong> ${row.committee_member_1.grade || "Δεν έχει καταχωρηθεί"}</p>`);
    html.push(`<p><strong>Βαθμός Μέλους Επιτροπής 2:</strong> ${row.committee_member_2.grade || "Δεν έχει καταχωρηθεί"}</p>`);
    html.push(`<p><strong>Τελικός Βαθμός:</strong> ${row.final_grade !== null ? row.final_grade : "Δεν έχει καταχωρηθεί"}</p>`);

    // Display status change history if available
    if (row.status_changes && row.status_changes.length > 0) {
        html.push(`<h6 class="mt-3">Ιστορικό Κατάστασης:</h6>`);
        html.push(`<ul class="list-group">`);
        row.status_changes.forEach(change => {
            html.push(`
                <li class="list-group-item">
                    ${change.status_change} <br />
                    <small class="text-muted">${new Date(change.changed_at).toLocaleString("el-GR")}</small>
                </li>
            `);
        });
        html.push(`</ul>`);
    } else {
        html.push(`<p>Δεν υπάρχουν αλλαγές κατάστασης.</p>`);
    }

    // Notes section
    html.push('<div class="notes-list">');
    if (row.notes.length > 0) {
        html.push('<h6 class="mt-3">Σημειώσεις:</h6>');
        html.push('<ul class="list-group note-items">');
        row.notes.forEach(comment => {
            html.push(`
                <li class="list-group-item">
                    ${comment.note} <br />
                    <small class="text-muted">${new Date(comment.date).toLocaleString("el-GR")}</small>
                </li>
            `);
        });
        html.push('</ul>');
    } else {
        html.push('<p><strong>Σημειώσεις:</strong> Δεν υπάρχουν σημειώσεις ακόμα.</p>');
    }
    html.push('</div>');

    // Add new note input (only if status is active)
    if (row.status === "Ενεργή") {
        html.push(`
            <br />
            <p>
                <strong>Προσθήκη Σημείωσης:</strong>
                <input 
                    type="text" 
                    maxlength="300" 
                    class="form-control new_comment_input" 
                    placeholder="Προσθέστε τη σημείωση σας εδώ (έως 300 χαρακτήρες)" 
                    style="width: 100%; margin-top: 5px;" 
                    aria-label="Προσθέστε τη σημείωση σας">
                <button 
                    class="btn btn-primary add_comment_btn" 
                    style="margin-top: 5px;">Προσθήκη</button>
            </p>
        `);
    } else if (row.status === 'Υπό Εξέταση') {
        html.push(`<p class="mt-3"><strong>Προχειρο κείμενο: </strong><a href="${row.draft_thesis_file_path}" target="_blank">${row.draft_thesis_file_name}</a></p>`)
        html.push(`<p class="mt-3"><strong>Links: </strong><a href="${row.material_links}" target="_blank">Link</a></p>`)
        if (row.role === "Επιβλέπων" && row.instructor.instructor_grade && row.committee_member_1.grade && row.committee_member_2.grade) {
            html.push(`
                <br />
                <strong>Πρακτικό Εξέτασης:</strong>
                <form id="examinationReportForm"> <!-- Form for adding a thesis topic -->
                    <div class="mt-3">
                        <input type="file" id="file" name="file" accept="application/pdf" required>
                        <button type="submit" id="examinationReportBtn" class="btn btn-primary">Προσθήκη</button> <!-- Submit button -->
                    </div>
                </form>
            `);
        } else {
            html.push(`
                    <br />
                    <p>
                        <strong>Προσθήκη Βαθμών:</strong>
                        <div class="row g-2 align-items-center" style="margin-top: 10px;">
                            <div class="col">
                                <label for="quality_grade" class="form-label">Ποιότητα Εργασίας:</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="1" 
                                    max="10" 
                                    class="form-control" 
                                    id="quality_grade" 
                                    placeholder="Βαθμός (1-10)" 
                                    aria-label="Ποιότητα Εργασίας" 
                                    required>
                            </div>
                            <div class="col">
                                <label for="time_grade" class="form-label">Χρονική Διάρκεια:</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="1" 
                                    max="10" 
                                    class="form-control" 
                                    id="time_grade" 
                                    placeholder="Βαθμός (1-10)" 
                                    aria-label="Χρονική Διάρκεια" 
                                    required>
                            </div>
                            <div class="col">
                                <label for="completeness_grade" class="form-label">Πληρότητα και Ποιότητα:</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="1" 
                                    max="10" 
                                    class="form-control" 
                                    id="completeness_grade" 
                                    placeholder="Βαθμός (1-10)" 
                                    aria-label="Πληρότητα και Ποιότητα" 
                                    required>
                            </div>
                            <div class="col">
                                <label for="presentation_grade" class="form-label">Παρουσίαση:</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="1" 
                                    max="10" 
                                    class="form-control" 
                                    id="presentation_grade" 
                                    placeholder="Βαθμός (1-10)" 
                                    aria-label="Παρουσίαση" 
                                    required>
                            </div>
                        </div>
                        <button 
                            class="btn btn-primary" 
                            id="add_grade_btn" 
                            style="margin-top: 10px;" 
                            >Καταχώρηση</button>
                    </p>
                `);
        }
    }
    document.addEventListener('click', function (event) {
        // Handle "Add Comment" button
        if (event.target && event.target.classList.contains('add_comment_btn')) {
            const input = document.querySelector(`.new_comment_input`);
            const noteContent = input.value.trim();

            if (noteContent.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Σφάλμα',
                    text: 'Η σημείωση δεν μπορεί να είναι κενή!',
                });
                return;
            }

            // Send the note to the server
            fetch('./php/insertNote.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    thesis_id: row.thesis_id,
                    instructor_id: row.instructor.instructor_id,
                    note: noteContent,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        // Add the new note dynamically to the list
                        const noteList = document.querySelector('.note-items');
                        const newNoteHtml = `
                                <li class="list-group-item">
                                    ${noteContent} <br />
                                    <small class="text-muted">${new Date().toLocaleString("el-GR")}</small>
                                </li>
                            `;
                        if (noteList) {
                            noteList.insertAdjacentHTML('beforeend', newNoteHtml);
                        } else {
                            const notesContainer = document.querySelector('.notes-list');
                            notesContainer.innerHTML = `
                                    <h6 class="mt-3">Σημειώσεις:</h6>
                                    <ul class="list-group note-items">
                                        ${newNoteHtml}
                                    </ul>
                                `;
                        }
                        input.value = ""; // Clear input
                        Swal.fire({
                            icon: 'success',
                            title: 'Επιτυχία',
                            text: data.message,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Σφάλμα',
                            text: data.message,
                        });
                    }
                })
                .catch(error => {
                    console.error('Fetch Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Σφάλμα',
                        text: 'Προέκυψε απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά.',
                    });
                });
        }

        // Handle "Add Instructor Grade" button
        if (event.target && event.target.id === 'add_grade_btn') {
            const qualityGrade = document.querySelector(`#quality_grade`).value;
            const timeGrade = document.querySelector('#time_grade').value;
            const completenessGrade = document.querySelector('#completeness_grade').value;
            const presentationGrade = document.querySelector('#presentation_grade').value;

            if (!qualityGrade || !timeGrade || !completenessGrade || !presentationGrade) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Προσοχή',
                    text: 'Πρέπει να συμπληρώσετε όλους τους βαθμούς.',
                });
                return;
            }

            if (
                qualityGrade < 1 || qualityGrade > 10 ||
                timeGrade < 1 || timeGrade > 10 ||
                completenessGrade < 1 || completenessGrade > 10 ||
                presentationGrade < 1 || presentationGrade > 10
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Λανθασμένες Τιμές',
                    text: 'Οι βαθμοί πρέπει να είναι αριθμοί μεταξύ 1 και 10.',
                });
                return;
            }


            // calculate final grade
            const grade = calculateGrade(qualityGrade, timeGrade, completenessGrade, presentationGrade);
            console.log(grade);


            fetch('./php/updateGrade.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    thesis_id: row.thesis_id,
                    grade: grade,
                    role: row.role
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Επιτυχία',
                            text: 'Οι βαθμοί καταχωρήθηκαν με επιτυχία.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Σφάλμα',
                            text: data.message,
                        });
                    }
                })
                .catch(error => {
                    console.error('Fetch Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Σφάλμα',
                        text: 'Προέκυψε απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά.',
                    });
                });
        }

        if (event.target && event.target.id === 'examinationReportBtn') {
            event.preventDefault(); // Prevent default form submission

            const fileInput = document.getElementById('file');

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append("thesis_id", row.thesis_id); // Pass thesis ID to the server
            formData.append("file", file);
            formData.append("column_name", "examination_report_file_name");
            formData.append("column_path", "examination_report_file_path");

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
    return html.join('');
}

/**
 * Add buttons dynamically based on the thesis status.
 * @param {any} value - Unused
 * @param {Object} row - Row data
 * @returns {string} - HTML buttons
 */
function operateFormatter(value, row) {
    let buttons = '';
    // Do not display any buttons if the status is "Ακυρωμένη"
    if (row.status === "Ακυρωμένη") {
        return ''; // Return an empty string
    }
    // Get the date of "Δημιουργήθηκε" status change
    if (row.status_changes && row.status_changes.length > 0 && row.status === "Ενεργή" && row.role === "Επιβλέπων") {
        const createdStatus = row.status_changes.find(change => change.status_change === "Ενεργή");
        if (createdStatus) {
            const createdAt = new Date(createdStatus.changed_at);
            const currentDate = new Date();
            const yearsDifference = (currentDate - createdAt) / (1000 * 60 * 60 * 24 * 365); // Calculate year difference

            // If more than 1 year has passed, show the "Ακύρωση" button
            if (yearsDifference > 1) {
                buttons += '<button class="cancelThesis btn btn-danger" data-thesis-id="${row.thesis_id}">Ακύρωση</button>';
            }
        }
    }

    // Check if the status is "Ενεργή" to display the "Υπό Εξέταση" button
    if (row.status === "Ενεργή" && row.role === "Επιβλέπων") {
        buttons += '<button class="thesisStatusChange btn btn-primary" data-bs-toggle="modal" data-bs-target="#assignThesisModal">Υπό Εξέταση</button>';
    } else {
        buttons += '<button class="thesisStatusChange btn btn-primary" data-bs-toggle="modal" data-bs-target="#assignThesisModal" disabled>Υπό Εξέταση</button>';
    }

    return buttons;
}

/**
 * Handle "Change Status" button click and send a request to the server.
 */
window.operateEvents = {
    'click .thesisStatusChange': function (e, value, row) {
        Swal.fire({
            title: "Είστε σίγουροι;",
            text: "Η κατάσταση της διπλωματικής θα αλλάξει σε 'Υπό Εξέταση'.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ναι!",
            cancelButtonText: "Ακύρωση"
        }).then((result) => {
            if (result.isConfirmed) {
                // Prepare data to send to the server
                const requestData = new URLSearchParams({
                    thesis_id: row.thesis_id, // Get the thesis_id from the row
                    status: "Υπό Εξέταση"
                });

                // Call updateThesisStatus.php
                fetch('./php/updateThesisStatus.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: requestData,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            // Success message
                            Swal.fire({
                                icon: "success",
                                title: "Επιτυχία",
                                text: data.message,
                                timer: 2000
                            }).then(() => location.reload());
                        } else {
                            // Error message
                            Swal.fire({
                                icon: "error",
                                title: "Σφάλμα",
                                text: data.message
                            });
                            console.error("Error:", data.message);
                        }
                    })
                    .catch(error => {
                        // Handle unexpected errors
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
    'click .cancelThesis': function (e, value, row) {
        Swal.fire({
            title: "Είστε σίγουροι;",
            text: "Η διπλωματική εργασία θα ακυρωθεί.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ακύρωση Διπλωματικής",
            cancelButtonText: "Άκυρο"
        }).then((result) => {
            if (result.isConfirmed) {
                // Call cancelThesis.php
                fetch('./php/cancelThesis.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        thesis_id: row.thesis_id
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
                        Swal.fire({
                            icon: "error",
                            title: "Σφάλμα",
                            text: "Προέκυψε απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά."
                        });
                        console.error("Error:", error);
                    });
            }
        });
    }
};

/**
 * applyFilters Function
 * Anonymous function expression
 * 
 * This function filters the table data based on selected filter criteria for 'status' and 'role'.
 * It uses the 'filterBy' method provided by the Bootstrap Table library with a custom filterAlgorithm.
 *
 * Key Details:
 * - statusValue: Selected value for the 'status' filter.
 * - roleValue: Selected value for the 'role' filter.
 * - filterAlgorithm: A callback function that determines whether a row matches the filter criteria.
 *      - statusMatch: Passes if no 'status' filter is selected or the row's status matches the selected value.
 *      - roleMatch: Passes if no 'role' filter is selected or the row's role matches the selected value.
 * - Rows are included in the filtered results only if both statusMatch and roleMatch are true.
 *
 * This function applies the filter to the table without directly modifying the original data.
 */
const applyFilters = () => {
    const statusValue = statusFilter.value;
    const roleValue = roleFilter.value;

    $table.bootstrapTable('filterBy', {}, {
        filterAlgorithm: (row) => {
            const statusMatch = !statusValue || row.status === statusValue;
            const roleMatch = !roleValue || row.role === roleValue;
            return statusMatch && roleMatch;
        }
    });
};

// Attach filter event listeners
statusFilter.addEventListener("change", applyFilters);
roleFilter.addEventListener("change", applyFilters);

$(function () {
    $('#toolbar').find('select').change(function () {
        $table.bootstrapTable('destroy').bootstrapTable({
            exportDataType: $(this).val(),
            exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
        })
    }).trigger('change')
})

/**
 * Calculate the final grade based on weighted averages.
 */
function calculateGrade(Q, T, C, P) {
    const weightQ = 0.6; // Weight for Quality
    const weightT = 0.15; // Weight for Time
    const weightC = 0.15; // Weight for Completeness
    const weightP = 0.1; // Weight for Presentation

    return (Q * weightQ) + (T * weightT) + (C * weightC) + (P * weightP);
}
