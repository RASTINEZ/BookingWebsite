import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState();
  const [forceUpdate, setForceUpdate] = useState(false); 

  const [filterOption, setFilterOption] = useState('All'); // Default filter option
  const [roomFilter, setRoomFilter] = useState(''); // Default room filter value
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    const storedUsername = localStorage.getItem('username'); 
    console.log('Stored username:', storedUsername); // Check if username is retrieved
    setUsername(storedUsername); 
  
    
  }, [[forceUpdate]]);

  useEffect(() => {
    filterHistory();
  }, [bookings, filterOption, roomFilter]);

  const filterHistory = () => {
    let filtered = bookings;
  
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

  const fetchUsers = () => {
    axios.get('http://localhost:8081/admin/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleUpdateUserRole = (user) => {
    // Send a request to update the user's role in the database
    axios.put(`http://localhost:8081/admin/users/${user.id}`, { role: user.role })
      .then(() => {
        // If the role is successfully updated, you can optionally fetch the updated user list
        fetchUsers();
        // Optionally display a success message
        alert('User role updated successfully');
      })
      .catch(error => {
        console.error('Error updating user role:', error);
        // Optionally display an error message
        alert('Error updating user role');
      });
  };
  
  
  const updateUserRole = (user, selectedRole) => {
    const isConfirmed = window.confirm(`Are you sure you want to update the role of ${user.username} to ${selectedRole}?`);
    if (isConfirmed) {
        const updatedUser = { ...user, role: selectedRole };
        handleUpdateUserRole(updatedUser);
    } else {
        // User cancelled the action
        // Optionally, you can handle this case (e.g., display a message)
    }
};

  const handleDeleteUser = (userId) => {
    // Logic to delete user
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
            // Update local state
            const updatedBookings = bookings.map(booking => {
                if (booking.booking_id === bookingId) {
                    return { ...booking, status: newStatus };
                }
                return booking;
            });
            setBookings(updatedBookings);

            // Alert
            alert('Booking status updated successfully');
            
            // Force component re-render
            setForceUpdate(prev => !prev);
        })
        .catch(error => {
            console.error('Error updating booking status:', error);
        });
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
      <NavBar username={username} />
      <div className="admin-container">
        <h2>User List&nbsp;&nbsp;</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                <select onChange={(e) => updateUserRole(user, e.target.value)}>
                    <option value="user">User</option>
                    <option value="teacher">Teacher</option>
                    <option value="mod">Moderator</option>
                    <option value="admin">Admin</option>
                </select>&nbsp;&nbsp;
                
                  <button className="red-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Add space between tables */}
      <div style={{ marginBottom: '20px' }}></div>

      {/* filter seach bar  */}
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
        

        <table>
          
          <thead>
            <tr>
              <th>No.</th>
              <th>Booking ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          

            {filteredHistory.map((booking, index) => (
              <tr key={booking.booking_id}>
                <td>{index + 1}</td> {/* Counter */}
                <td>{booking.booking_id}</td>
                <td>{booking.booked_by}</td>
                <td>{booking.room_id}</td>
                <td>{formatDateAndTime(booking.start_time)}</td>
                <td>{formatDateAndTime(booking.end_time)}</td>
                <td>{booking.status}</td>
                <td>
                  <button className="green-button" onClick={() => handleStatusChange(booking.booking_id, 'confirmed')}>Confirm</button>&nbsp;&nbsp;
                  <button className="yellow-button" onClick={() => handleStatusChange(booking.booking_id, 'rejected')}>Reject</button>&nbsp;&nbsp;
                  {/* delete button
                  <button className="red-button" onClick={() => handleDeleteBooking(booking.booking_id)}>Delete</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add space between tables */}
      <div style={{ marginBottom: '20px' }}></div>
    </div>
  );
  

};

export default AdminPage;
