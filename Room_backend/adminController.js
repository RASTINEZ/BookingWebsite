const mysql = require('mysql');

// Create a MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '',
  database: 'room_database'
});

// Function to fetch all users from the database
const getUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'An error occurred while fetching users' });
    }
    return res.json(data);
  });
};



// Function to delete a user (example)
const deleteUser = (req, res) => {
  // Logic to delete a user
};

// Endpoint to get all bookings
const getBookings = (req, res) => {
    const sql = "SELECT * FROM bookings";
    db.query(sql, (err, bookings) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'An error occurred while fetching bookings' });
        }
        return res.json(bookings);
    });
    
        
    
};

// Function to handle deletion of a booking
const deleteBooking = (req, res) => {
    const { bookingId } = req.params;

    // Perform the deletion logic in the database
    // Example SQL query: DELETE FROM bookings WHERE booking_id = ?
    db.query('DELETE FROM bookings WHERE booking_id = ?', [bookingId], (err, result) => {
        if (err) {
            console.error('Error deleting booking:', err);
            return res.status(500).json({ error: 'An error occurred while deleting booking' });
        }
        // Check if the booking was found and deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Booking successfully deleted
        return res.status(200).json({ message: 'Booking deleted successfully' });
    });
};
// Function to handle the update of a user's role
const updateUserRole = (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
  
    // Perform the logic to update the user's role in the database
    // Example SQL query: UPDATE users SET role = ? WHERE id = ?
    db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], (err, result) => {
      if (err) {
        console.error('Error updating user role:', err);
        return res.status(500).json({ error: 'An error occurred while updating user role' });
      }
      // Check if the user was found and role updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      // User role successfully updated
      return res.status(200).json({ message: 'User role updated successfully' });
    });
  };

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getBookings,
  deleteBooking,
  updateUserRole
};
