import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import UserList from './UserList';
import BookingList from './BookingList';
import RoomsPage from './RoomsPage';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState();

  const [selectedOption, setSelectedOption] = useState('User List');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    const storedUsername = localStorage.getItem('username'); 
    console.log('Stored username:', storedUsername); // Check if username is retrieved
    setUsername(storedUsername); 
  }, []); // Removed unnecessary dependency array

  const fetchUsers = () => {
    axios.get('http://localhost:8081/admin/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8081/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleStatusChange = (bookingId, newStatus) => {
    axios.put(`http://localhost:8081/bookings/${bookingId}`, { status: newStatus })
      .then(response => {
        // Fetch bookings again to update the list
        fetchBookings();
        // Alert
        alert('Booking status updated successfully');
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  return (
    <div>
  <NavBar username={username} />
  <div className="admin-container" style={{ textAlign: 'center' }}>
    
    <div className="select-option">
    <h1 style={{ textAlign: 'center', color: 'black' }}>Admin Panel</h1>
      <label htmlFor="option" style={{ color: 'black' }}>Select Option: &nbsp; </label>
      <select id="option" value={selectedOption} onChange={(e) => handleOptionChange(e.target.value)}>
        <option value="User List">User List</option>
        <option value="Booking List">Booking List</option>
        <option value="Rooms Page">Rooms Page</option>
      </select>

      {selectedOption === 'User List' && (
      <div style={{ textAlign: 'center', color: 'black' }}>
        <br/>
        <UserList users={users} />
      </div>
    )}
    {selectedOption === 'Booking List' && (
      <div style={{ textAlign: 'center', color: 'black' }}>
        
        <BookingList bookings={bookings} handleStatusChange={handleStatusChange} />
      </div>
    )}
    {selectedOption === 'Rooms Page' && (
      <div style={{ textAlign: 'center', color: 'black' }}>
        
        <RoomsPage  />
      </div>
    )}
    </div>
    
  </div>
</div>
  );
};

export default AdminPage;
