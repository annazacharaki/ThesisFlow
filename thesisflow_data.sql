-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2025 at 12:24 PM
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
-- Dumping data for table `committee_invitations`
--

INSERT INTO `committee_invitations` (`invitation_id`, `instructor_id`, `thesis_id`, `status`, `created_at`, `updated_at`) VALUES
(5, 9, 13, 'Απορρίφθηκε', '2024-12-30 10:49:25', '2024-12-30 10:54:09'),
(6, 29, 13, 'Δεκτό', '2024-12-30 10:49:37', '2024-12-30 10:54:50'),
(7, 23, 13, 'Δεκτό', '2024-12-30 10:49:46', '2024-12-30 10:55:11');

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
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`instructor_id`, `name`, `surname`, `email`, `topic`, `landline`, `mobile`, `department`, `university`) VALUES
(1, 'Andreas', 'Komninos', 'akomninos@ceid.upatras.gr', 'Network-centric systems', '2610996915', '6977998877', 'CEID', 'University of Patras'),
(7, 'Vasilis', 'Foukaras', 'vasfou@ceid.upatras.gr', 'Integrated Systems', '2610885511', '6988812345', 'CEID', 'University of Patras'),
(8, 'Basilis', 'Karras', 'karras@nterti.com', 'Artificial Intelligence', '23', '545', 'CEID', 'University of Patras'),
(9, 'Eleni', 'Voyiatzaki', 'eleni@ceid.gr', 'WEB', '34', '245', 'CEID', 'University of Patras'),
(10, 'Andrew', 'Hozier Byrne', 'hozier@ceid.upatras.gr', 'Artificial Intelligence', '2610170390', '6917031990', 'CEID', 'University of Patras'),
(11, 'Nikos', 'Korobos', 'nikos.korobos12@gmail.com', 'Data Engineering', '2610324365', '6978530352', 'IT', 'University of Patras'),
(12, 'Kostas', 'Karanikolos', 'kostkaranik@gmail.com', 'informatics', '2610324242', '6934539920', 'CEID', 'University of Patras'),
(13, 'Mpampis', 'Sougias', 'mpampis123@gmail.com', 'Arxeologia', '2610945934', '6947845334', 'Arxeologias', 'UOI'),
(14, 'Daskalos', 'Makaveli', 'makavelibet@gmail.com', 'Business', '2310231023', '6929349285', 'Economics', 'UOA'),
(15, 'Maria', 'Palami', 'palam@upatras.gr', 'SQL injections', '1234567890', '6988223322', 'Engineering', 'University of SKG'),
(16, 'Meni', 'Talaiporimeni', 'meniT@upatras.gr', 't', '2610333999', '6999990999', 'CEID', 'UoP'),
(17, 'Tzouli', 'Alexandratou', 'tzouli.ax@upatras.gr', 'Big Data', '2264587412', '6996116921', 'CEID', 'University of Patras'),
(18, 'Karikhs', 'Raftel', 'karikhs@yahoo.gr', 'Pharmaceutical Drugs', '69', '6945258923', 'Chemistry', 'University of Streets'),
(19, 'Vlasis', 'Restas', 'toxrusoftiari@funerals.gr', 'Nekro8aftiki', '78696910', '69696964', 'Nekro8aftikis', 'University Of Ohio'),
(20, 'Fat ', 'Banker', 'fatbanker@kapitalas.gr', 'kippah', '6942014121', '6969784205', 'Froutemporiki', 'University of Israel'),
(21, 'Hamze', 'Mohamed', 'info@hamzat.gr', 'Logistics', '1245789513', '1456983270', 'Social Rehabitation', 'University of UAE'),
(22, 'Stefania', 'Nikolaou', 'snikolaou@upatras.gr', 'Information Theory', '2106723456', '6942323452', 'ECE', 'University of Patras'),
(23, 'Petros', 'Danezis', 'pdanezis@upatras.gr', 'Telecommunication Electronics', '2610908888', '6971142424', 'ECE', 'University of Patras	'),
(24, 'Papadopoulos ', 'Eustathios', 'eustratiospap@gmail.com', 'Physics', '210-1234567', '690-1234567', 'Physics', 'National and Kapodistrian University of Athens'),
(25, 'Konstantinou', 'Maria', 'mariakon@gmail.com', 'Statistics and Probability', '2310-7654321', '694-7654321', 'Mathematics', 'Aristotle University of Thessaloniki'),
(26, 'Jim', 'Nikolaou', 'jimnik@gmail.com', 'Artificial Intelligence', '2610-9876543', '697-9876543', 'Computer Science', 'University of Patras'),
(27, 'Sophia', 'Michailidi', 'sophiamich@gmail.com', 'Economic Theory', '2310-5432109', '698-5432109', 'Economics', 'Athens University of Economics and Business'),
(28, 'Michael ', 'Papadreou', 'michaelpap@gmail.com', 'Renewable Energy Systems', '2610-4455667', '697-4455667', 'Electrical Engineering', 'University of Ioannina'),
(29, 'Elon', 'Musk', 'elonmusk@gmail.com', 'Electric Vehicles', '1-888-518-3752', 'Null', 'Department of Physics', 'University of Pennsylvania, Philadelphia'),
(30, 'Kostas', 'Kalantas', 'abcdef@example.com', 'AI', '2610121212', '6912121212', 'department', 'University'),
(32, 'Giorgis', 'Fousekis', 'abcdefg@example.com', 'topic', 'land', 'mob', 'dep', 'university'),
(33, 'Nikos', 'Koukos', 'exxample@example.com', 'top', 'la', 'mo', 'de', 'university'),
(34, 'patrick', 'xrusopsaros', 'patric@xrusopsaros.com', 'thalasioi ipopotamoi', '2610567917', '6952852742', 'Solomos', 'Nemo'),
(35, 'Paraskevas', 'koutsikos', 'paraskevas@kobres.ath', 'Provata', '2298042035', '6969696969', 'Ktinotrofia', 'University of Methana'),
(36, 'Ezio', 'Auditore da Firenze', 'masterassassin@upatras.ceid.gr', 'assassinations', 'null', 'null', 'Monterigioni', 'University of Assasinos'),
(37, 'Sotiris', 'Panaikas', 'spana@hotmail.com', 'Bet Predictions', '1235654899', '2310521010', 'opap', 'London'),
(38, 'Anitta', 'Wynn', 'anittamaxwynn@cashmoney.com', 'Probability', '2610486396', '698888884', 'Computer Engineering', 'University of Beegwean');

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
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`note_id`, `thesis_id`, `instructor_id`, `note`, `date`) VALUES
(4, 13, 15, 'asdpfiuidfg', '2024-12-30 10:56:26'),
(5, 13, 15, 'asdfasdf', '2024-12-30 10:56:30'),
(6, 13, 15, 'sagfdhsg', '2024-12-30 10:56:36'),
(7, 13, 15, 'sljdflkjdsgf', '2024-12-30 10:57:16'),
(8, 13, 15, 'asfgsaf', '2024-12-30 10:57:18');

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
-- Dumping data for table `personnel`
--

