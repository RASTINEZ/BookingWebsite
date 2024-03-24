const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
const bodyParser = require('body-parser');
const adminRoutes = require('./adminRoutes');


const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'room_database'
});



// Retrieve all users
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'An error occurred while fetching users' });
        }
        return res.json(data);
    });
});

// Retrieve all bookings
app.get('/bookings', (req, res) => {
    const sql = "SELECT * FROM bookings";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'An error occurred while fetching users' });
        }
        return res.json(data);
    });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if username already exists
    const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
    db.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
        if (checkUsernameErr) {
            console.error('Error checking username:', checkUsernameErr);
            return res.status(500).json({ error: 'An error occurred during registration' });
        }
        if (checkUsernameResult.length > 0) {
            // Username already exists
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if email already exists
        const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
        db.query(checkEmailQuery, [email], (checkEmailErr, checkEmailResult) => {
            if (checkEmailErr) {
                console.error('Error checking email:', checkEmailErr);
                return res.status(500).json({ error: 'An error occurred during registration' });
            }
            if (checkEmailResult.length > 0) {
                // Email already exists
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Insert new user if username and email don't exist
            const insertUserQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            db.query(insertUserQuery, [username, email, password], (insertErr, result) => {
                if (insertErr) {
                    console.error('Error inserting user:', insertErr);
                    return res.status(500).json({ error: 'An error occurred during registration' });
                }
                console.log('User registered successfully');
                res.status(200).json({ message: 'User registered successfully' });
            });
        });
    });
});


// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'An error occurred during login' });
        }
        if (results.length === 0) {
            // User not found
            return res.status(404).json({ error: 'User not found' });
        }
        const user = results[0];
        if (user.password !== password) {
            // Incorrect password
            return res.status(401).json({ error: 'Incorrect password' });
        }
        // Login successful
        return res.status(200).json({ message: 'Login successful' });
    });
});

//Rooms endpoint
app.get('/rooms', (re,res) => {
    const sql = "SELECT * FROM rooms WHERE available_status = 'ready'";
    db.query(sql,(err, data) =>{
        if(err) return res.json(err);
        return res.json(data);

    });
    

});



// Endpoint to get schedule for a specific room and date
app.get('/schedule/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { date } = req.query;

    // Query the bookings table for bookings for the specified room and date
    const sql = "SELECT start_time, end_time FROM bookings WHERE room_id = ? AND DATE(start_time) = ?";
    db.query(sql, [roomId, date], (err, bookings) => {
        if (err) {
            console.error('Error fetching schedule:', err);
            return res.status(500).json({ error: 'An error occurred while fetching schedule' });
        }
        
        // If there are no bookings for the specified room and date, generate available time slots
        if (bookings.length === 0) {
            const availableTimeSlots = [];
            const startTime = 7; // 07:00 AM
            const endTime = 20; // 08:00 PM
            for (let hour = startTime; hour <= endTime; hour++) {
                const time = `${hour < 10 ? '0' + hour : hour}:00`;
                availableTimeSlots.push({ startTime: time, endTime: time, available: true });
            }
            return res.json(availableTimeSlots);
        }
        
        // Format the schedule data based on existing bookings
        const schedule = bookings.map(booking => ({
            startTime: booking.start_time,
            endTime: booking.end_time,
            available: false, // Mark booked time slots as not available
        }));

        res.json(schedule);
    });
});

// Import the email service module
const { sendEmail } = require('./emailService');
const { sendEmail2 } = require('./emailService');

