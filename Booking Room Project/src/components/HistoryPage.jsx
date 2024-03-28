import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import axios from 'axios';

const HistoryPage = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [username, setUsername] = useState();

  const [filterOption, setFilterOption] = useState('All'); // Default filter option
  const [roomFilter, setRoomFilter] = useState(''); // Default room filter value
  const [filteredHistory, setFilteredHistory] = useState([]);
  // const sortedHistory = [...filteredHistory].sort((a, b) => new Date(b.start_time) - new Date(a.start_time)); date sorting
  const sortedHistory = [...filteredHistory].sort((a, b) => b.booking_id - a.booking_id);
  const [showPopup, setShowPopup] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [detail, setDetail] = useState('');
  

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); 
    console.log('Stored username:', storedUsername); // Check if username is retrieved
    setUsername(storedUsername); 
  
    if (storedUsername) {
      fetchBookingHistory(storedUsername);
    }
  }, []);


  useEffect(() => {
    filterHistory();
  }, [bookingHistory, filterOption, roomFilter]);


  
  const fetchBookingHistory = (username) => {
    const url = `http://localhost:8081/bookingHistory?username=${username}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Booking history data:', data); // Log the response data

        const formattedBookingHistory = data.map((booking) => ({
          ...booking,
          start_time: formatDateAndTime(booking.start_time),
          end_time: formatDateAndTime(booking.end_time),
        }));
        // Update the state with the formatted booking history
        setBookingHistory(formattedBookingHistory);
      })
      .catch(error => {
        console.error('Error fetching booking history:', error);
        // Handle error
      });
  };

   // Function to cancel a booking
   const cancelBooking = (bookingId, detail) => {
    axios.put(`http://localhost:8081/cancelBooking/${bookingId}`, { detail })
    .then(response => {
      alert('Booking cancelled successfully');
      // Optional: Update local state or perform any necessary actions
      fetchBookingHistory(username); // Fetch updated booking history
    })
    .catch(error => {
      console.error('Error reporting problem:', error);
      alert('Error reporting problem. Please try again later.');
    });
  };

  const filterHistory = () => {
    let filtered = bookingHistory;
  
    if (filterOption !== 'All') {
      filtered = filtered.filter(booking => booking.status === filterOption);
    }
  
    if (roomFilter !== '') {
      // Convert room_id to string and then apply toLowerCase()
      const roomFilterLower = roomFilter.toLowerCase();
      filtered = filtered.filter(booking => `${booking.room_id}`.toLowerCase().includes(roomFilterLower));
    }
  
    setFilteredHistory(filtered);
  };
  
  
  
  const formatDateAndTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate} ${formattedTime}`;
  };


  const handleCheckIn = (bookingId) => {
    const isConfirmed = window.confirm("Are you sure you want to check in for this booking?");
    if (!isConfirmed) {
        // If the user cancels, do nothing
        return;
    }

    // Send a request to update the check-in status to 'yes'
    axios.put(`http://localhost:8081/checkinBooking/${bookingId}`)
        .then(response => {
            // Update local state or perform any necessary actions
            alert('Check-in successful');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error checking in:', error);
            // Handle error or display error message
            alert('Error checking in. Please try again later.');
        });
};

// Function to handle submitting the problem report
const handleReportButton = (bookingId) => {
  setSelectedBookingId(bookingId);
  setShowPopup(true);
};
// Function to handle submitting the problem report to the backend
const handlePopupSubmit = () => {
  setShowPopup(false);
  reportProblem(selectedBookingId, detail);
};

const handleCancelButton = (bookingId) => {
  setSelectedBookingId(bookingId);
  setShowDeletePopup(true);
};

const handlePopupCancelSubmit = () => {
  setShowDeletePopup(false);
  cancelBooking(selectedBookingId, detail);
};



// Function to report the problem
const reportProblem = (bookingId, detail) => {
  axios.put(`http://localhost:8081/reportProblem/${bookingId}`, { detail })
    .then(response => {
      alert('Problem reported successfully');
      // Optional: Update local state or perform any necessary actions
      fetchBookingHistory(username); // Fetch updated booking history
    })
    .catch(error => {
      console.error('Error reporting problem:', error);
      alert('Error reporting problem. Please try again later.');
    });
};





  return (
    
    <div>
      <NavBar username={username} />
      
      <div className="container" style={{ 
      border: '5px solid black', 
      padding: '20px', 
      margin: '20px auto', // Change this line
      width: '80%', // Add this line
      display: 'flex',
      
    }} >
        <h2 style={{ color: 'black' }}>Booking History</h2><br />
        
        <ul className="booking-list">
        <div style={{ margin: '30px auto', width: '80%', display: 'flex',}}>
          <label htmlFor="filterRoom" style={{ color: 'black' }}>Filter by Room:&nbsp;&nbsp; </label>
          <input type="text" id="filterRoom" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} />
        </div>
        <table className="booking-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Booking ID</th>
          <th>Room</th>
          <th>Date & Time</th>
          <th>Status</th>
          <th>Check-in</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedHistory.map((booking, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{booking.booking_id}</td>
            <td>{booking.room_id} ({booking.building})</td>
            <td>{booking.start_time} - {booking.end_time}</td>
            <td>{booking.status}  {(booking.status === 'rejected' || booking.status === 'cancelled') && (
                          <span>
                            <br />
                              <strong>&nbsp; (Detail:</strong> {booking.detail})
                          </span>
                          )}
                    <br /></td>
            
            <td>{booking.check_in}</td>
            <td>
              {booking.check_in === 'no' && booking.status === 'confirmed' && (
                <button className="checkin-blue-button" onClick={() => handleCheckIn(booking.booking_id)}>Check In</button>
              )}&nbsp;
              {booking.check_in === 'yes' && booking.status !== 'rejected' && booking.status !== 'cancelled' && (
                <button className="red-button" onClick={() => handleReportButton(booking.booking_id)}>Report Problem</button>
              )}
              {booking.check_in === 'no' && booking.status !== 'rejected' && booking.status !== 'cancelled' && (
                <button className="yellow-button" onClick={() => handleCancelButton(booking.booking_id)}>Cancel Booking</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        </ul>

      </div>
      {showPopup && (
        <div className="popup-container">
        <div className="popup">
          <h3>Add Detail</h3>
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} />
          <div className="submit-buttons">

            <button onClick={handlePopupSubmit}>Submit</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
            
          </div>
        </div>
      </div>
      )}
      
      {showDeletePopup && (
        <div className="popup-container">
        <div className="popup">
          <h3>Add Detail</h3>
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} />
          <div className="submit-buttons">

            <button onClick={handlePopupCancelSubmit}>Submit</button>
            <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
            
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default HistoryPage;