INSERT INTO `personnel` (`personnel_id`, `username`, `password`, `role`, `student_id`, `instructor_id`, `secretariat_id`) VALUES
(1, 'apapadopoulou', 'default_password', 'Secretariat', NULL, NULL, 1),
(2, 'gnikolaidis', 'default_password', 'Secretariat', NULL, NULL, 2),
(3, 'mioannidou', 'default_password', 'Secretariat', NULL, NULL, 3),
(4, 'ekarapanou', 'default_password', 'Secretariat', NULL, NULL, 4),
(5, 'kzervas', 'default_password', 'Secretariat', NULL, NULL, 5),
(6, 'spetropoulou', 'default_password', 'Secretariat', NULL, NULL, 6),
(7, '10433999', 'default_password', 'Student', 1, NULL, NULL),
(8, 'akomninos', 'default_password', 'Instructor', NULL, 1, NULL),
(9, '10434000', 'default_password', 'Student', 5, NULL, NULL),
(10, 'vasfou', 'default_password', 'Instructor', NULL, 7, NULL),
(11, '10434001', 'default_password', 'Student', 6, NULL, NULL),
(12, 'karras', 'default_password', 'Instructor', NULL, 8, NULL),
(13, '10434002', 'default_password', 'Student', 7, NULL, NULL),
(14, 'eleni', 'default_password', 'Instructor', NULL, 9, NULL),
(15, '10434003', 'default_password', 'Student', 8, NULL, NULL),
(16, 'hozier', 'default_password', 'Instructor', NULL, 10, NULL),
(17, '10434004', 'default_password', 'Student', 9, NULL, NULL),
(18, 'nikos.korobos12', 'default_password', 'Instructor', NULL, 11, NULL),
(19, '10434005', 'default_password', 'Student', 10, NULL, NULL),
(20, 'kostkaranik', 'default_password', 'Instructor', NULL, 12, NULL),
(21, '10434006', 'default_password', 'Student', 11, NULL, NULL),
(22, 'mpampis123', 'default_password', 'Instructor', NULL, 13, NULL),
(23, '10434007', 'default_password', 'Student', 12, NULL, NULL),
(24, 'makavelibet', 'default_password', 'Instructor', NULL, 14, NULL),
(25, '10434008', 'default_password', 'Student', 13, NULL, NULL),
(26, 'palam', 'default_password', 'Instructor', NULL, 15, NULL),
(27, '10434009', 'default_password', 'Student', 14, NULL, NULL),
(28, 'meniT', 'default_password', 'Instructor', NULL, 16, NULL),
(29, '10434010', 'default_password', 'Student', 15, NULL, NULL),
(30, '10434011', 'default_password', 'Student', 16, NULL, NULL),
(31, 'tzouli.ax', 'default_password', 'Instructor', NULL, 17, NULL),
(32, '10434012', 'default_password', 'Student', 17, NULL, NULL),
(33, 'karikhs', 'default_password', 'Instructor', NULL, 18, NULL),
(34, '10434013', 'default_password', 'Student', 18, NULL, NULL),
(35, 'toxrusoftiari', 'default_password', 'Instructor', NULL, 19, NULL),
(36, '10434014', 'default_password', 'Student', 19, NULL, NULL),
(37, 'fatbanker', 'default_password', 'Instructor', NULL, 20, NULL),
(38, '10434015', 'default_password', 'Student', 20, NULL, NULL),
(39, 'info', 'default_password', 'Instructor', NULL, 21, NULL),
(40, '10434016', 'default_password', 'Student', 21, NULL, NULL),
(41, 'snikolaou', 'default_password', 'Instructor', NULL, 22, NULL),
(42, '10434017', 'default_password', 'Student', 22, NULL, NULL),
(43, '10434018', 'default_password', 'Student', 23, NULL, NULL),
(44, 'pdanezis', 'default_password', 'Instructor', NULL, 23, NULL),
(45, '10434019', 'default_password', 'Student', 24, NULL, NULL),
(46, 'eustratiospap', 'default_password', 'Instructor', NULL, 24, NULL),
(47, '10434020', 'default_password', 'Student', 25, NULL, NULL),
(48, 'mariakon', 'default_password', 'Instructor', NULL, 25, NULL),
(49, '10434021', 'default_password', 'Student', 26, NULL, NULL),
(50, 'jimnik', 'default_password', 'Instructor', NULL, 26, NULL),
(51, '10434022', 'default_password', 'Student', 27, NULL, NULL),
(52, 'sophiamich', 'default_password', 'Instructor', NULL, 27, NULL),
(53, '10434023', 'default_password', 'Student', 28, NULL, NULL),
(54, 'michaelpap', 'default_password', 'Instructor', NULL, 28, NULL),
(55, '10434024', 'default_password', 'Student', 29, NULL, NULL),
(56, 'elonmusk', 'default_password', 'Instructor', NULL, 29, NULL),
(57, '10434025', 'default_password', 'Student', 30, NULL, NULL),
(58, 'abcdef', 'default_password', 'Instructor', NULL, 30, NULL),
(59, '10434026', 'default_password', 'Student', 31, NULL, NULL),
(60, 'abcdefg', 'default_password', 'Instructor', NULL, 32, NULL),
(61, '10434027', 'default_password', 'Student', 32, NULL, NULL),
(62, 'exxample', 'default_password', 'Instructor', NULL, 33, NULL),
(63, '10434028', 'default_password', 'Student', 33, NULL, NULL),
(64, 'patric', 'default_password', 'Instructor', NULL, 34, NULL),
(65, '10434029', 'default_password', 'Student', 34, NULL, NULL),
(66, 'paraskevas', 'default_password', 'Instructor', NULL, 35, NULL),
(67, '10434030', 'default_password', 'Student', 35, NULL, NULL),
(68, 'masterassassin', 'default_password', 'Instructor', NULL, 36, NULL),
(69, '10434031', 'default_password', 'Student', 36, NULL, NULL),
(70, 'spana', 'default_password', 'Instructor', NULL, 37, NULL),
(71, '10434032', 'default_password', 'Student', 37, NULL, NULL),
(72, '10434033', 'default_password', 'Student', 38, NULL, NULL),
(73, '10434034', 'default_password', 'Student', 39, NULL, NULL),
(74, '10434035', 'default_password', 'Student', 40, NULL, NULL),
(75, '10434036', 'default_password', 'Student', 41, NULL, NULL),
(76, '10434037', 'default_password', 'Student', 42, NULL, NULL),
(77, '10434038', 'default_password', 'Student', 44, NULL, NULL),
(78, '10434039', 'default_password', 'Student', 46, NULL, NULL),
(79, '10434040', 'default_password', 'Student', 47, NULL, NULL),
(80, '10434041', 'default_password', 'Student', 48, NULL, NULL),
(81, '10434042', 'default_password', 'Student', 49, NULL, NULL),
(82, '10434043', 'default_password', 'Student', 50, NULL, NULL),
(83, '10434044', 'default_password', 'Student', 51, NULL, NULL),
(84, '10434045', 'default_password', 'Student', 52, NULL, NULL),
(85, '10434046', 'default_password', 'Student', 53, NULL, NULL),
(86, '10434047', 'default_password', 'Student', 54, NULL, NULL),
(87, '10434048', 'default_password', 'Student', 55, NULL, NULL),
(88, '10434049', 'default_password', 'Student', 56, NULL, NULL),
(89, '10434050', 'default_password', 'Student', 57, NULL, NULL),
(90, '10434051', 'default_password', 'Student', 58, NULL, NULL),
(91, '10434052', 'default_password', 'Student', 59, NULL, NULL),
(92, '10434053', 'default_password', 'Student', 60, NULL, NULL),
(93, '10434054', 'default_password', 'Student', 61, NULL, NULL),
(94, '10434055', 'default_password', 'Student', 62, NULL, NULL),
(95, '10434056', 'default_password', 'Student', 63, NULL, NULL),
(96, '10434057', 'default_password', 'Student', 64, NULL, NULL),
(97, '10434058', 'default_password', 'Student', 65, NULL, NULL),
(98, '10434059', 'default_password', 'Student', 66, NULL, NULL),
(99, '10434060', 'default_password', 'Student', 67, NULL, NULL),
(100, '10434061', 'default_password', 'Student', 68, NULL, NULL),
(101, '10434062', 'default_password', 'Student', 69, NULL, NULL),
(102, '10434063', 'default_password', 'Student', 70, NULL, NULL),
(103, '10434064', 'default_password', 'Student', 71, NULL, NULL),
(104, '10434065', 'default_password', 'Student', 72, NULL, NULL),
(105, '10434066', 'default_password', 'Student', 73, NULL, NULL),
(106, '10434067', 'default_password', 'Student', 74, NULL, NULL),
(107, '10434068', 'default_password', 'Student', 75, NULL, NULL),
(108, '10434069', 'default_password', 'Student', 76, NULL, NULL),
(109, '10434070', 'default_password', 'Student', 77, NULL, NULL),
(110, '10434071', 'default_password', 'Student', 78, NULL, NULL),
(111, '10434072', 'default_password', 'Student', 79, NULL, NULL),
(112, 'anittamaxwynn', 'default_password', 'Instructor', NULL, 38, NULL),
(113, '10434073', 'default_password', 'Student', 80, NULL, NULL),
(114, '10434074', 'default_password', 'Student', 81, NULL, NULL);

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
-- Dumping data for table `secretariat`
--

