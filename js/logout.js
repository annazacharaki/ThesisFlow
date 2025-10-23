// Add logout functionality
$(document).on('click', '.logout-link', function (event) {
    event.preventDefault();
    localStorage.removeItem("logged_user");
    window.location.href = "index.html";
});