//update booking endpoint  
app.put('/bookings/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const { status, detail } = req.body;

    // Update booking status and detail in the database
    const updateSql = "UPDATE bookings SET status = ?, detail = ? WHERE booking_id = ?";
    db.query(updateSql, [status, detail, bookingId], (updateErr, result) => {
        if (updateErr) {
            console.error('Error updating booking status:', updateErr);
            return res.status(500).json({ error: 'An error occurred while updating booking status' });
        }
        console.log('Booking status updated successfully');

        // Retrieve booking details
        const getBookingSql = "SELECT * FROM bookings WHERE booking_id = ?";
        db.query(getBookingSql, [bookingId], (fetchErr, booking) => {
            if (fetchErr) {
                console.error('Error fetching booking details:', fetchErr);
                return res.status(500).json({ error: 'An error occurred while fetching booking details' });
            }
            if (booking.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            
            // Retrieve user's email based on the username
            const getEmailSql = "SELECT email FROM users WHERE username = ?";
            db.query(getEmailSql, [booking[0].booked_by], (emailErr, emailResults) => {
                if (emailErr) {
                    console.error('Error fetching user email:', emailErr);
                    return res.status(500).json({ error: 'An error occurred while fetching user email' });
                }
                if (emailResults.length === 0) {
                    return res.status(404).json({ error: 'User email not found' });
                }
                const userEmail = emailResults[0].email;

                // Send email after booking status is successfully updated
                sendEmail(userEmail, booking[0].booked_by, booking[0].room_id, booking[0].start_time, booking[0].end_time, status, bookingId, booking[0].detail);

                // Send response indicating success
                res.status(200).json({ message: 'Booking status updated successfully' });
            });
        });
    });
});






// Endpoint to add bookings to the database
app.post('/bookings2', (req, res) => {
    const { roomId, date, selectedSlots, username } = req.body;

    // Retrieve user's role based on the username
    const getRoleSql = "SELECT role FROM users WHERE username = ?";
    db.query(getRoleSql, [username], (roleErr, roleResults) => {
        if (roleErr) {
            console.error('Error fetching user role:', roleErr);
            return res.status(500).json({ error: 'An error occurred while fetching user role' });
        }
        if (roleResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userRole = roleResults[0].role;

        // Insert bookings into the database
        const insertSql = "INSERT INTO bookings (room_id, start_time, end_time, booked_by, status) VALUES (?, ?, ?, ?, ?)";
        selectedSlots.forEach(slot => {
            let status = 'Pending';
            if (userRole === 'teacher' || userRole === 'admin') {
                status = 'Confirmed';
            }
            db.query(insertSql, [roomId, `${date} ${slot.startTime}`, `${date} ${slot.endTime}`, username, status], (insertErr, result) => {
                if (insertErr) {
                    console.error('Error inserting booking:', insertErr);
                    return res.status(500).json({ error: 'An error occurred while inserting booking' });
                }
                console.log('Booking inserted successfully');

                // Retrieve the last inserted booking's ID
                const bookingIdSql = "SELECT LAST_INSERT_ID() AS bookingId";
                db.query(bookingIdSql, (bookingIdErr, bookingIdResults) => {
                    if (bookingIdErr) {
                        console.error('Error fetching booking ID:', bookingIdErr);
                        return res.status(500).json({ error: 'An error occurred while fetching booking ID' });
                    }
                    const bookingId = bookingIdResults[0].bookingId;

                    // Retrieve user's email based on the username
                    const getEmailSql = "SELECT email FROM users WHERE username = ?";
                    db.query(getEmailSql, [username], (emailErr, emailResults) => {
                        if (emailErr) {
                            console.error('Error fetching user email:', emailErr);
                            return res.status(500).json({ error: 'An error occurred while fetching user email' });
                        }
                        if (emailResults.length === 0) {
                            return res.status(404).json({ error: 'User email not found' });
                        }
                        const userEmail = emailResults[0].email;

                        // Send email after booking is successfully created
                        sendEmail2(userEmail, username, roomId, date, slot.startTime, slot.endTime, status, bookingId);
                    });
                });
            });
        });

        res.status(200).json({ message: 'Bookings added successfully' });
    });
});











  

app.get('/bookingHistory', (req, res) => {
    const { username } = req.query;
    // Query the database to retrieve booking history for the specified username
    const sql = "SELECT * FROM bookings WHERE booked_by = ?";
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching booking history:', err);
            return res.status(500).json({ error: 'An error occurred while fetching booking history' });
        }
        return res.json(results);
    });
});