INSERT INTO `secretariat` (`secretariat_id`, `name`, `surname`, `email`, `landline`) VALUES
(1, 'Anna', 'Papadopoulou', 'apapadopoulou@upatras.gr', '2610320001'),
(2, 'George', 'Nikolaidis', 'gnikolaidis@upatras.gr', '2610330002'),
(3, 'Maria', 'Ioannidou', 'mioannidou@upatras.gr', '2610340003'),
(4, 'Elena', 'Karapanou', 'ekarapanou@upatras.gr', '2610350004'),
(5, 'Kostas', 'Zervas', 'kzervas@upatras.gr', '2610360005'),
(6, 'Sofia', 'Petropoulou', 'spetropoulou@upatras.gr', '2610370006');

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
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `name`, `surname`, `student_number`, `street`, `number`, `city`, `postcode`, `father_name`, `landline_telephone`, `mobile_telephone`, `email`) VALUES
(1, 'Makis', 'Makopoulos', 10433999, 'Αλιάρτου', 20, 'Πάτρα', 26443, 'Orestis', '2101234567', '6912345678', 'asdfds@sfda.com'),
(5, 'John', 'Lennon', 10434000, 'Ermou', 18, 'Athens', 10431, 'George', '2610123456', '6970001112', 'st10434000@upnet.gr'),
(6, 'Petros', 'Verikokos', 10434001, 'Adrianou', 20, 'Thessaloniki', 54248, 'Giannis', '2610778899', '6970001112', 'st10434001@upnet.gr'),
(7, 'test', 'name', 10434002, 'str', 1, 'patra', 26222, 'father', '2610123456', '6912345678', 'st10434002@upnet.gr'),
(8, 'Robert', 'Smith', 10434003, 'Fascination', 17, 'London', 1989, 'Alex', '2610251989', '6902051989', 'st10434003@upnet.gr'),
(9, 'Rex', 'Tyrannosaurus', 10434004, 'Cretaceous', 2, 'Laramidia', 54321, 'Daspletosaurus', '2610432121', '6911231234', 'st10434004@upnet.gr'),
(10, 'Paul', 'Mescal ', 10434005, 'Smith Str.', 33, 'New York ', 59, 'Paul', '-', '-', 'st10434005@upnet.gr'),
(11, 'Pedro', 'Pascal', 10434006, 'Johnson', 90, 'New York ', 70, 'José ', '-', '-', 'st10434006@upnet.gr'),
(12, 'David', 'Gilmour', 10434007, 'Sortef', 29, 'New York', 26, 'Douglas', '-', '-', 'st10434007@upnet.gr'),
(13, 'Lana', 'Del Rey ', 10434008, 'Groove Str.', 23, 'Los Angeles', 1, 'none', '-', '-', 'st10434008@upnet.gr'),
(14, 'Stevie', 'Nicks', 10434009, 'Magic Str. ', 8, 'New Orleans', 35, 'Jess ', '56', '67', 'st10434009@upnet.gr'),
(15, 'Margaret', 'Qualley', 10434010, 'Substance Str.', 25, 'Los Angeles ', 7, 'Paul', '67', '90', 'st10434010@upnet.gr'),
(16, 'Mia', 'Goth', 10434011, 'Pearl Str. ', 4, 'Michigan', 8, 'Lee', '-', '-', 'st10434011@upnet.gr'),
(17, 'Florence ', 'Pugh', 10434012, 'Midsommar Str. l', 1, 'Away', 24, '-', '5', '2', 'st10434012@upnet.gr'),
(18, 'PJ ', 'Harvey', 10434013, 'Lonely Str.', 27, 'Bridport', -7, 'Ray', '56', '43', 'st10434013@upnet.gr'),
(19, 'Penélope', 'Cruz', 10434014, 'Almadovar', 55, 'Madrid', 23, 'Eduardo ', '5', '4', 'st10434014@upnet.gr'),
(20, 'Emma', 'Stone', 10434015, 'Poor Str.', 3, 'Paris ', 34, 'none', '2333333', '4455555', 'st10434015@upnet.gr'),
(21, 'Jenny', 'Vanou', 10434016, 'Mpouat Str.', 23, 'Athens', 10, 'Basil', '09', '45', 'st10434016@upnet.gr'),
(22, 'Salma ', 'Hayek', 10434017, 'Desperado Str. ', 24, 'Madrid ', 656, 'Sami', '344', '221', 'st10434017@upnet.gr'),
(23, 'Julie ', 'Delpy', 10434018, 'Before Str.', 36, 'Paris', 567, 'Kieślowski', '1223', '3455', 'st10434018@upnet.gr'),
(24, 'Giannis', 'Aggelakas', 10434019, 'Trypes Str.', 3, 'Athens', 2354, 'Theos', '23', '45', 'st10434019@upnet.gr'),
(25, 'Eleutheria ', 'Arvanitaki', 10434020, 'fgyj', 5, 'fghdfhgjd', 456767, 'Kosmos', '657', '345', 'st10434020@upnet.gr'),
(26, 'Marina', 'Spanou', 10434021, 'Pagkrati Str.', 25, 'Athens', 2456, 'Gates', '897', '354', 'st10434021@upnet.gr'),
(27, 'Rena', 'Koumioti', 10434022, 'Mpouat Str.', 24, 'Athens', 5749, 'Ellhniko', '23557', '32453', 'st10434022@upnet.gr'),
(28, 'Charlotte', 'Aitchison', 10434023, 'Boiler Room St', 365, 'New York', 360, 'Jon', '2610365365', '693653365', 'st10434023@upnet.gr'),
(29, 'Rhaenyra', 'Targaryen', 10434024, 'Dragon St', 2021, 'Kings Landing', 2021, 'Viserys', '2610101010', '6910101010', 'st10434024@upnet.gr'),
(30, 'Ben', 'Dover', 10434025, 'Colon Str.', 124, 'NY', 11045, 'Carlos', '2584694587', '5841852384', 'st10434025@upnet.gr'),
(31, 'Marios', 'Papadakis', 10434026, 'Korinthou', 266, 'Patras', 26223, 'Ioannis', '+302105562567', '+306975562567', 'st10434026@upnet.gr'),
(32, 'Nicholas ', 'Hoult', 10434027, 'Nosferatu Str.', 34, 'London', 567, 'Roger', '436', '46478', 'st10434027@upnet.gr'),
(33, 'Joo Hyuk', 'Nam', 10434028, 'Kanakari', 135, 'Patra', 26440, 'Baek Yi Jin', '2610443568', '6978756432', 'st10434028@upnet.gr'),
(34, 'Nikos', 'Peletie', 10434029, 'Kolokotroni', 6, 'Athens', 34754, 'George', '2104593844', '6987655433', 'st10434029@upnet.gr'),
(35, 'Nikos', 'Koukos', 10434030, 'Triton', 12, 'Salamina', 12216, 'Giannis', '210553985', '6946901012', 'st10434030@upnet.gr'),
(36, 'Maria', 'Fouseki', 10434031, 'Jason ', 33, 'London', 44391, 'Tasos', '2109993719', '6923144642', 'st10434031@upnet.gr'),
(37, 'Nikos ', 'Korobos', 10434032, 'Masalias', 4, 'Sparti', 32095, 'Giannis', '2279036758', '6948308576', 'st10434032@upnet.gr'),
(38, 'Maria', 'Togia', 10434033, 'Athinon', 4, 'Athens', 28482, 'Petros', '2100393022', '6953782102', 'st10434033@upnet.gr'),
(39, 'Giorgos', 'Menegakis', 10434034, 'korinthou', 56, 'patras', 56892, 'nikos', '2610485796', '6934527125', 'st10434034@upnet.gr'),
(40, 'Trakis', 'Giannakopoulos', 10434035, 'Othonos kai Amalias ', 100, 'Patras', 26500, 'None', '2610381393', '6028371830', 'st10434035@upnet.gr'),
(41, 'Chris', 'Kouvadis', 10434036, 'vanizelou', 36, 'Patras', 26500, 'Pfloutsou', '2610995999', '6947937524', 'st10434036@upnet.gr'),
(42, 'pafloutsou', 'kaskarai', 10434037, 'kolokotroni', 12, 'Patras', 26500, 'mauragkas', '2610978423', '6935729345', 'st10434037@upnet.gr'),
(44, 'Billy', 'Diesel', 10434038, 'Alexandras Ave', 12, 'Athens', 11521, 'Iman', '2101234567', '6912345678', 'st10434038@upnet.gr'),
(46, 'Tome', 'of Madness', 10434039, 'Panepisthmiou', 69, 'Patras', 26441, 'Prafit', '2610654321', '6969966996', 'st10434039@upnet.gr'),
(47, 'fort', 'nite', 10434040, 'karaiskakis', 69, 'tilted tower', 4747, 'epic games', '2610747474', '6988112233', 'st10434040@upnet.gr'),
(48, 'Zeus', 'Ikosaleptos', 10434041, 'Novi', 25, 'Athens', 20033, 'Kleft', '2109090901', '6900008005', 'st10434041@upnet.gr'),
(49, 'AG', 'Cook', 10434042, 'Britpop', 7, 'London', 2021, 'PC Music', '2121212121', '1212121212', 'st10434042@upnet.gr'),
(50, 'Maria', 'Mahmood', 10434043, 'Mouratidi', 4, 'New York', 25486, 'Paparizou', '2108452666', '6980081351', 'st10434043@upnet.gr'),
(51, 'Kostas', 'Poupis', 10434044, 'Ag Kiriakis', 11, 'Papaou', 50501, 'Aelakis', '222609123', '698452154', 'st10434044@upnet.gr'),
(52, 'Hugh', 'Jass', 10434045, 'Wall Street', 69, 'Jerusalem', 478, 'Mike Oxlong', '69696969', '696969420', 'st10434045@upnet.gr'),
(53, 'Xontro ', 'Pigouinaki', 10434046, 'Krasopotirou', 69, 'Colarato', 14121, 'Adolf Heisenberg', '6913124205', '4747859625', 'st10434046@upnet.gr'),
(54, 'Μaria', 'Nikolaou', 10434047, 'Achilleos', 21, 'Athens', 10437, 'Dimitris', '2109278907', '6945533213', 'st10434047@upnet.gr'),
(55, 'Eleni', 'Fotiou', 10434048, 'Adrianou ', 65, 'Athens', 10556, 'Nikos', '2108745645', '6978989000', 'st10434048@upnet.gr'),
(56, 'Xara', 'Fanouriou', 10434049, 'Chaonias ', 54, 'Athens', 10441, 'Petros', '2108724324', '6945622222', 'st10434049@upnet.gr'),
(57, 'Nikos', 'Panagiotou', 10434050, 'Chomatianou', 32, 'Athens', 10439, 'Giorgos', '2107655555', '6941133333', 'st10434050@upnet.gr'),
(58, 'Petros', 'Daidalos', 10434051, 'Dafnidos', 4, 'Athens', 11364, 'Pavlos', '2108534566', '6976644333', 'st10434051@upnet.gr'),
(59, 'Giannis', 'Ioannou', 10434052, 'Danais', 9, 'Athens', 11631, 'Kostas', '2107644999', '6976565655', 'st10434052@upnet.gr'),
(60, 'Tsili', 'Doghouse', 10434053, 'novi lane', 33, 'Patras', 26478, 'Stoiximan', '2610420420', '6999999999', 'st10434053@upnet.gr'),
(61, 'Marialena', 'Antoniou', 10434054, 'Ermou', 24, 'Athens', 10563, 'Nikolaos', '210-5678901', '693-5678901', 'st10434054@upnet.gr'),
(62, 'Ioannis', 'Panagiotou', 10434055, 'Kyprou', 42, 'Patra', 26441, 'Kwstas', '2610-123456', '698-1234567', 'st10434055@upnet.gr'),
(63, 'George', 'Karamalis', 10434056, 'Kolokotroni', 10, 'Larissa', 41222, 'Petros', '2410-456789', '697-4567890', 'st10434056@upnet.gr'),
(64, 'Kyriakos', 'Papapetrou', 10434057, 'Zakunthou', 36, 'Volos', 10654, 'Apostolos', '210-6789012', '695-6789012', 'st10434057@upnet.gr'),
(65, 'Maria', 'Kp', 10434058, 'pelopidas ', 52, 'patra', 28746, 'george', '2610555555', '6932323232', 'st10434058@upnet.gr'),
(66, 'Nikos', 'papadopoulos', 10434059, 'anapafseos', 34, 'patra', 26503, 'takis', '2691045092', '69090909', 'st10434059@upnet.gr'),
(67, 'Giannis ', 'Molotof', 10434060, 'Ermou', 34, 'Patras', 29438, 'Giorgos', '2610254390', '6943126767', 'st10434060@upnet.gr'),
(68, 'Sagdy', 'Znuts', 10434061, 'Grove', 12, 'San Andreas', 123456, 'NULL', '123456789', '123456789', 'st10434061@upnet.gr'),
(69, 'Mary', 'Poppins', 10434062, 'Niktolouloudias ', 123, 'Chalkida', 23456, 'George', '2613456089', '6980987654', 'st10434062@upnet.gr'),
(70, 'Tinker', 'Bell', 10434063, 'Vatomourias', 55, 'Pano Raxoula', 2345, 'Mixail', '2456034567', '6987543345', 'st10434063@upnet.gr'),
(71, 'Lilly', 'Bloom', 10434064, 'Patnanasis', 45, 'Patra', 26440, 'Menelaos', '2610435988', '6987555433', 'st10434064@upnet.gr'),
(72, 'GIORGOS', 'MASOURAS', 10434065, 'AGIOU IOANNNI RENTI', 7, 'PEIRAIAS', 47200, 'PETROS', '694837204', '210583603', 'st10434065@upnet.gr'),
(73, 'KENDRICK', 'NUNN', 10434066, 'OAKA', 25, 'ATHENS', 666, 'GIANNAKOPOULOS', '6982736199', '6906443321', 'st10434066@upnet.gr'),
(74, 'Depeche', 'Mode', 10434067, 'Enjoy The Silence', 1990, 'London', 1990, 'Dave', '1234567890', '1234567770', 'st10434067@upnet.gr'),
(75, 'name', 'surname', 10434068, 'your', 69, 'mom', 15584, 'father', '222', '2223', 'st10434068@upnet.gr'),
(76, 'Nikos', 'Kosmopoulos', 10434069, 'Araksou', 12, 'Giotopoli', 69420, 'Greg', '210 9241993', '6978722312', 'st10434069@upnet.gr'),
(77, 'Aris', 'Poupis', 10434070, 'Mpofa', 10, 'Kolonia', 12345, 'Mpamias', '2105858858', '6935358553', 'st10434070@upnet.gr'),
(78, 'gerry', 'banana', 10434071, 'lootlake', 12, 'tilted', 26500, 'johnesy', '6947830287', '2610987632', 'st10434071@upnet.gr'),
(79, 'grekotsi', 'parthenios', 10434072, 'kokmotou', 69, 'thessaloniki', 20972, 'mourlo', '6947910234', '2610810763', 'st10434072@upnet.gr'),
(80, 'Mochi', 'Mon', 10434073, 'Novi', 55, 'Maxxwin', 99999, 'Drake', '2610550406', '6967486832', 'st10434073@upnet.gr'),
(81, 'Nikolaos', 'Serraios', 10434074, 'Papaflessa', 12, 'Patra', 26222, 'Georgios', '2610456632', '6975849305', 'st10434074@upnet.gr');

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
-- Dumping data for table `thesis`
--

