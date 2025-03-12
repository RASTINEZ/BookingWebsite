import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState();
  const [forceUpdate, setForceUpdate] = useState(false); 

  

  useEffect(() => {
    fetchUsers();
    
    const storedUsername = localStorage.getItem('username'); 
    console.log('Stored username:', storedUsername); // Check if username is retrieved
    setUsername(storedUsername); 
  
    
  }, []);

  



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

  

   



const formatDateAndTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
};


return (
    <div>
      
      <div className="admin-container">
        <h2>User List&nbsp;&nbsp;</h2>
        <table className="user-table">
      <thead>
        <tr>
          <th className="top-column">User ID</th>
          <th className="top-column">Username</th>
          <th className="top-column">First name</th>
          <th className="top-column">Last name</th>
          <th className="top-column">Email</th>
          <th className="top-column">Phone</th>
          <th className="top-column">Student ID</th>
          <th className="top-column">Role</th>
          <th className="top-column">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="user-column">
            <td >{user.id}</td>
            <td >{user.username}</td>
            <td >{user.first_name}</td>
            <td >{user.last_name}</td>
            <td >{user.email}</td>
            <td >{user.phone_number}</td>
            <td >{user.student_id}</td>
            <td >{user.role}</td>
            <td >
                <select onChange={(e) => updateUserRole(user, e.target.value)}>
                    <option value="user">User</option>
                    <option value="teacher">Teacher</option>
                    <option value="mod">Moderator</option>
                    <option value="admin">Admin</option>
                </select>&nbsp;&nbsp;
                
                  <button className="red-button" onClick={() => handleDeleteUser(user.id)}>Set Inactive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <div style={{ marginBottom: "20px" }}></div>
      </div>
      
  )

};

export default UserList;
