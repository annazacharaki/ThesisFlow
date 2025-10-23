# ThesisFlow
ThesisFlow: Thesis Management Support System

Team Members: 
evelinastavropoulou
annazacharaki

A complete web-based application developed for managing the full lifecycle of thesis projects in an academic environment. The project was created as part of the "Programming & Systems on the World Wide Web" course (University of Patras, CEID, Academic Year 2024–2025).

🎯 Overview

ThesisFlow supports the end-to-end process of thesis management, from topic creation and student assignment to evaluation and completion. It provides dedicated interfaces for Students, Instructors, and the Secretariat, ensuring role-based interaction and workflow automation.

The application digitizes traditional administrative tasks such as topic registration, committee formation, document sharing, grading, and archival, making the thesis process transparent, organized, and efficient.

👥 User Roles & Functionalities
🧑‍🏫 Instructor

Create and manage thesis topics (title, description, PDF attachment)

Assign topics to students via search by student ID or name

View all active, under-assignment, or completed theses

Accept or reject invitations to join committees

Record grades and track progress history

View personal statistics (average grade, completion time, etc.)

Export thesis data in CSV or JSON formats

🎓 Student

View assigned or available thesis topics with details and attached files

Edit and manage personal contact information

Invite instructors to form a three-member committee

Upload thesis drafts and relevant material (PDFs, links, repositories)

Schedule presentation details and upload the final thesis repository link (Nimertis)

View grading and final reports after completion

🏢 Secretariat

Access and manage all active or under-review theses

Import user data (students and instructors) from JSON files

Record General Assembly approval numbers (GA number/year)

Finalize or cancel thesis assignments

Update thesis status to "Completed"

⚙️ System Workflow Example

An instructor logs in, creates a new thesis topic, and assigns it to a student.

The student invites additional instructors to form a three-member committee.

Invited instructors accept or decline the invitation.

When two members accept, the thesis becomes Active.

The student uploads draft documents and schedules the defense date.

Each committee member reviews and records grades.

The secretariat finalizes and archives the thesis as Completed.

🧱 Database Schema

ThesisFlow uses a MySQL relational database, designed with normalization and indexing to ensure efficient queries. The schema includes:

student – Stores student details and contact information.

instructor – Stores instructor profiles and associated topics.

thesis – Core table representing each thesis, including assigned student, committee members, grades, and status.

committee_invitations – Tracks invitations and responses from instructors.

notes – Allows instructors to log private progress notes.

secretariat – Manages secretariat user information.

personnel – Centralized authentication table (Student / Instructor / Secretariat).

thesis_status_history – Logs all changes in thesis status with timestamps.

🧩 Triggers

Two main MySQL triggers automate status tracking:

thesis_insert_trigger – Creates a status log when a new thesis is added.

thesis_status_change_trigger – Records all subsequent status changes (assignment, updates, grading, etc.).

🧰 Technologies Used
Layer	Technologies
Front-End	HTML5, CSS3, JavaScript (AJAX), Bootstrap
Back-End	PHP 8.2, MySQL (MariaDB 10.4)
Visualization	Chart.js for statistical graphs
Data Import	JSON parsing for bulk uploads
PDF Tools (optional)	jsPDF / pdfmake for report generation
🧭 System Features

Secure login/logout mechanism for all user types.

Role-based access control (no content visible without authentication).

Dynamic AJAX data loading to avoid full page reloads.

Export options for data in machine-readable formats (CSV, JSON).

Public endpoint for thesis defense announcements (XML/JSON feed).

Responsive and mobile-friendly user interface.

Trigger-based audit trail for all thesis status transitions.
