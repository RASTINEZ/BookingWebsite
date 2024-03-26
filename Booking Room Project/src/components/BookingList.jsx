import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

const BookingList = () => {
  
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState();
  const [forceUpdate, setForceUpdate] = useState(false); 

  const [filterOption, setFilterOption] = useState('All'); // Default filter option
  const [roomFilter, setRoomFilter] = useState(''); // Default room filter value
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await fetchBookings();
      const storedUsername = localStorage.getItem('username'); 
      setUsername(storedUsername); 
    };
    fetchData();
  }, []); // <-- Add dependencies here
  

  useEffect(() => {
    filterHistory();
  }, [bookings, filterOption, roomFilter]);

  const filterHistory = () => {
    let filtered = bookings;
    if (filterOption !== 'All') {
      filtered = filtered.filter(booking => booking.status === filterOption);
    }
    if (roomFilter !== '') {
      const roomFilterLower = roomFilter.toLowerCase();
      filtered = filtered.filter(booking => `${booking.room_id}`.toLowerCase().includes(roomFilterLower));
    }
    setFilteredHistory(filtered);
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8081/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleRejectButton = (bookingId) => {
    console.log('Reject button clicked for booking ID:', bookingId);
    setSelectedBookingId(bookingId);
    console.log('showPopup before setting:', showPopup);
    setShowPopup(true);
    console.log('showPopup after setting:', showPopup);
  };
  

  const updateBookingStatus = (bookingId, newStatus, detail) => {
    axios.put(`http://localhost:8081/bookings/${bookingId}`, { status: newStatus, detail })
      .then(response => {
        const updatedBookings = bookings.map(booking => {
          if (booking.booking_id === bookingId) {
            return { ...booking, status: newStatus };
          }
          return booking;
        });
        setBookings(updatedBookings);
        alert('Booking status updated successfully');
        setForceUpdate(prev => !prev);
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  const handlePopupSubmit = () => {
    setShowPopup(false);
    updateBookingStatus(selectedBookingId, 'rejected', detail);
  };







const handleDeleteBooking = (bookingId) => {
    // Display a confirmation dialog before deleting the booking
    const isConfirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!isConfirmed) {
        // If the user cancels, do nothing
        return;
    }

    // Send a request to delete the booking with the specified bookingId
    axios.delete(`http://localhost:8081/bookings/${bookingId}`)
        .then((response) => {
            // If the booking is successfully deleted, update the local state
            setBookings(prevBookings => prevBookings.filter(booking => booking.booking_id !== bookingId));
            fetchBookings();
            alert('Booking deleted successfully');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting booking:', error);
        });
};


   



const formatDateAndTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
};


return (
    <div>
      
      <div style={{ margin: '30px auto', width: '80%', display: 'flex', justifyContent: 'flex-end', marginRight: '200px'}}>
        <label htmlFor="filterStatus">Filter by Status:&nbsp;&nbsp;</label>
        <select id="filterStatus" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
          <option value="All">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        &nbsp;&nbsp;
        <label htmlFor="filterRoom">Filter by Room:&nbsp;&nbsp; </label>
        <input type="text" id="filterRoom" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} />
      </div>
      <div className="admin-container">
        <h2>Booking List&nbsp;&nbsp;</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th className="top-column">No.</th>
              <th className="top-column">Booking ID</th>
              <th className="top-column">User</th>
              <th className="top-column">Room</th>
              <th className="top-column">Start Time</th>
              <th className="top-column">End Time</th>
              <th className="top-column">Status</th>
              <th className="top-column">Check In</th>
              <th className="top-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((booking, index) => (
              <tr key={booking.booking_id} className="user-column">
                <td>{index + 1}</td>
                <td>{booking.booking_id}</td>
                <td>{booking.booked_by}</td>
                <td>{booking.room_id}</td>
                <td>{formatDateAndTime(booking.start_time)}</td>
                <td>{formatDateAndTime(booking.end_time)}</td>
                <td>{booking.status}</td>
                <td>{booking.check_in}</td>
                <td>
                  <button className="green-button" onClick={() => updateBookingStatus(booking.booking_id, 'confirmed')}>Confirm</button>&nbsp;&nbsp;
                  <button className="yellow-button" onClick={() => handleRejectButton(booking.booking_id)}>Reject</button>&nbsp;&nbsp;
                  <button className="red-button" onClick={() => handleDeleteBooking(booking.booking_id)}>Delete</button> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div style={{ marginBottom: '20px' }}></div>
    </div>
  );
};
  



export default BookingList;
