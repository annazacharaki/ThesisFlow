// Load user data from local storage and redirect to the login page if not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    // Redirect to index.html (login page) if no user data is found
    window.location.assign("index.html");
}

// Define paths for different user role-specific navbars
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",
    "Instructor": "./navbar/instructorNavbar.html",
    "Secretariat": "./navbar/secretariatNavbar.html",
};

// Check if the logged-in user's role exists in the navbarPaths object
if (loggedUser.role in navbarPaths) {
    // Dynamically load the appropriate navbar using jQuery's load() method
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]);
}

// Load a common footer dynamically into the footer placeholder
$("#footer-placeholder").load("footer.html");

/**
 * Function to process the uploaded JSON file and display its data
 */
function processFile() {
    // Retrieve the file input element by its ID
    const fileInput = document.getElementById('jsonFileInput');

    // Check if the user has selected a file
    if (fileInput.files.length === 0) {
        Swal.fire({
            title: "Παρακαλώ επιλέξτε ένα αρχείο JSON.", // Alert message in Greek
            icon: "warning", // Display a warning icon
        });
        return; // Stop execution if no file is selected
    }

    // Get the first selected file
    const file = fileInput.files[0];
    const reader = new FileReader(); // Initialize a FileReader to read file content

    // Event listener triggered when the file is successfully read
    reader.onload = function (event) {
        try {
            // Parse the file content as JSON
            const jsonData = JSON.parse(event.target.result);

            // Validate that the JSON contains the required keys: 'students' and 'professors'
            if (!jsonData.students || !jsonData.professors) {
                Swal.fire({
                    title: "Λανθασμένη δομή JSON. Βεβαιωθείτε ότι περιέχει πίνακες students και professors.",
                    icon: "error", // Display an error icon
                });
                return; // Stop execution if keys are missing
            }

            // Display the parsed data for students and professors in separate tables
            displayData(jsonData.students, 'studentsDisplay', 'Students');
            displayData(jsonData.professors, 'professorsDisplay', 'Professors');

            // Upload students and professors data to the server
            Promise.all([
                uploadStudents(jsonData.students),
                uploadProfessors(jsonData.professors)
            ])
                .then(results => {
                    const [studentsResult, professorsResult] = results;

                    // Check the results of both uploads
                    if (studentsResult.status === 'success' && professorsResult.status === 'success') {
                        Swal.fire({
                            icon: "success",
                            title: "Όλα τα δεδομένα ανέβηκαν επιτυχώς!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        let errorMessage = "Προέκυψαν τα ακόλουθα σφάλματα:\n";
                        if (studentsResult.status !== 'success') {
                            errorMessage += `Σφάλμα στους φοιτητές: ${studentsResult.message}\n`;
                        }
                        if (professorsResult.status !== 'success') {
                            errorMessage += `Σφάλμα στους καθηγητές: ${professorsResult.message}\n`;
                        }
                        Swal.fire({
                            icon: "error",
                            title: "Αποτυχία στην αποστολή δεδομένων",
                            text: errorMessage,
                        });
                    }
                })
                .catch(error => {
                    // Handle any unexpected errors (e.g., network issues)
                    Swal.fire({
                        icon: "error",
                        title: "Προέκυψε πρόβλημα με το δίκτυο",
                        text: error.message,
                    });
                });
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Σφάλμα στην ανάγνωση του αρχείου JSON",
                text: e.message,
            });
        }
    };

    // Start reading the file as text
    reader.readAsText(file);
}

/**
 * Function to send students' data to the server
 * @param {Array} studentData - Array containing student objects
 * @returns {Promise} - A promise resolving to the server response
 */
function uploadStudents(studentData) {
    const jsonData = JSON.stringify(studentData); // Convert data to JSON string

    // Send a POST request to the server to upload students
    return fetch('./php/insertStudents.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set content type to JSON
        },
        body: jsonData // Attach the JSON string as the request body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json(); // Parse response as JSON
        })
        .catch(error => {
            return { status: 'error', message: error.message }; // Return an error object
        });
}

/**
 * Function to send professors' data to the server
 * @param {Array} instructorData - Array containing professor objects
 * @returns {Promise} - A promise resolving to the server response
 */
function uploadProfessors(instructorData) {
    const jsonData = JSON.stringify(instructorData); // Convert data to JSON string

    // Send a POST request to the server to upload professors
    return fetch('./php/insertInstructors.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json(); // Parse response as JSON
        })
        .catch(error => {
            return { status: 'error', message: error.message }; // Return an error object
        });
}

/**
 * Function to display data in a table format
 * @param {Array} data - Array of objects to display in the table
 * @param {string} containerId - ID of the container where the table will be inserted
 * @param {string} dataType - A label for the type of data (e.g., "Students", "Professors")
 */
function displayData(data, containerId, dataType) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear any existing content in the container

    // If the data is empty or not an array, display a message
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<p class="text-center">Δεν υπάρχουν δεδομένα ${dataType}.</p>`;
        return;
    }

    // Create the table element and add Bootstrap styling classes
    const table = document.createElement('table');
    table.className = 'table table-bordered table-striped';

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value !== null ? value : '-'; // Replace null values with "-"
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to the container
    container.appendChild(table);
}
