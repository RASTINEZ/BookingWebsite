const express = require('express');
const router = express.Router();
const adminController = require('./adminController');


// Define routes for admin functionality
router.get('/users', adminController.getUsers);
router.get('/bookings', adminController.getBookings);
router.put('/users/:userId', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);
// DELETE request to delete a booking by bookingId
router.delete('/bookings/:bookingId', adminController.deleteBooking);
// Route to update a user's role
router.put('/users/:userId', adminController.updateUserRole);

module.exports = router;
