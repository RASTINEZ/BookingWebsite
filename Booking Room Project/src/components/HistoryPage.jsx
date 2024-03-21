import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';

const HistoryPage = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [username, setUsername] = useState();

  const [filterOption, setFilterOption] = useState('All'); // Default filter option
  const [roomFilter, setRoomFilter] = useState(''); // Default room filter value
  const [filteredHistory, setFilteredHistory] = useState([]);
  

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
   const cancelBooking = (bookingId) => {
    // Make a DELETE request to cancel the booking
    fetch(`http://localhost:8081/cancelBooking/${bookingId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // If the cancellation is successful, fetch the updated booking history
          fetchBookingHistory();
          alert('Cancel booking successful');
          window.location.reload();
        } else {
          console.error('Failed to cancel booking');
          // Handle cancellation failure
        }
      })
      .catch((error) => {
        console.error('Error cancelling booking:', error);
        // Handle cancellation error
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
        <h2>Booking History</h2><br />
        
        <ul>
        <div style={{ margin: '30px auto', width: '80%', display: 'flex',}}>
          <label htmlFor="filterRoom">Filter by Room:&nbsp;&nbsp; </label>
          <input type="text" id="filterRoom" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} />
        </div>
          {filteredHistory.map((booking, index) => (
            
            <li key={index}>
              <strong>{index+1} . </strong><br />
              <strong>Booking ID:</strong> {booking.booking_id}<br />
              <strong>Room:</strong> {booking.room_id}<br />
              <strong>Date & Time:</strong> {booking.start_time} - {booking.end_time}
              <br />
              <button className="custom-button" onClick={() => cancelBooking(booking.booking_id)}>Cancel Booking</button><br /> <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryPage;