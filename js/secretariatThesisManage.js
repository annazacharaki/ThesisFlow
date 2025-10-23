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

// Global variables
let $table = $('#table'); // Reference to the thesis table
let thesesData; // Stores all thesis data fetched from the backend
const statusFilter = document.getElementById("statusFilter"); // Status filter dropdown

/**
 * Fetch and initialize the table with thesis data.
 */
$(function () {
    fetch('./php/selectSecretariatTheses.php', {
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

function detailFormatter(index, row) {
    const difference = calculateDateDifference(row.changed_at);

    let html = [];
    html.push(`<div class="container">`);

    // Thesis details section
    html.push(`
        <h5>Λεπτομέρειες Πτυχιακής</h5>
        <p><strong>Περιγραφή:</strong> ${row.thesis_description}</p>
        <p><strong>Ενεργή εδώ και:</strong> ${difference.years} years, ${difference.months} months, ${difference.days} days</p>
        <p><strong>Τελικός Βαθμός:</strong> ${row.final_grade !== null ? row.final_grade : "Δεν έχει καταχωρηθεί"}</p>
        <p><strong>Σύνδεσμος:</strong> ${row.nemertis_link !== null ? `<a href="${row.nemertis_link}" target="_blank">Προβολή</a>` : "Δεν υπάρχει διαθέσιμος σύνδεσμος"}</p>
    `);

    // Student details section
    if (row.student) {
        html.push(`
            <h5>Στοιχεία Φοιτητή</h5>
            <p><strong>Όνομα:</strong> ${row.student.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${row.student.email}">${row.student.email}</a></p>
        `);
    }

    // Instructor details section
    html.push(`
        <h5>Στοιχεία Επιβλέποντος</h5>
        <p><strong>Όνομα:</strong> ${row.instructor.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${row.instructor.email}">${row.instructor.email}</a></p>
        <p><strong>Σταθερό:</strong> ${row.instructor.landline}</p>
        <p><strong>Κινητό:</strong> ${row.instructor.mobile}</p>
        <p><strong>Τμήμα:</strong> ${row.instructor.department}</p>
        <p><strong>Πανεπιστήμιο:</strong> ${row.instructor.university}</p>
    `);
    // Committee members section
    html.push(`
        <h5>Μέλη Επιτροπής</h5>
        <div style="display: flex; justify-content: space-between;">
            <div style="flex: 1; margin-right: 10px;">
                <h6>Μέλος Επιτροπής 1</h6>
                <p><strong>Όνομα:</strong> ${row.committee_member_1.name ? row.committee_member_1.name : "Χωρίς Ανάθεση"}</p>
                <p><strong>Email:</strong> ${row.committee_member_1.email ? `<a href="mailto:${row.committee_member_1.email}">${row.committee_member_1.email}</a>` : "Χωρίς Ανάθεση"}</p>
                <p><strong>Σταθερό:</strong> ${row.committee_member_1.landline ? row.committee_member_1.landline : "Χωρίς Ανάθεση"}</p>
                <p><strong>Κινητό:</strong> ${row.committee_member_1.mobile ? row.committee_member_1.mobile : "Χωρίς Ανάθεση"}</p>
                <p><strong>Τμήμα:</strong> ${row.committee_member_1.department ? row.committee_member_1.department : "Χωρίς Ανάθεση"}</p>
                <p><strong>Πανεπιστήμιο:</strong> ${row.committee_member_1.university ? row.committee_member_1.university : "Χωρίς Ανάθεση"}</p>
            </div>
            <div style="flex: 1; margin-left: 10px;">
                <h6>Μέλος Επιτροπής 2</h6>
                <p><strong>Όνομα:</strong> ${row.committee_member_2.name ? row.committee_member_2.name : "Χωρίς Ανάθεση"}</p>
                <p><strong>Email:</strong> ${row.committee_member_2.email ? `<a href="mailto:${row.committee_member_2.email}">${row.committee_member_2.email}</a>` : "Χωρίς Ανάθεση"}</p>
                <p><strong>Σταθερό:</strong> ${row.committee_member_2.landline ? row.committee_member_2.landline : "Χωρίς Ανάθεση"}</p>
                <p><strong>Κινητό:</strong> ${row.committee_member_2.mobile ? row.committee_member_2.mobile : "Χωρίς Ανάθεση"}</p>
                <p><strong>Τμήμα:</strong> ${row.committee_member_2.department ? row.committee_member_2.department : "Χωρίς Ανάθεση"}</p>
                <p><strong>Πανεπιστήμιο:</strong> ${row.committee_member_2.university ? row.committee_member_2.university : "Χωρίς Ανάθεση"}</p>
            </div>
        </div>
    `);

    if (row.thesis_status === 'Ενεργή') {        
        if (!row.GA_number) {
            html.push(`
                <br />
                <strong>Καταχώριση ΑΠ από ΓΣ έγκρισης θέματος</strong>
                <div class="row g-2 align-items-center">
                    <div class="col">
                        <label for="AP_number" class="form-label">Αριθμός Γενικής Συνέλευσης:</label>
                        <input 
                            type="number" class="form-control" id="AP_number" placeholder="Αριθμός Γενικής Συνέλευσης"
                        >
                    </div>
                </div>
                <button 
                    type="submit"
                    class="btn btn-primary mt-2" 
                    id="submit_AP" 
                >
                    Υποβολή
                </button>
                <br />
            `)
        }
        html.push(`
            <br />
            <strong>Ακύρωση Διπλωματικής:</strong>
            <div class="row g-2 align-items-center">
                <div class="col">
                    <label for="NumberGA" class="form-label">Αριθμός Γενικής Συνέλευσης:</label>
                    <input 
                        type="number" 
                        class="form-control" 
                        id="NumberGA" 
                        placeholder="Αριθμός Γενικής Συνέλευσης" 
                    >
                </div>
                <div class="col">
                    <label for="YearGA" class="form-label">Έτος Γενικής Συνέλευσης:</label>
                    <input 
                        type="number" 
                        class="form-control" 
                        id="YearGA" 
                        placeholder="Έτος" 
                    >
                </div>
            </div>
            <button 
                class="btn btn-danger mt-2" 
                id="cancel_thesis" 
                >Ακύρωση Διπλωματικής</button>
            `);
    }
    if (row.thesis_status === 'Υπό Εξέταση' && row.nemertis_link) {
        html.push(`
            <br />
            <p>
                <button 
                    class="btn btn-primary mt-2" 
                    id="finalize_thesis" 
                    >Ολοκλήρωση Διπλωματικής</button>
            </p>
        `);
    }

    document.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'cancel_thesis') {
            const NumberGA = document.querySelector(`#NumberGA`).value;
            const YearGA = document.querySelector('#YearGA').value;

            if (!NumberGA || !YearGA) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Προσοχή',
                    text: 'Πρέπει να συμπληρώσετε όλα τα πεδία.',
                });
                return;
            }
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
                            thesis_id: row.thesis_id,
                            number: NumberGA,
                            year: YearGA
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
        if (event.target && event.target.id === 'finalize_thesis') {
            Swal.fire({
                title: "Είστε σίγουροι;",
                text: "Η διπλωματική εργασία θα Ολοκληρωθεί.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ολοκλήρωση Διπλωματικής",
                cancelButtonText: "Άκυρο"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Call cancelThesis.php
                    fetch('./php/updateThesisStatus.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            thesis_id: row.thesis_id,
                            status: 'Περατωμένη'
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
        if (event.target && event.target.id === 'submit_AP') {

            const AP_number = document.querySelector(`#AP_number`).value;
            if (!AP_number) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Προσοχή',
                    text: 'Πρέπει να συμπληρώσετε όλα τα πεδία.',
                });
                return;
            }
            const formData = new FormData();
            formData.append("thesis_id", row.thesis_id); // Pass thesis ID to the server
            formData.append("GA_number", AP_number);

            // Send the data to the backend PHP script
            fetch("./php/updateAP.php", { // Use the correct script path
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

    html.push(`</div>`);
    return html.join('');
}


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