// Assuming you're using Express.js
app.delete('/cancelBooking/:bookingId', (req, res) => {
  const { bookingId } = req.params;

  // Perform the cancellation logic, such as updating the database
  const sql = 'DELETE FROM bookings WHERE booking_id = ?';
  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error('Error cancelling booking:', err);
      return res.status(500).json({ error: 'An error occurred while cancelling booking' });
    }
    // Check if the booking was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    // Booking successfully cancelled
    return res.status(200).json({ message: 'Booking cancelled successfully' });
  });
});

app.put('/checkinBooking/:bookingId', (req, res) => {
    const { bookingId } = req.params;

  // Perform the cancellation logic, such as updating the database
  db.query('UPDATE bookings SET check_in = ? WHERE booking_id = ?', ['yes', bookingId], (err, result) => {
    if (err) {
      console.error('Error check in booking:', err);
      return res.status(500).json({ error: 'An error occurred while checking in booking' });
    }
    // Check if the booking was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    // Booking successfully cancelled
    return res.status(200).json({ message: 'Check in successfully' });
  });
});


// Backend route to update booking status
app.put('/bookings/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const newStatus = req.body.status; // Access newStatus directly from req.body

    // Update the status of the booking in the database
    // Example SQL query: UPDATE bookings SET status = ? WHERE booking_id = ?
    db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [newStatus, bookingId], (err, result) => {
        if (err) {
            console.error('Error updating booking status:', err);
            return res.status(500).json({ error: 'An error occurred while updating booking status' });
        }
        
        // Get the booking details from the database
        const getBookingSql = "SELECT * FROM bookings WHERE booking_id = ?";
        db.query(getBookingSql, [bookingId], (getBookingErr, bookingData) => {
            if (getBookingErr) {
                console.error('Error fetching booking details:', getBookingErr);
                return res.status(500).json({ error: 'An error occurred while fetching booking details' });
            }
            if (bookingData.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            
            const { booked_by, room_id, start_time, end_time } = bookingData[0];
            
            // Retrieve user's email based on the booked_by username
            const getUserEmailSql = "SELECT email FROM users WHERE username = ?";
            db.query(getUserEmailSql, [booked_by], (getUserEmailErr, userEmailData) => {
                if (getUserEmailErr) {
                    console.error('Error fetching user email:', getUserEmailErr);
                    return res.status(500).json({ error: 'An error occurred while fetching user email' });
                }
                if (userEmailData.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                const userEmail = userEmailData[0].email;
                
                // Send email after updating booking status
                sendEmail(userEmail, booked_by, room_id, start_time, end_time, newStatus);
                
                // Return success response if the status is updated and email is sent successfully
                return res.status(200).json({ message: 'Booking status updated successfully and email sent' });
            });
        });
    });
});






// Endpoint to get rooms in 'maintain' status
app.get('/maintain', (req, res) => {
    const sql = "SELECT * FROM rooms WHERE available_status = 'maintain'";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching rooms in maintain status:', err);
            return res.status(500).json({ error: 'An error occurred while fetching rooms in maintain status' });
        }
        return res.json(data);
    });
});

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

// Update user role based on username
app.put('/users/:username/update-role', (req, res) => {
    const { username } = req.params;
    const { newRole } = req.body;

    // Logic to update user role based on username
    // Example SQL query: UPDATE users SET role = ? WHERE username = ?
    db.query('UPDATE users SET role = ? WHERE username = ?', [newRole, username], (err, result) => {
        if (err) {
            console.error('Error updating user role:', err);
            return res.status(500).json({ error: 'An error occurred while updating user role' });
        }
        // Check if the user was found and role was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or role not updated' });
        }
        // User role successfully updated
        return res.status(200).json({ message: 'User role updated successfully' });
    });
});




// Route to delete a booking
app.delete('/bookings/:bookingId', deleteBooking);


// Mount admin routes
app.use('/admin', adminRoutes);








app.listen(8081, () => {
    console.log("Listening on port 8081");
});