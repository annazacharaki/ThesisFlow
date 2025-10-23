-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2024 at 12:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thesisflow`
--
CREATE DATABASE IF NOT EXISTS `thesisflow` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `thesisflow`;

-- --------------------------------------------------------

--
-- Table structure for table `committee_invitations`
--

DROP TABLE IF EXISTS `committee_invitations`;
CREATE TABLE `committee_invitations` (
  `invitation_id` int(11) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `status` enum('Εκκρεμής','Δεκτό','Απορρίφθηκε') NOT NULL DEFAULT 'Εκκρεμής',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `committee_invitations`:
--   `instructor_id`
--       `instructor` -> `instructor_id`
--   `thesis_id`
--       `thesis` -> `thesis_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
CREATE TABLE `instructor` (
  `instructor_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `landline` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `university` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `instructor`:
--

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `note` varchar(300) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `notes`:
--   `instructor_id`
--       `instructor` -> `instructor_id`
--   `thesis_id`
--       `thesis` -> `thesis_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `personnel`
--

DROP TABLE IF EXISTS `personnel`;
CREATE TABLE `personnel` (
  `personnel_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Student','Instructor','Secretariat') NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `secretariat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `personnel`:
--   `student_id`
--       `student` -> `student_id`
--   `instructor_id`
--       `instructor` -> `instructor_id`
--   `secretariat_id`
--       `secretariat` -> `secretariat_id`
--

-- --------------------------------------------------------

--
-- Table structure for table `secretariat`
--

DROP TABLE IF EXISTS `secretariat`;
CREATE TABLE `secretariat` (
  `secretariat_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `landline` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `secretariat`:
--

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `student_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `student_number` int(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `number` int(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `postcode` int(255) NOT NULL,
  `father_name` varchar(255) NOT NULL,
  `landline_telephone` varchar(255) NOT NULL,
  `mobile_telephone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `student`:
--

-- --------------------------------------------------------

--
-- Table structure for table `thesis`
--

DROP TABLE IF EXISTS `thesis`;
CREATE TABLE `thesis` (
  `thesis_id` int(255) NOT NULL,
  `instructor_id` int(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `topic_presentation_file_name` varchar(255) DEFAULT NULL,
  `topic_presentation_file_path` varchar(255) DEFAULT NULL,
  `draft_thesis_file_name` varchar(255) DEFAULT NULL,
  `draft_thesis_file_path` varchar(255) DEFAULT NULL,
  `examination_report_file_name` varchar(255) DEFAULT NULL,
  `examination_report_file_path` varchar(255) DEFAULT NULL,
  `assigned_student` int(255) DEFAULT NULL,
  `committee_member_1` int(255) DEFAULT NULL,
  `committee_member_2` int(255) DEFAULT NULL,
  `status` enum('Ενεργή','Περατωμένη','Ακυρωμένη','Υπό Ανάθεση','Υπό Εξέταση','') NOT NULL DEFAULT 'Υπό Ανάθεση',
  `final_grade` decimal(4,2) DEFAULT NULL CHECK (`final_grade` between 1 and 10),
  `instructor_grade` decimal(4,2) DEFAULT NULL CHECK (`instructor_grade` between 1 and 10),
  `committee_member_1_grade` decimal(4,2) DEFAULT NULL CHECK (`committee_member_1_grade` between 1 and 10),
  `committee_member_2_grade` decimal(4,2) DEFAULT NULL CHECK (`committee_member_2_grade` between 1 and 10),
  `nemertis_link` varchar(2083) DEFAULT NULL,
  `material_links` varchar(255) DEFAULT NULL,
  `GA_year` int(4) DEFAULT NULL,
  `GA_number` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `thesis`:
--   `committee_member_1`
--       `instructor` -> `instructor_id`
--   `committee_member_2`
--       `instructor` -> `instructor_id`
--   `assigned_student`
--       `student` -> `student_id`
--   `instructor_id`
--       `instructor` -> `instructor_id`
--

--
-- Triggers `thesis`
--
DROP TRIGGER IF EXISTS `thesis_insert_trigger`;
DELIMITER $$
CREATE TRIGGER `thesis_insert_trigger` AFTER INSERT ON `thesis` FOR EACH ROW BEGIN
    -- Insert a record into thesis_status_history for new thesis creation
    INSERT INTO thesis_status_history (thesis_id, status_change, changed_at)
    VALUES (NEW.thesis_id, 'Δημιουργήθηκε', NOW());
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `thesis_status_change_trigger`;
DELIMITER $$
CREATE TRIGGER `thesis_status_change_trigger` AFTER UPDATE ON `thesis` FOR EACH ROW BEGIN
    DECLARE status_change VARCHAR(255);
    
    -- Determine the details of the change
    IF OLD.status <> NEW.status THEN
      SET status_change = NEW.status;
    ELSEIF (NEW.description IS NOT NULL AND OLD.description IS NULL) OR OLD.description <> NEW.description THEN 
      SET status_change = 'Περιγραφή Ενημερώθηκε';
    ELSEIF (NEW.topic_presentation_file_name IS NOT NULL AND OLD.topic_presentation_file_name IS NULL) OR OLD.topic_presentation_file_name <> NEW.topic_presentation_file_name THEN 
      SET status_change = 'Αναλυτική Παρουσίαση Ενημερώθηκε';
    ELSEIF (NEW.draft_thesis_file_name IS NOT NULL AND OLD.draft_thesis_file_name IS NULL) OR OLD.draft_thesis_file_name <> NEW.draft_thesis_file_name THEN 
      SET status_change = 'Πρόχειρο Κείμενο Διπλωματικής Ενημερώθηκε';
    ELSEIF (NEW.examination_report_file_name IS NOT NULL AND OLD.examination_report_file_name IS NULL) OR OLD.examination_report_file_name <> NEW.examination_report_file_name THEN 
      SET status_change = 'Πρακτικού Εξέτασης Ενημερώθηκε';
    ELSEIF (NEW.assigned_student IS NOT NULL AND OLD.assigned_student IS NULL) THEN 
      SET status_change = 'Ανατέθηκε';
    ELSEIF (NEW.assigned_student IS NULL AND OLD.assigned_student IS NOT NULL) THEN 
      SET status_change = 'Ανάθεση Αφαιρέθηκε';
    ELSEIF OLD.assigned_student <> NEW.assigned_student THEN
      SET status_change = 'Ανάθεση Ενημερώθηκε';
    ELSEIF (NEW.committee_member_1 IS NOT NULL AND OLD.committee_member_1 IS NULL) THEN 
      SET status_change = 'Επιτροπή Ενημερώθηκε';
    ELSEIF (NEW.committee_member_2 IS NOT NULL AND OLD.committee_member_2 IS NULL) THEN 
      SET status_change = 'Επιτροπή Ενημερώθηκε';
    ELSEIF OLD.committee_member_1 <> NEW.committee_member_1 OR OLD.committee_member_2 <> NEW.committee_member_2 THEN
      SET status_change = 'Επιτροπή Ενημερώθηκε';
    ELSEIF (NEW.final_grade IS NOT NULL AND OLD.final_grade IS NULL) OR OLD.final_grade <> NEW.final_grade THEN
      SET status_change = 'Τελικός Βαθμός Αναρτήθηκε';
    ELSEIF (NEW.instructor_grade IS NOT NULL AND OLD.instructor_grade IS NULL) OR OLD.instructor_grade <> NEW.instructor_grade THEN 
      SET status_change = 'Βαθμός Επιτηρητή Αναρτήθηκε';
    ELSEIF (NEW.committee_member_1_grade IS NOT NULL AND OLD.committee_member_1_grade IS NULL) OR OLD.committee_member_1_grade <> NEW.committee_member_1_grade THEN 
      SET status_change = 'Βαθμός Επιτροπής Αναρτήθηκε';
    ELSEIF (NEW.committee_member_2_grade IS NOT NULL AND OLD.committee_member_2_grade IS NULL) OR OLD.committee_member_2_grade <> NEW.committee_member_2_grade THEN 
      SET status_change = 'Βαθμός Επιτροπής Αναρτήθηκε';
    ELSEIF (NEW.nemertis_link IS NOT NULL AND OLD.nemertis_link IS NULL) OR OLD.nemertis_link <> NEW.nemertis_link THEN
      SET status_change = 'Σύνδεσμος Νημερτή Ενημερώθηκε';
    ELSE
      SET status_change = 'Άλλο';
    END IF;
    
    -- Insert a new record into the thesis_status_history table
    INSERT INTO thesis_status_history (thesis_id, status_change, changed_at)
    VALUES (NEW.thesis_id, status_change, NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `thesis_status_history`
--

DROP TABLE IF EXISTS `thesis_status_history`;
CREATE TABLE `thesis_status_history` (
  `change_id` int(11) NOT NULL,
  `thesis_id` int(11) NOT NULL,
  `status_change` varchar(255) NOT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `thesis_status_history`:
--   `thesis_id`
--       `thesis` -> `thesis_id`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `committee_invitations`
--
ALTER TABLE `committee_invitations`
  ADD PRIMARY KEY (`invitation_id`),
  ADD KEY `instructor_id` (`instructor_id`),
  ADD KEY `thesis_id` (`thesis_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`instructor_id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `fk_notes_thesis` (`thesis_id`),
  ADD KEY `fk_notes_instructor` (`instructor_id`);

--
-- Indexes for table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`personnel_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `instructor_id` (`instructor_id`),
  ADD KEY `secretariat_id` (`secretariat_id`);

--
-- Indexes for table `secretariat`
--
ALTER TABLE `secretariat`
  ADD PRIMARY KEY (`secretariat_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `thesis`
--
ALTER TABLE `thesis`
  ADD PRIMARY KEY (`thesis_id`),
  ADD UNIQUE KEY `assigned_student` (`assigned_student`),
  ADD KEY `instructor_id` (`instructor_id`),
  ADD KEY `fk_committee_member_1` (`committee_member_1`),
  ADD KEY `fk_committee_member_2` (`committee_member_2`);

--
-- Indexes for table `thesis_status_history`
--
ALTER TABLE `thesis_status_history`
  ADD PRIMARY KEY (`change_id`),
  ADD KEY `thesis_id` (`thesis_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `committee_invitations`
--
ALTER TABLE `committee_invitations`
  MODIFY `invitation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `instructor_id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `personnel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `secretariat`
--
ALTER TABLE `secretariat`
  MODIFY `secretariat_id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thesis`
--
ALTER TABLE `thesis`
  MODIFY `thesis_id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thesis_status_history`
--
ALTER TABLE `thesis_status_history`
  MODIFY `change_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `committee_invitations`
--
ALTER TABLE `committee_invitations`
  ADD CONSTRAINT `committee_invitations_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `committee_invitations_ibfk_2` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`thesis_id`) ON DELETE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `fk_notes_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_notes_thesis` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`thesis_id`) ON DELETE CASCADE;

--
-- Constraints for table `personnel`
--
ALTER TABLE `personnel`
  ADD CONSTRAINT `personnel_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `personnel_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `personnel_ibfk_3` FOREIGN KEY (`secretariat_id`) REFERENCES `secretariat` (`secretariat_id`) ON DELETE SET NULL;

--
-- Constraints for table `thesis`
--
ALTER TABLE `thesis`
  ADD CONSTRAINT `fk_committee_member_1` FOREIGN KEY (`committee_member_1`) REFERENCES `instructor` (`instructor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_committee_member_2` FOREIGN KEY (`committee_member_2`) REFERENCES `instructor` (`instructor_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_thesis_student` FOREIGN KEY (`assigned_student`) REFERENCES `student` (`student_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `thesis_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`) ON DELETE CASCADE;

--
-- Constraints for table `thesis_status_history`
--
ALTER TABLE `thesis_status_history`
  ADD CONSTRAINT `thesis_status_history_ibfk_1` FOREIGN KEY (`thesis_id`) REFERENCES `thesis` (`thesis_id`) ON DELETE CASCADE;


--
-- Metadata
--
USE `thesisflow`;

--
-- Metadata for table committee_invitations
--

--
-- Metadata for table instructor
--

--
-- Metadata for table notes
--

--
-- Metadata for table personnel
--

--
-- Dumping data for table `pma__table_uiprefs`
--

-- INSERT DELAYED INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'thesisflow', 'personnel', '{\"sorted_col\":\"`instructor_id` ASC\"}', '2024-12-30 10:54:35');

--
-- Metadata for table secretariat
--

--
-- Metadata for table student
--

--
-- Metadata for table thesis
--

--
-- Metadata for table thesis_status_history
--

--
-- Metadata for database thesisflow
--
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
