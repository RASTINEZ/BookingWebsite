const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

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
    const sql = "SELECT * FROM rooms WHERE available_status = 'available'";
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


  
// Endpoint to add bookings to the database
app.post('/bookings', (req, res) => {
    const { roomId, date, selectedSlots, username } = req.body;

    // Validate incoming data

    // Insert bookings into the database
    const sql = "INSERT INTO bookings (room_id, start_time, end_time, booked_by) VALUES (?, ?, ?, ?)";
    selectedSlots.forEach(slot => {
        db.query(sql, [roomId, `${date} ${slot.startTime}`, `${date} ${slot.endTime}`, username], (err, result) => {
            if (err) {
                console.error('Error inserting booking:', err);
                return res.status(500).json({ error: 'An error occurred while inserting booking' });
            }
            console.log('Booking inserted successfully');
        });
    });

    res.status(200).json({ message: 'Bookings added successfully' });
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








app.listen(8081, () => {
    console.log("Listening on port 8081");
});
