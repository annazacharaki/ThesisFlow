// Load user data from local storage and redirect to login page if not logged in
const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
if (!loggedUser) {
    // Redirect to the login page if there is no user session
    window.location.assign("index.html");
}

// Define paths for user role-specific navigation bars
const navbarPaths = {
    "Student": "./navbar/studentNavbar.html",      // Path for student navigation bar
    "Instructor": "./navbar/instructorNavbar.html", // Path for instructor navigation bar
    "Secretariat": "./navbar/secretariatNavbar.html" // Path for secretariat navigation bar
};

// Check if the logged-in user's role exists in navbarPaths and load the corresponding navbar
if (loggedUser.role in navbarPaths) {
    $("#nav-placeholder").load(navbarPaths[loggedUser.role]); // Load the navbar dynamically using jQuery
}

// Load the footer dynamically into the designated placeholder
$("#footer-placeholder").load("footer.html");

// Get the 2D rendering contexts for the canvas elements to initialize Chart.js
const ctx1 = document.getElementById('timeDifferenceChart').getContext('2d');
const ctx2 = document.getElementById('chart2').getContext('2d');
const ctx3 = document.getElementById('chart3').getContext('2d');

/**
 * Fetch data for "Time Difference" chart from the backend.
 * This uses a POST request to 'selectAvarage.php' to retrieve thesis data.
 */
 
 console.log(loggedUser.entity_id); //debugging
 
fetch('./php/average_completion_time.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ instructor_id: loggedUser.entity_id }), // Send the instructor Id
	
})
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.status === 'success') {
            console.log(data);

            // Create a Bar Chart using Chart.js
            new Chart(ctx1, {
                type: 'bar', // Bar chart type
                data: {
                    labels: ['Supervised Theses', 'Committee Member Theses'], // X-axis labels (thesis IDs)
                    datasets: [{
                        label: 'Time Difference in Days', // Legend label
                        data: [data.avg_supervised_time, data.avg_committee_time], // Y-axis data (time differences)
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1 // Border width of bars
                    }]
                },
                options: {
                    responsive: true, // Make the chart responsive
                    scales: {
                        y: {
                            beginAtZero: true // Y-axis starts at zero
                        }
                    }
                }
            });
        } else {
            console.error('Error fetching data:', data.message); // Log errors if the request fails
        }
    })
    .catch(error => console.error('Fetch Error:', error)); // Log network or fetch errors

/**
 * Chart 2 - Grades Distribution (Pie Chart)
 * Displays a sample distribution of grades using static data.
 */
 
 console.log(loggedUser.entity_id); //debugging
 
 
fetch('./php/average_grade_theses.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ instructor_id: loggedUser.entity_id }), // Send the instructor Id
})
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.status === 'success') {
            console.log(data);

            new Chart(ctx2, {
                type: 'bar', // Bar chart type
                data: {
                    labels: ['Supervised Theses', 'Committee Member Theses'],
                    datasets: [{
                        label: 'Average Grade',
                        data: [data.avg_supervised_grade, data.avg_committee_grade],
                        backgroundColor: [
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // Make the chart responsive
                    plugins: {
                        legend: { position: 'top' } // Place the legend at the top
                    }
                }
            });

        } else {
            console.error('Error fetching data:', data.message); // Log errors if the request fails
        }
    })
    .catch(error => console.error('Fetch Error:', error)); // Log network or fetch errors

/**
 * Chart 3 - Thesis Completion Status (Line Chart)
 * Displays the number of completed theses over a six-month period using example static data.
 */

console.log(loggedUser.entity_id); //debugging

fetch('./php/total_theses_count.php', {
    method: 'POST',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ instructor_id: loggedUser.entity_id }), // Send the instructor Id
})
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.status === 'success') {
            console.log(data);

            new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: ['Supervised Theses', 'Committee Member Theses'],
                    datasets: [{
                        label: 'Total Number of Theses',
                        data: [data.total_supervised, data.total_committee],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

        } else {
            console.error('Error fetching data:', data.message); // Log errors if the request fails
        }
    })
    .catch(error => console.error('Fetch Error:', error)); // Log network or fetch errors

