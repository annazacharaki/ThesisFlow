// Load user data from local storage and redirect to login page if not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    // Redirect to index.html (login page) if no user session exists
    window.location.assign("index.html");
}

// Define navigation bar paths for different user roles
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",      // Path for students' navbar
    "Instructor": "./navbar/instructorNavbar.html", // Path for instructors' navbar
    "Secretariat": "./navbar/secretariatNavbar.html" // Path for secretariat's navbar
};

// Load the appropriate navbar dynamically based on the user's role
if (loggedUser.role in navbarPaths) {
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]);
}

// Load the footer content dynamically
$("#footer-placeholder").load("footer.html");

// Global variables to store thesis and instructor data
let thesesData = null; // Will store thesis details
let instructorsData = null; // Will store instructors' data
const instructorsDropdown = $("#instructors"); // jQuery reference to instructors dropdown

/**
 * Fetch thesis data for the logged-in student.
 */
fetch('./php/selectStudentThesis.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ student_id: loggedUser.entity_id }) // Send the student ID
})
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        console.log(data.data); // Log the received data for debugging

        thesesData = data.data; // Store thesis data
        renderThesisContent(); // Render thesis details in the UI
    })
    .catch(error => console.error('Error fetching thesis data:', error));

/**
 * Function to dynamically populate the instructors dropdown.
 */
function populateInstructorsDropdown() {
    const select = $("#instructors");

    // Add a placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = "Παρακαλώ επιλέξτε"; // "Please select" placeholder
    placeholderOption.value = ""; // Empty value
    placeholderOption.disabled = true; // Disable selection of placeholder
    placeholderOption.selected = true; // Set it as default selected
    select.append(placeholderOption);

    // Dynamically add instructor options
    instructorsData.forEach(option => {
        const opt = document.createElement('option');
        opt.textContent = option.text; // Display instructor name
        opt.value = option.id; // Use instructor ID as the value
        select.append(opt);
    });

    // Refresh the Bootstrap selectpicker to reflect changes
    select.selectpicker('refresh');
}

// Fetch instructors' data and populate the dropdown menu
fetch('./php/selectInstructors.php')
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        instructorsData = data; // Store instructors' data
        populateInstructorsDropdown(); // Populate dropdown with data
    })
    .catch(error => console.error('Error fetching JSON:', error));

/**
 * Function to render thesis details, committee members, and status sections.
 */
