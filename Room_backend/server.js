const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');
const moment = require('moment');


const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
const bodyParser = require('body-parser');
const adminRoutes = require('./adminRoutes');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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

app.get('/getname/:username', (req, res) => {
    const { username } = req.params;
    const sql = "SELECT first_name, last_name, role FROM users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error('Error retrieving name:', err);
        return res.status(500).json({ error: 'An error occurred while retrieving name' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { first_name, last_name, role } = result[0];
      return res.status(200).json({ first_name, last_name, role });
    });
});

// Retrieve user data
app.get('/user', (req, res) => {
    const { username } = req.query;
    // Query the database to retrieve info for the specified username
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching booking history:', err);
            return res.status(500).json({ error: 'An error occurred while fetching booking history' });
        }
        return res.json(results);
    });
});
  
 // Update user data
app.put('/user', (req, res) => {
    const { username, firstName, lastName, email, password } = req.body;


    // Update user data in the database based on the username
    db.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE username = ?', [firstName, lastName, email, password, username], (error, results) => {
        if (error) {
            console.error('Error updating user data:', error);
            return res.status(500).json({ error: 'An error occurred while updating user data' });
        }

        // Check if any rows were affected by the update operation
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // User data updated successfully
        res.json({ message: 'User data updated successfully' });
    });
});

  
  




