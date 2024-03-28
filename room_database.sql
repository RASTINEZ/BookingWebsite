-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2024 at 02:01 PM
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
-- Database: `room_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `booked_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('pending','confirmed','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `check_in` enum('yes','no') DEFAULT 'no',
  `detail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `room_id`, `start_time`, `end_time`, `booked_by`, `created_at`, `updated_at`, `status`, `check_in`, `detail`) VALUES
(1, 704, '2024-03-05 08:30:00', '2024-03-05 09:30:00', 'test', '2024-03-01 22:18:16', '2024-03-15 21:50:09', 'confirmed', 'no', NULL),
(2, 704, '2024-03-06 09:30:00', '2024-03-06 10:30:00', 'ttttt', '2024-03-02 02:01:55', '2024-03-15 22:56:53', 'rejected', 'no', NULL),
(3, 704, '2024-03-07 09:30:00', '2024-03-07 13:30:00', 'ddd', '2024-03-02 02:02:51', '2024-03-24 03:45:08', 'rejected', 'no', ''),
(16, 704, '2024-03-04 11:00:00', '2024-03-04 11:30:00', 'rastin', '2024-03-03 22:34:06', '2024-03-24 03:40:10', 'rejected', 'no', 'test'),
(19, 704, '2024-03-04 15:00:00', '2024-03-04 15:30:00', 'rastin', '2024-03-03 22:39:55', '2024-03-24 03:45:58', 'rejected', 'no', 'sdasdadadadad'),
(22, 704, '2024-03-15 08:00:00', '2024-03-15 08:30:00', 'test', '2024-03-04 16:22:53', '2024-03-04 16:22:53', 'pending', 'no', NULL),
(23, 705, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-15 15:08:58', '2024-03-24 03:52:45', 'rejected', 'no', 'แอร์ร้อนมากๆๆๆๆๆๆๆ'),
(24, 705, '2024-03-16 08:30:00', '2024-03-16 09:00:00', 'rastin', '2024-03-15 18:22:16', '2024-03-24 03:48:29', 'rejected', 'no', 'แอร์ร้อนมาก'),
(25, 706, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-15 18:24:44', '2024-03-24 03:54:38', 'rejected', 'no', 'แอร์ร้อนมากๆๆ'),
(26, 704, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-15 18:41:39', '2024-03-15 18:41:39', 'pending', 'no', NULL),
(29, 701, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'admin', '2024-03-15 22:07:39', '2024-03-24 00:04:24', 'confirmed', 'yes', NULL),
(30, 705, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 01:47:49', '2024-03-16 07:44:58', 'rejected', 'no', NULL),
(31, 705, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 01:47:49', '2024-03-16 01:47:49', 'confirmed', 'no', NULL),
(32, 705, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-16 01:47:49', '2024-03-16 01:47:49', 'confirmed', 'no', NULL),
(33, 704, '2024-03-16 08:30:00', '2024-03-16 09:00:00', 'rastin', '2024-03-16 01:49:30', '2024-03-16 02:11:34', 'confirmed', 'no', NULL),
(34, 704, '2024-03-16 09:00:00', '2024-03-16 09:30:00', 'rastin', '2024-03-16 01:49:30', '2024-03-16 01:49:30', 'confirmed', 'no', NULL),
(35, 704, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-16 01:52:20', '2024-03-16 01:52:20', 'confirmed', 'no', NULL),
(36, 704, '2024-03-16 09:30:00', '2024-03-16 10:00:00', 'rastin', '2024-03-16 01:55:19', '2024-03-16 01:55:19', 'confirmed', 'no', NULL),
(37, 704, '2024-03-16 10:00:00', '2024-03-16 10:30:00', 'rastin', '2024-03-16 02:02:52', '2024-03-24 00:47:03', 'rejected', 'no', NULL),
(38, 706, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 02:06:55', '2024-03-16 02:06:55', 'confirmed', 'no', NULL),
(39, 702, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 02:07:51', '2024-03-16 02:07:51', 'confirmed', 'no', NULL),
(40, 704, '2024-03-16 10:30:00', '2024-03-16 11:00:00', 'rastin', '2024-03-16 02:15:31', '2024-03-16 03:04:56', 'rejected', 'no', NULL),
(41, 705, '2024-03-16 09:30:00', '2024-03-16 10:00:00', 'rastin', '2024-03-16 02:17:54', '2024-03-16 02:17:54', 'confirmed', 'no', NULL),
(42, 705, '2024-03-16 09:00:00', '2024-03-16 09:30:00', 'rastin', '2024-03-16 02:23:40', '2024-03-16 02:23:40', 'confirmed', 'no', NULL),
(43, 708, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 02:26:25', '2024-03-16 02:26:25', 'confirmed', 'no', NULL),
(46, 711, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-16 02:35:41', '2024-03-16 02:35:41', 'confirmed', 'no', NULL),
(47, 709, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 02:45:55', '2024-03-24 00:53:00', 'rejected', 'no', NULL),
(48, 704, '2024-03-16 12:30:00', '2024-03-16 13:00:00', 'rastin', '2024-03-16 03:08:23', '2024-03-16 03:08:23', 'confirmed', 'no', NULL),
(49, 709, '2024-03-16 09:00:00', '2024-03-16 09:30:00', 'rastin', '2024-03-16 03:10:39', '2024-03-16 03:10:39', 'confirmed', 'no', NULL),
(50, 707, '2024-03-16 09:30:00', '2024-03-16 10:00:00', 'rastin', '2024-03-16 03:18:03', '2024-03-16 03:18:03', 'confirmed', 'no', NULL),
(51, 709, '2024-03-16 08:30:00', '2024-03-16 09:00:00', 'rastin', '2024-03-16 03:22:16', '2024-03-16 03:22:16', 'confirmed', 'no', NULL),
(52, 711, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 03:25:10', '2024-03-16 03:25:10', 'confirmed', 'no', NULL),
(53, 708, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 03:26:24', '2024-03-16 03:26:24', 'confirmed', 'no', NULL),
(54, 709, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 03:27:23', '2024-03-16 03:27:23', 'confirmed', 'no', NULL),
(55, 707, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 03:28:26', '2024-03-16 03:28:26', 'confirmed', 'no', NULL),
(56, 706, '2024-03-17 07:00:00', '2024-03-17 07:30:00', 'admin', '2024-03-16 06:05:10', '2024-03-16 06:05:10', 'confirmed', 'no', NULL),
(57, 708, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'admin', '2024-03-16 07:43:40', '2024-03-24 01:43:48', 'confirmed', 'yes', NULL),
(58, 702, '2024-03-21 10:30:00', '2024-03-21 11:00:00', 'admin', '2024-03-21 08:36:22', '2024-03-24 16:43:07', 'confirmed', 'yes', NULL),
(59, 707, '2024-03-21 07:00:00', '2024-03-21 07:30:00', 'admin', '2024-03-21 08:37:38', '2024-03-21 08:37:38', 'confirmed', 'no', NULL),
(60, 702, '2024-03-21 07:30:00', '2024-03-21 08:00:00', 'admin', '2024-03-21 08:40:28', '2024-03-21 08:40:28', 'confirmed', 'no', NULL),
(61, 709, '2024-03-24 07:00:00', '2024-03-24 07:30:00', 'admin', '2024-03-24 01:15:52', '2024-03-28 10:06:10', 'cancelled', 'no', 'เปลี่ยนใจ'),
(62, 706, '2024-03-24 07:00:00', '2024-03-24 07:30:00', 'admin', '2024-03-24 01:17:42', '2024-03-24 01:44:08', 'confirmed', 'yes', NULL),
(63, 711, '2024-03-24 07:00:00', '2024-03-24 07:30:00', 'admin', '2024-03-24 01:29:48', '2024-03-28 10:22:27', 'rejected', 'yes', 'ห้องพังชั่วคราว'),
(64, 711, '2024-03-24 07:30:00', '2024-03-24 08:00:00', 'admin', '2024-03-24 02:29:09', '2024-03-28 10:33:15', 'confirmed', 'yes', 'เน็ตดับ'),
(65, 702, '2024-03-24 07:00:00', '2024-03-24 07:30:00', 'admin', '2024-03-24 03:58:03', '2024-03-24 03:58:03', 'confirmed', 'no', NULL),
(66, 701, '2024-03-24 07:00:00', '2024-03-24 07:30:00', 'admin', '2024-03-24 03:59:12', '2024-03-24 16:43:11', 'confirmed', 'yes', NULL),
(67, 711, '2024-03-24 08:00:00', '2024-03-24 08:30:00', 'admin', '2024-03-24 04:04:12', '2024-03-28 11:43:37', 'confirmed', 'yes', NULL),
(68, 707, '2024-03-24 07:30:00', '2024-03-24 08:00:00', 'admin', '2024-03-24 04:05:02', '2024-03-24 04:05:02', 'confirmed', 'no', NULL),
(73, 713, '2024-03-31 07:00:00', '2024-03-31 07:30:00', 'admin', '2024-03-28 11:44:05', '2024-03-28 11:44:05', 'confirmed', 'no', NULL),
(74, 713, '2024-03-31 07:30:00', '2024-03-31 08:00:00', 'admin', '2024-03-28 11:44:05', '2024-03-28 11:44:05', 'confirmed', 'no', NULL),
(75, 713, '2024-03-31 08:00:00', '2024-03-31 08:30:00', 'admin', '2024-03-28 11:44:05', '2024-03-28 11:44:05', 'confirmed', 'no', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_number` varchar(50) NOT NULL,
  `available_status` enum('Ready','booked','Maintain') NOT NULL DEFAULT 'Ready',
  `room_type` enum('Normal(40 seats)','Big(100 seats)','Auditorium') NOT NULL DEFAULT 'Normal(40 seats)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` varchar(255) DEFAULT NULL,
  `building` enum('SC45','SCL') DEFAULT 'SC45',
  `room_schedule_image_path` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `room_number`, `available_status`, `room_type`, `created_at`, `updated_at`, `details`, `building`, `room_schedule_image_path`) VALUES