INSERT INTO `thesis` (`thesis_id`, `instructor_id`, `title`, `description`, `topic_presentation_file_name`, `topic_presentation_file_path`, `draft_thesis_file_name`, `draft_thesis_file_path`, `examination_report_file_name`, `examination_report_file_path`, `assigned_student`, `committee_member_1`, `committee_member_2`, `status`, `final_grade`, `instructor_grade`, `committee_member_1_grade`, `committee_member_2_grade`, `nemertis_link`, `material_links`, `GA_year`, `GA_number`) VALUES
(1, 1, 'Συστήματα Συστημάτων για την Ανάλυση Δεδομένων IoT', 'Μελέτη και ανάπτυξη ενός συστήματος για την ανάλυση δεδομένων από το Internet of Things (IoT).', 'intelligent_recommendation_systems.pdf', './database/intelligent_recommendation_systems.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 'Μηχανική Μάθηση για Αναγνώριση Προτύπων στις Βιοϊατρικές Εικόνες', 'Εφαρμογή μεθόδων μηχανικής μάθησης για την ανίχνευση παθολογιών σε βιοϊατρικές εικόνες.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 7, 'Κρυπτογράφηση Quantum για Ασφαλή Επικοινωνία', 'Μελέτη πρωτοκόλλων κβαντικής κρυπτογράφησης και η εφαρμογή τους στην ασφαλή επικοινωνία.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 7, 'Ανάλυση Κοινωνικών Δικτύων με Χρήση Γραφημάτων', 'Εφαρμογή θεωρίας γραφημάτων για την ανάλυση και οπτικοποίηση κοινωνικών δικτύων.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 8, 'Σχεδίαση Ευφυών Συστημάτων Σύστασης Προϊόντων', 'Δημιουργία συστημάτων που βασίζονται σε τεχνικές τεχνητής νοημοσύνης για εξατομικευμένες προτάσεις.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 8, 'Αυτόνομα Οχήματα και Αλγόριθμοι Πλοήγησης', 'Ανάλυση αλγορίθμων πλοήγησης και εφαρμογές σε αυτόνομα οχήματα.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 9, 'Ασφάλεια στον Κυβερνοχώρο με Χρήση Blockchain', 'Εξερεύνηση της τεχνολογίας blockchain για την προστασία δεδομένων και την ανίχνευση επιθέσεων.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 10, 'Υπολογιστική Όραση για Αναγνώριση Αντικειμένων', 'Ανάπτυξη αλγορίθμων για την αναγνώριση και ταξινόμηση αντικειμένων σε εικόνες.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 11, 'Διαχείριση Μεγάλων Δεδομένων με Χρήση Apache Hadoop', 'Μελέτη τεχνικών αποθήκευσης και ανάλυσης μεγάλων δεδομένων με χρήση του Apache Hadoop.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Εξέταση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 11, 'Εικονική Πραγματικότητα για Εκπαιδευτικούς Σκοπούς', 'Δημιουργία εφαρμογών εικονικής πραγματικότητας για την ενίσχυση της εκπαιδευτικής εμπειρίας.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 15, 'Σχεδιασμός και υλοποίηση web εφαρμογής για συλλογή, επεξεργασία και οπτικοποίηση δεδομένων για τους απόφοιτους του \"ΤΜΗΥΠ\"', 'gertghdfsghdfgf', 'big_data_hadoop.pdf', './database/big_data_hadoop.pdf', 'ugrad-thesis-A.Ntoumi-1054415.pdf', './database/ugrad-thesis-A.Ntoumi-1054415.pdf', 'diplomatiki_ergasia_tmiyp_0.pdf', './database/diplomatiki_ergasia_tmiyp_0.pdf', 25, 29, 23, 'Περατωμένη', 7.00, 10.00, 5.00, 6.00, 'https://nemertes.library.upatras.gr/items/cefdedb2-7e43-4aed-9d65-785e9e29f83e', 'https://www.youtube.com/watch?v=4d5T4w5bEz8&ab_channel=TakeTakeTake', NULL, NULL),
(14, 9, 'dryjuyttyu', 'tuytrukdtjy', 'diplomatiki_ergasia_tmiyp_0-4.pdf', './database/diplomatiki_ergasia_tmiyp_0-4.pdf', NULL, NULL, NULL, NULL, 59, 30, 37, 'Ακυρωμένη', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 29, 'jygjhy jy', 'yjfjytjytfhn', 'machine_learning_bio_images.pdf', './database/machine_learning_bio_images.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Υπό Ανάθεση', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
-- Dumping data for table `thesis_status_history`
--

INSERT INTO `thesis_status_history` (`change_id`, `thesis_id`, `status_change`, `changed_at`) VALUES
(1, 1, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(2, 2, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(3, 3, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(4, 4, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(5, 5, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(6, 6, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(7, 7, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(8, 8, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(9, 9, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(10, 10, 'Δημιουργήθηκε', '2024-12-23 11:56:14'),
(15, 1, 'Αναλυτική Παρουσίαση Ενημερώθηκε', '2024-12-23 15:47:26'),
(27, 1, 'Άλλο', '2024-12-24 09:51:15'),
(47, 13, 'Δημιουργήθηκε', '2024-12-30 10:47:05'),
(48, 13, 'Ανατέθηκε', '2024-12-30 10:48:17'),
(49, 13, 'Επιτροπή Ενημερώθηκε', '2024-12-30 10:54:50'),
(50, 13, 'Επιτροπή Ενημερώθηκε', '2024-12-30 10:55:11'),
(51, 13, 'Ενεργή', '2024-12-30 10:55:11'),
(52, 13, 'Υπό Εξέταση', '2024-12-30 10:59:47'),
(53, 13, 'Πρόχειρο Κείμενο Διπλωματικής Ενημερώθηκε', '2024-12-30 11:01:13'),
(54, 13, 'Άλλο', '2024-12-30 11:01:31'),
(55, 13, 'Βαθμός Επιτροπής Αναρτήθηκε', '2024-12-30 11:04:46'),
(56, 13, 'Βαθμός Επιτηρητή Αναρτήθηκε', '2024-12-30 11:05:15'),
(57, 13, 'Βαθμός Επιτροπής Αναρτήθηκε', '2024-12-30 11:05:54'),
(58, 13, 'Τελικός Βαθμός Αναρτήθηκε', '2024-12-30 11:05:54'),
(59, 13, 'Πρακτικού Εξέτασης Ενημερώθηκε', '2024-12-30 11:09:19'),
(60, 13, 'Σύνδεσμος Νημερτή Ενημερώθηκε', '2024-12-30 11:10:23'),
(61, 13, 'Περατωμένη', '2024-12-30 11:11:35'),
(62, 7, 'Ανατέθηκε', '2024-12-30 11:27:39'),
(63, 7, 'Ανάθεση Αφαιρέθηκε', '2024-12-30 11:27:43'),
(64, 14, 'Δημιουργήθηκε', '2024-12-30 11:28:44'),
(65, 14, 'Ανατέθηκε', '2024-12-30 11:29:01'),
(66, 14, 'Επιτροπή Ενημερώθηκε', '2024-12-30 11:29:06'),
(67, 14, 'Επιτροπή Ενημερώθηκε', '2024-12-30 11:29:11'),
(68, 14, 'Ενεργή', '2021-12-16 11:29:16'),
(69, 14, 'Ακυρωμένη', '2024-12-30 11:30:43'),
(70, 15, 'Δημιουργήθηκε', '2025-01-19 00:06:55');

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
  MODIFY `invitation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `instructor_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `personnel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `secretariat`
--
ALTER TABLE `secretariat`
  MODIFY `secretariat_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `thesis`
--
ALTER TABLE `thesis`
  MODIFY `thesis_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `thesis_status_history`
--
ALTER TABLE `thesis_status_history`
  MODIFY `change_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