// Retrieve problematic bookings with associated user and room information
app.get('/getProblematicBookings', (req, res) => {
    const sql = `
        SELECT 
            bookings.*, 
            users.username AS user_username, 
            users.email,
            rooms.room_number, 
            rooms.building 
        FROM 
            bookings 
        JOIN 
            users ON bookings.booked_by = users.username 
        JOIN 
            rooms ON bookings.room_id = rooms.room_number 
        WHERE 
            bookings.detail IS NOT NULL AND TRIM(bookings.detail) != ''
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching problematic bookings:', err);
            return res.status(500).json({ error: 'An error occurred while fetching problematic bookings' });
        }
        return res.json(data);
    });
});



// Endpoint to send emails
app.post('/sendEmailsToUsers', (req, res) => {
    const { emails, subject, message } = req.body;

    // Call your email service function to send emails
    sendEmailToUsers(emails, subject, message)
        .then(() => {
            res.json({ message: 'Emails sent successfully' });
        })
        .catch(error => {
            console.error('Error sending emails:', error);
            res.status(500).json({ error: 'Failed to send emails' });
        });
});


// Retrieve unique users and their emails who booked the specified room
app.get('/getBookingUsers', (req, res) => {
    const { roomNumber } = req.query;
    const sql = `
        SELECT DISTINCT users.username, users.email
        FROM bookings
        JOIN users ON bookings.booked_by = users.username
        WHERE bookings.room_id = '${roomNumber}'
    `;
    db.query(sql, (err, users) => {
        if (err) {
            console.error('Error fetching booking users:', err);
            return res.status(500).json({ error: 'An error occurred while fetching booking users' });
        }
        return res.json(users);
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
// Retrieve all bookings with room details
app.get('/bookingsForChart', (req, res) => {
    const sql = "SELECT b.*, r.room_number, r.room_type, r.building, r.available_status FROM bookings b INNER JOIN rooms r ON b.room_id = r.room_number";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'An error occurred while fetching bookings' });
        }
        return res.json(data);
    });
});


// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password, firstName, lastName, phone, studentId } = req.body;
    
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
            const insertUserQuery = "INSERT INTO users (username, email, password, first_name, last_name, phone_number, student_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            db.query(insertUserQuery, [username, email, password, firstName, lastName, phone, studentId], (insertErr, result) => {
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

// //Rooms endpoint
// app.get('/rooms', (re,res) => {
//     const sql = "SELECT * FROM rooms WHERE available_status = 'ready'";
//     db.query(sql,(err, data) =>{
//         if(err) return res.json(err);
//         return res.json(data);

//     });
    

// });
// Rooms endpoint with building filter
app.get('/rooms', (req, res) => {
    const { building } = req.query;
    let sql = "SELECT * FROM rooms WHERE available_status = 'ready'";
  
    if (building && building !== 'All') {
        sql += ` AND building = '${building}'`;
      }
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  // Rooms endpoint with building filter
app.get('/allrooms', (req, res) => {
    const { building } = req.query;
    let sql = "SELECT * FROM rooms";
  
    if (building && building !== 'All') {
        sql += ` WHERE building = '${building}'`; // Include WHERE clause if building is provided
    }
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

  
// Endpoint to get image path for a specific room
app.get('/room-image/:roomId', (req, res) => {
    const { roomId } = req.params;

    // Query the rooms table for the image path of the specified room
    const sql = "SELECT room_schedule_image_path FROM rooms WHERE id = ?";
    db.query(sql, [roomId], (err, results) => {
        if (err) {
            console.error('Error fetching room image:', err);
            return res.status(500).json({ error: 'An error occurred while fetching room image' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const imagePath = results[0].room_schedule_image_path; // Corrected

        res.json({ imagePath });
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
const { sendEmailToAdmin } = require('./emailService');
const { sendEmailToUsers } = require('./emailService');

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
    const { roomId, date, selectedSlots, username, reason } = req.body;

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
        const insertSql = "INSERT INTO bookings (room_id, start_time, end_time, booked_by, status, booking_reason) VALUES (?, ?, ?, ?, ?, ?)";
        selectedSlots.forEach(slot => {
            let status = 'Pending';
            if (userRole === 'teacher' || userRole === 'admin') {
                status = 'Confirmed';
            }
            db.query(insertSql, [roomId, `${date} ${slot.startTime}`, `${date} ${slot.endTime}`, username, status, reason], (insertErr, result) => {
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
                        sendEmail2(userEmail, username, roomId, date, slot.startTime, slot.endTime, status, bookingId, reason);
                    });
                });
            });
        });

        res.status(200).json({ message: 'Bookings added successfully' });
    });
});












  

// app.get('/bookingHistory', (req, res) => {
//     const { username } = req.query;
//     // Query the database to retrieve booking history for the specified username
//     const sql = "SELECT * FROM bookings WHERE booked_by = ?";
//     db.query(sql, [username], (err, results) => {
//         if (err) {
//             console.error('Error fetching booking history:', err);
//             return res.status(500).json({ error: 'An error occurred while fetching booking history' });
//         }
//         return res.json(results);
//     });
// });
app.get('/bookingHistory', (req, res) => {
    const { username } = req.query;
    // Query the database to retrieve booking history for the specified username
    const sql = `
        SELECT b.*, r.building
        FROM bookings b
        INNER JOIN rooms r ON b.room_id = r.room_number
        WHERE b.booked_by = ?`;
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching booking history:', err);
            return res.status(500).json({ error: 'An error occurred while fetching booking history' });
        }
        return res.json(results);
    });
});









app.put('/cancelBooking/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const { detail } = req.body; // Assuming the detail is sent in the request body
  
    // Perform the cancellation logic, such as updating the database
    const sql = 'UPDATE bookings SET status = ?, detail = ? WHERE booking_id = ?';
    db.query(sql, ['cancelled', detail, bookingId], (err, result) => {
      if (err) {
        console.error('Error cancelling booking:', err);
        return res.status(500).json({ error: 'An error occurred while cancelling booking' });
      }
      // Check if the booking was found and updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      // Booking successfully cancelled
      return res.status(200).json({ message: 'Booking cancelled successfully' });
    });
  });
  

  app.put('/checkinBooking/:bookingId', (req, res) => {
    const { bookingId } = req.params;

    // Perform the check-in logic and update the checkin_time column using MySQL's NOW() function
    db.query('UPDATE bookings SET check_in = ?, checkin_time = NOW() WHERE booking_id = ?', ['yes', bookingId], (err, result) => {
        if (err) {
            console.error('Error checking in booking:', err);
            return res.status(500).json({ error: 'An error occurred while checking in booking' });
        }
        // Check if the booking was found and updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Booking successfully checked in
        return res.status(200).json({ message: 'Check in successful' });
    });
});

  


// Endpoint to report a problem for a specific booking
app.put('/reportProblem/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const { topic, detail } = req.body;

    // Concatenate the topic with the existing detail
    const updatedDetail = `${topic}: ${detail}`;

    // Perform the logic to update the detail in the database
    const updateDetailQuery = 'UPDATE bookings SET detail = ? WHERE booking_id = ?';
    db.query(updateDetailQuery, [updatedDetail, bookingId], (err, result) => {
        if (err) {
            console.error('Error updating detail:', err);
            return res.status(500).json({ error: 'An error occurred while updating detail' });
        }
        // Check if the booking was found and updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        // Get the room_id for the booking
        const getRoomIdQuery = 'SELECT room_id FROM bookings WHERE booking_id = ?';
        db.query(getRoomIdQuery, [bookingId], (err, rows) => {
            if (err) {
                console.error('Error fetching room_id:', err);
                return res.status(500).json({ error: 'An error occurred while fetching room_id' });
            }
            
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            
            const roomId = rows[0].room_id;
            // Booking detail successfully updated
            // Now, send an email to the admin
            sendEmailToAdmin(bookingId, roomId, updatedDetail);
            return res.status(200).json({ message: 'Booking detail updated successfully' });
        });
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