(303, '303', 'Ready', 'Normal(40 seats)', '2024-03-24 16:01:22', '2024-03-25 10:33:58', NULL, 'SCL', NULL),
(306, '306', 'Ready', 'Normal(40 seats)', '2024-03-26 14:27:32', '2024-03-26 14:27:32', NULL, 'SCL', NULL),
(703, '703', 'Maintain', 'Normal(40 seats)', '2024-03-04 19:00:28', '2024-03-25 07:22:37', 'microphone broken, แอร์ไม่เย็น', 'SC45', NULL),
(704, '704', 'Ready', 'Normal(40 seats)', '2024-02-27 12:48:30', '2024-03-25 07:22:37', NULL, 'SC45', NULL),
(709, '709', 'Ready', 'Big(100 seats)', '2024-02-27 12:47:41', '2024-03-26 14:29:40', NULL, 'SC45', NULL),
(710, '710', 'Maintain', 'Normal(40 seats)', '2024-02-27 12:48:17', '2024-03-25 07:22:37', 'bad lights', 'SC45', NULL),
(711, '711', 'Ready', 'Auditorium', '2024-03-05 19:20:27', '2024-03-26 14:26:28', NULL, 'SC45', NULL),
(713, '713', 'Ready', 'Auditorium', '2024-03-26 11:15:10', '2024-03-26 14:26:36', NULL, 'SC45', '\\src\\assets\\images\\713.jpg'),
(751, '751', 'Ready', 'Auditorium', '2024-03-26 14:26:54', '2024-03-26 14:26:54', NULL, 'SC45', NULL),
(803, '803', 'Ready', 'Normal(40 seats)', '2024-03-26 14:25:17', '2024-03-26 14:25:17', NULL, 'SC45', NULL),
(809, '809', 'Ready', 'Normal(40 seats)', '2024-03-26 14:25:17', '2024-03-26 14:25:17', NULL, 'SC45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','teacher','mod','admin') DEFAULT 'user',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `student_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `first_name`, `last_name`, `phone_number`, `student_id`) VALUES
(1, 'test', 'test@gmail.com', '11111111', 'teacher', NULL, NULL, NULL, NULL),
(2, 'test2', 'test@gmail.com', '22222222', 'user', 'เทสงับ', 'จุ๊กกรู้', NULL, NULL),
(3, 'test3', 'test3@gmail.com', '33333333', 'admin', NULL, NULL, NULL, NULL),
(4, 'test4', 'test4@gmail.com', '44444444', 'mod', NULL, NULL, NULL, NULL),
(5, 'test5', 'test5@gmail.com', '55555555', 'teacher', NULL, NULL, NULL, NULL),
(6, 'test6', 's6@gmail.com', '55555555', 'user', NULL, NULL, NULL, NULL),
(7, 'test7', 's7@gmail.com', '77777777', 'user', NULL, NULL, NULL, NULL),
(8, 'rastin', 'rastinez1337@gmail.com', '12345678', 'admin', NULL, NULL, NULL, NULL),
(9, 'admin', 'tinrunner4869@gmail.com', 'admin12345', 'admin', 'admin', 'naja', NULL, NULL),
(11, 'tin', 'tin@gmail', '12345678', 'user', NULL, NULL, NULL, NULL),
(12, 'kkk', '', '', 'user', 'kknuadmaew', '', NULL, NULL),
(13, 'jirateep', 'jirateep.cha@ku.th', '12345678', 'user', 'Jirateep', 'Chanma', '0909175416', '6310451006');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=810;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
