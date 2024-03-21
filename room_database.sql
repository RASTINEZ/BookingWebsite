-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2024 at 09:46 AM
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
  `status` enum('pending','confirmed','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `room_id`, `start_time`, `end_time`, `booked_by`, `created_at`, `updated_at`, `status`) VALUES
(1, 704, '2024-03-05 08:30:00', '2024-03-05 09:30:00', 'test', '2024-03-01 22:18:16', '2024-03-15 21:50:09', 'confirmed'),
(2, 704, '2024-03-06 09:30:00', '2024-03-06 10:30:00', 'ttttt', '2024-03-02 02:01:55', '2024-03-15 22:56:53', 'rejected'),
(3, 704, '2024-03-07 09:30:00', '2024-03-07 13:30:00', 'ddd', '2024-03-02 02:02:51', '2024-03-02 02:02:51', 'pending'),
(16, 704, '2024-03-04 11:00:00', '2024-03-04 11:30:00', 'rastin', '2024-03-03 22:34:06', '2024-03-03 22:34:06', 'pending'),
(19, 704, '2024-03-04 15:00:00', '2024-03-04 15:30:00', 'rastin', '2024-03-03 22:39:55', '2024-03-03 22:39:55', 'pending'),
(22, 704, '2024-03-15 08:00:00', '2024-03-15 08:30:00', 'test', '2024-03-04 16:22:53', '2024-03-04 16:22:53', 'pending'),
(23, 705, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-15 15:08:58', '2024-03-15 15:08:58', 'pending'),
(24, 705, '2024-03-16 08:30:00', '2024-03-16 09:00:00', 'rastin', '2024-03-15 18:22:16', '2024-03-15 18:22:16', 'pending'),
(25, 706, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-15 18:24:44', '2024-03-15 18:24:44', 'pending'),
(26, 704, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-15 18:41:39', '2024-03-15 18:41:39', 'pending'),
(27, 704, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'admin', '2024-03-15 20:44:30', '2024-03-15 23:07:00', 'confirmed'),
(28, 705, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'admin', '2024-03-15 22:06:31', '2024-03-15 22:06:31', 'confirmed'),
(29, 701, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'admin', '2024-03-15 22:07:39', '2024-03-15 22:16:08', 'confirmed'),
(30, 705, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 01:47:49', '2024-03-16 07:44:58', 'rejected'),
(31, 705, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 01:47:49', '2024-03-16 01:47:49', 'confirmed'),
(32, 705, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-16 01:47:49', '2024-03-16 01:47:49', 'confirmed'),
(33, 704, '2024-03-16 08:30:00', '2024-03-16 09:00:00', 'rastin', '2024-03-16 01:49:30', '2024-03-16 02:11:34', 'confirmed'),
(34, 704, '2024-03-16 09:00:00', '2024-03-16 09:30:00', 'rastin', '2024-03-16 01:49:30', '2024-03-16 01:49:30', 'confirmed'),
(35, 704, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-16 01:52:20', '2024-03-16 01:52:20', 'confirmed'),
(36, 704, '2024-03-16 09:30:00', '2024-03-16 10:00:00', 'rastin', '2024-03-16 01:55:19', '2024-03-16 01:55:19', 'confirmed'),
(37, 704, '2024-03-16 10:00:00', '2024-03-16 10:30:00', 'rastin', '2024-03-16 02:02:52', '2024-03-16 02:02:52', 'confirmed'),
(38, 706, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 02:06:55', '2024-03-16 02:06:55', 'confirmed'),
(39, 702, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 02:07:51', '2024-03-16 02:07:51', 'confirmed'),
(40, 704, '2024-03-16 10:30:00', '2024-03-16 11:00:00', 'rastin', '2024-03-16 02:15:31', '2024-03-16 03:04:56', 'rejected'),
(41, 705, '2024-03-16 09:30:00', '2024-03-16 10:00:00', 'rastin', '2024-03-16 02:17:54', '2024-03-16 02:17:54', 'confirmed'),
(42, 705, '2024-03-16 09:00:00', '2024-03-16 09:30:00', 'rastin', '2024-03-16 02:23:40', '2024-03-16 02:23:40', 'confirmed'),
(43, 708, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 02:26:25', '2024-03-16 02:26:25', 'confirmed'),
(46, 711, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'rastin', '2024-03-16 02:35:41', '2024-03-16 02:35:41', 'confirmed'),
(47, 709, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 02:45:55', '2024-03-16 02:45:55', 'confirmed'),
(48, 704, '2024-03-16 12:30:00', '2024-03-16 13:00:00', 'rastin', '2024-03-16 03:08:23', '2024-03-16 03:08:23', 'confirmed'),
(49, 709, '2024-03-16 09:00:00', '2024-03-16 09:30:00', 'rastin', '2024-03-16 03:10:39', '2024-03-16 03:10:39', 'confirmed'),
(50, 707, '2024-03-16 09:30:00', '2024-03-16 10:00:00', 'rastin', '2024-03-16 03:18:03', '2024-03-16 03:18:03', 'confirmed'),
(51, 709, '2024-03-16 08:30:00', '2024-03-16 09:00:00', 'rastin', '2024-03-16 03:22:16', '2024-03-16 03:22:16', 'confirmed'),
(52, 711, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 03:25:10', '2024-03-16 03:25:10', 'confirmed'),
(53, 708, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 03:26:24', '2024-03-16 03:26:24', 'confirmed'),
(54, 709, '2024-03-16 07:30:00', '2024-03-16 08:00:00', 'rastin', '2024-03-16 03:27:23', '2024-03-16 03:27:23', 'confirmed'),
(55, 707, '2024-03-16 07:00:00', '2024-03-16 07:30:00', 'rastin', '2024-03-16 03:28:26', '2024-03-16 03:28:26', 'confirmed'),
(56, 706, '2024-03-17 07:00:00', '2024-03-17 07:30:00', 'admin', '2024-03-16 06:05:10', '2024-03-16 06:05:10', 'confirmed'),
(57, 708, '2024-03-16 08:00:00', '2024-03-16 08:30:00', 'admin', '2024-03-16 07:43:40', '2024-03-16 07:43:40', 'confirmed'),
(58, 702, '2024-03-21 10:30:00', '2024-03-21 11:00:00', 'admin', '2024-03-21 08:36:22', '2024-03-21 08:36:22', 'confirmed'),
(59, 707, '2024-03-21 07:00:00', '2024-03-21 07:30:00', 'admin', '2024-03-21 08:37:38', '2024-03-21 08:37:38', 'confirmed'),
(60, 702, '2024-03-21 07:30:00', '2024-03-21 08:00:00', 'admin', '2024-03-21 08:40:28', '2024-03-21 08:40:28', 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_number` varchar(50) NOT NULL,
  `available_status` enum('Ready','booked','Maintain') NOT NULL DEFAULT 'Ready',
  `room_type` enum('Normal','Big') NOT NULL DEFAULT 'Normal',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `room_number`, `available_status`, `room_type`, `created_at`, `updated_at`, `details`) VALUES
(701, '701', 'Ready', 'Normal', '2024-03-05 19:16:35', '2024-03-21 06:58:45', NULL),
(702, '702', 'Ready', 'Normal', '2024-03-05 19:16:35', '2024-03-21 06:58:50', NULL),
(703, '703', 'Maintain', 'Big', '2024-03-04 19:00:28', '2024-03-04 19:29:09', 'microphone broken, แอร์ไม่เย็น'),
(704, '704', 'Ready', 'Normal', '2024-02-27 12:48:30', '2024-03-21 06:58:54', NULL),
(705, '705', 'Ready', 'Normal', '2024-03-05 19:19:45', '2024-03-21 06:58:57', NULL),
(706, '706', 'Ready', 'Normal', '2024-03-05 19:20:07', '2024-03-21 06:59:02', NULL),
(707, '707', 'Ready', 'Normal', '2024-03-05 19:20:07', '2024-03-21 06:59:05', NULL),
(708, '708', 'Ready', 'Normal', '2024-03-05 19:20:27', '2024-03-21 06:59:08', NULL),
(709, '709', 'Ready', 'Big', '2024-02-27 12:47:41', '2024-03-21 06:59:12', NULL),
(710, '710', 'Maintain', 'Big', '2024-02-27 12:48:17', '2024-03-04 18:41:34', 'bad lights'),
(711, '711', 'Ready', 'Normal', '2024-03-05 19:20:27', '2024-03-21 06:59:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','teacher','mod','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'test', 'test@gmail.com', '11111111', 'teacher'),
(2, 'test2', 'test@gmail.com', '22222222', 'user'),
(3, 'test3', 'test3@gmail.com', '33333333', 'user'),
(4, 'test4', 'test4@gmail.com', '44444444', 'mod'),
(5, 'test5', 'test5@gmail.com', '55555555', 'user'),
(6, 'test6', 's6@gmail.com', '55555555', 'user'),
(7, 'test7', 's7@gmail.com', '77777777', 'user'),
(8, 'rastin', 'rastinez1337@gmail.com', '12345678', 'admin'),
(9, 'admin', 'tinrunner4869@gmail.com', 'admin12345', 'admin');

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
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=712;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
