-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2024 at 09:13 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `room_id`, `start_time`, `end_time`, `booked_by`, `created_at`, `updated_at`) VALUES
(1, 704, '2024-03-05 08:30:00', '2024-03-05 09:30:00', 'test', '2024-03-01 22:18:16', '2024-03-01 22:18:16'),
(2, 704, '2024-03-06 09:30:00', '2024-03-06 10:30:00', 'ttttt', '2024-03-02 02:01:55', '2024-03-02 02:01:55'),
(3, 704, '2024-03-07 09:30:00', '2024-03-07 13:30:00', 'ddd', '2024-03-02 02:02:51', '2024-03-02 02:02:51'),
(4, 704, '2024-03-04 07:30:00', '2024-03-04 08:00:00', NULL, '2024-03-03 22:20:25', '2024-03-03 22:20:25'),
(5, 704, '2024-03-04 07:00:00', '2024-03-04 07:30:00', NULL, '2024-03-03 22:20:25', '2024-03-03 22:20:25'),
(6, 704, '2024-03-07 08:30:00', '2024-03-07 09:00:00', NULL, '2024-03-03 22:20:56', '2024-03-03 22:20:56'),
(7, 704, '2024-03-07 09:00:00', '2024-03-07 09:30:00', NULL, '2024-03-03 22:20:56', '2024-03-03 22:20:56'),
(8, 704, '2024-03-04 08:00:00', '2024-03-04 08:30:00', NULL, '2024-03-03 22:24:59', '2024-03-03 22:24:59'),
(9, 704, '2024-03-04 08:30:00', '2024-03-04 09:00:00', NULL, '2024-03-03 22:24:59', '2024-03-03 22:24:59'),
(10, 704, '2024-03-04 08:00:00', '2024-03-04 08:30:00', NULL, '2024-03-03 22:25:04', '2024-03-03 22:25:04'),
(11, 704, '2024-03-04 08:30:00', '2024-03-04 09:00:00', NULL, '2024-03-03 22:25:04', '2024-03-03 22:25:04'),
(12, 704, '2024-03-04 09:00:00', '2024-03-04 09:30:00', NULL, '2024-03-03 22:26:13', '2024-03-03 22:26:13'),
(13, 704, '2024-03-04 09:30:00', '2024-03-04 10:00:00', NULL, '2024-03-03 22:26:13', '2024-03-03 22:26:13'),
(14, 704, '2024-03-04 10:00:00', '2024-03-04 10:30:00', NULL, '2024-03-03 22:28:01', '2024-03-03 22:28:01'),
(15, 704, '2024-03-04 10:30:00', '2024-03-04 11:00:00', NULL, '2024-03-03 22:28:01', '2024-03-03 22:28:01'),
(16, 704, '2024-03-04 11:00:00', '2024-03-04 11:30:00', 'rastin', '2024-03-03 22:34:06', '2024-03-03 22:34:06'),
(17, 709, '2024-03-04 07:30:00', '2024-03-04 08:00:00', 'rastin', '2024-03-03 22:35:19', '2024-03-03 22:35:19'),
(18, 704, '2024-03-04 11:30:00', '2024-03-04 12:00:00', 'rastin', '2024-03-03 22:36:29', '2024-03-03 22:36:29'),
(19, 704, '2024-03-04 15:00:00', '2024-03-04 15:30:00', 'rastin', '2024-03-03 22:39:55', '2024-03-03 22:39:55'),
(20, 704, '2024-03-04 17:30:00', '2024-03-04 18:00:00', 'rastin', '2024-03-03 22:39:55', '2024-03-03 22:39:55'),
(21, 704, '2024-03-15 12:00:00', '2024-03-15 12:30:00', 'test', '2024-03-04 16:22:53', '2024-03-04 16:22:53'),
(22, 704, '2024-03-15 08:00:00', '2024-03-15 08:30:00', 'test', '2024-03-04 16:22:53', '2024-03-04 16:22:53');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_number` varchar(50) NOT NULL,
  `available_status` enum('Available','booked','Maintain') NOT NULL DEFAULT 'Available',
  `booking_start_date` date DEFAULT NULL,
  `booking_end_date` date DEFAULT NULL,
  `room_type` enum('Normal','Big') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `room_number`, `available_status`, `booking_start_date`, `booking_end_date`, `room_type`, `created_at`, `updated_at`, `details`) VALUES
(703, '703', 'Maintain', NULL, NULL, 'Big', '2024-03-04 19:00:28', '2024-03-04 19:29:09', 'microphone broken, แอร์ไม่เย็น'),
(704, '704', 'Available', NULL, NULL, 'Normal', '2024-02-27 12:48:30', '2024-02-27 12:48:30', NULL),
(709, '709', 'Available', NULL, NULL, 'Big', '2024-02-27 12:47:41', '2024-02-27 13:05:23', NULL),
(710, '710', 'Maintain', NULL, NULL, 'Big', '2024-02-27 12:48:17', '2024-03-04 18:41:34', 'bad lights');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'test', 'test@gmail.com', '11111111'),
(2, 'test2', 'test@gmail.com', '22222222'),
(3, 'test3', 'test3@gmail.com', '33333333'),
(4, 'test4', 'test4@gmail.com', '44444444'),
(5, 'test5', 'test5@gmail.com', '55555555'),
(6, 'test6', 's6@gmail.com', '55555555'),
(7, 'test7', 's7@gmail.com', '77777777'),
(8, 'rastin', 'rastinez1337@gmail.com', '12345678');

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
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=711;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