function renderThesisContent() {
    const thesis = thesesData[0]; // Assuming only one thesis for the student
    const thesis_details = document.getElementById('thesis_details');
    const committee_members = document.getElementById('committee_members');
    const status_content = document.getElementById('status_content');
    const wrapper = document.getElementById('select_instructor_wrapper');

    const difference = calculateDateDifference(thesis.changed_at);

    if (!thesis) {
        // Display error message if no thesis data exists
        thesis_details.innerHTML = '<p class="text-danger">No thesis data available.</p>';
        committee_members.innerHTML = '';
        status_content.innerHTML = '';
        return;
    }

    // Render thesis details card
    const thesisDetailsContent = `
        <h5 class="card-title">Στοιχεία Πτυχιακής</h5>
        <div class="card">
            <div class="card-body">
                <p><strong>Θέμα Πτυχιακής:</strong> ${thesis.thesis_title}</p>
                <p><strong>Περιγραφή:</strong> ${thesis.thesis_description}</p>
                <p><strong>Κατάσταση:</strong> ${thesis.status}</p>
                <p><strong>Ενεργή εδώ και:</strong> ${difference.years} years, ${difference.months} months, ${difference.days} days</p>
                <p><strong>Φοιτητής:</strong> ${thesis.assigned_student.student_name}</p>
                <p><strong>Επιβλέπων Καθηγητής:</strong> ${thesis.instructor.name} ${thesis.instructor.surname}</p>
                <p><strong>Email:</strong> ${thesis.instructor.email}</p>
                <p><strong>Τμήμα:</strong> ${thesis.instructor.department}</p>
                <p><strong>Πανεπιστήμιο:</strong> ${thesis.instructor.university}</p>
                <p><strong>Εκτεταμένη Περιγραφή: </strong><a href="${thesis.topic_presentation_file_path}" target="_blank">${thesis.topic_presentation_file_name}</a></p>
            </div>
        </div>
    `;

    // Render committee members
    const committeeMembersContent = `
        <h5 class="card-title">Μέλη Επιτροπής</h5>
        <div class="card">
            <div class="card-body">
                ${renderCommitteeMember(thesis.committee_member_1, "Μέλος Επιτροπής 1")}
                ${renderCommitteeMember(thesis.committee_member_2, "Μέλος Επιτροπής 2")}
            </div>
        </div>
    `;

    // Insert content into their respective DOM elements
    thesis_details.innerHTML = thesisDetailsContent;
    committee_members.innerHTML = committeeMembersContent;

    let content = '';
    if (thesis.status === "Υπό Ανάθεση") {
        // Show instructor dropdown if thesis is "Pending Assignment"
        wrapper.style.display = 'block';
        $('.selectpicker').selectpicker('refresh');
    } else if (thesis.status === "Υπό Εξέταση") {
        // Render inputs for examination details
        if (thesis.final_grade) {
            content = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Υπό Εξέταση</h5>
                            <p><strong>Πρακτικό Εξέτασης: </strong><a href="${thesis.examination_report_file_path}" target="_blank">Πρακτικό Εξέτασης</a></p>
                            <input type="text" id="nemertisInput" class="form-control mb-3" placeholder="Σύνδεσμος για Νημερτής">
                            <button class="btn btn-secondary nemertisButton">Υποβολή</button>
                    </div>
                </div>
            `;
        } else {
            content = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Υπό Εξέταση</h5>
                        <input type="file" id="fileInput" class="form-control mb-3">
                        <button class="btn btn-primary mb-3 fileButton">Upload File</button>
                        <input type="text" id="linkInput" class="form-control mb-3" placeholder="Σύνδεσμος για υλικό">
                        <button class="btn btn-secondary linkButton">Υποβολή</button>
                    </div>
                </div>
            `;
        }
    } else if (thesis.status === "Περατωμένη") {
        // Render "Completed" status details
        content = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Περατωμένη</h5>
                    <p><strong>Τελική Αναφορά:</strong> 
                        <a href="${thesis.examination_report_file_path !== "0" ? thesis.examination_report_file_path : "#"}" target="_blank">
                            Προβολή Αναφοράς Εξέτασης
                        </a>
                    </p>
                </div>
            </div>
        `;
    }


    status_content.innerHTML = content;
    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('fileButton')) {
            // JavaScript to handle the file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append("thesis_id", thesis.thesis_id); // Pass thesis ID to the server
                formData.append("file", file);
                formData.append("column_name", "draft_thesis_file_name");
                formData.append("column_path", "draft_thesis_file_path");

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
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Σφάλμα',
                    text: 'Please select a file before uploading.',
                });
            }
        }
        if (event.target && event.target.classList.contains('nemertisButton')) {
            // JavaScript to handle the link input
            const linkInput = document.getElementById('nemertisInput').value;
            if (linkInput) {
                // Prepare the POST data
                const postData = new URLSearchParams({
                    thesis_id: thesis.thesis_id,
                    column_name: "nemertis_link",
                    link: linkInput
                });

                fetch("./php/updateLink.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: postData.toString()
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
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
                        console.error('Fetch error:', error);
                    });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Σφάλμα',
                    text: 'Please enter a link before submitting.',
                });
            }
        }
        if (event.target && event.target.classList.contains('linkButton')) {
            // JavaScript to handle the link input
            const linkInput = document.getElementById('linkInput').value;
            if (linkInput) {
                // Prepare the POST data
                const postData = new URLSearchParams({
                    thesis_id: thesis.thesis_id,
                    column_name: "material_links",
                    link: linkInput
                });

                fetch("./php/updateLink.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: postData.toString()
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
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
                        console.error('Fetch error:', error);
                    });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Σφάλμα',
                    text: 'Please enter a link before submitting.',
                });
            }
        }
    })

}

/**
 * Render committee member details.
 */
function renderCommitteeMember(member, title) {
    if (!member || !member.id) {
        return `<div class="committee_member"><h6>${title}</h6><p>Δεν έχει οριστεί</p></div>`;
    }
    return `
        <div class="committee_member">
            <h6>${title}</h6>
            <p><strong>Όνομα:</strong> ${member.name} ${member.surname}</p>
            <p><strong>Email:</strong> ${member.email}</p>
        </div>
    `;
}

/**
 * Handle instructor selection submission.
 */
document.getElementById('submitInstructor').addEventListener('click', () => {
    if (!instructorsDropdown.val()) {
        Swal.fire({ icon: "warning", text: "Παρακαλώ επιλέξτε έναν καθηγητή." });
        return;
    }

    fetch('./php/insertCommitteeInvite.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            committee_member_id: instructorsDropdown.val(),
            thesis_id: thesesData[0].thesis_id
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                Swal.fire({ icon: "success", title: "Επιτυχία", timer: 2000 })
                    .then(() => location.reload());
            } else {
                Swal.fire({ icon: "error", text: data.message });
            }
        })
        .catch(error => console.error('Error submitting instructor:', error));
});


function calculateDateDifference(dateString) {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    if (isNaN(inputDate)) {
        return "Invalid date format. Please use 'YYYY-MM-DD HH:mm:ss'.";
    }

    let yearsDifference = currentDate.getFullYear() - inputDate.getFullYear();
    let monthsDifference = currentDate.getMonth() - inputDate.getMonth();
    let daysDifference = currentDate.getDate() - inputDate.getDate();

    // Adjust if the current month is earlier than the input month in the year
    if (monthsDifference < 0) {
        yearsDifference--;
        monthsDifference += 12;
    }

    // Adjust if the current day is earlier than the input day in the month
    if (daysDifference < 0) {
        monthsDifference--;
        const previousMonth = (currentDate.getMonth() - 1 + 12) % 12;
        const daysInPreviousMonth = new Date(currentDate.getFullYear(), previousMonth + 1, 0).getDate();
        daysDifference += daysInPreviousMonth;

        if (monthsDifference < 0) {
            yearsDifference--;
            monthsDifference += 12;
        }
    }

    return {
        years: yearsDifference,
        months: monthsDifference,
        days: daysDifference
    };
}
