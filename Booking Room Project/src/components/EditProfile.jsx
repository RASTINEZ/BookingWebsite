import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(null);
  const navigate  = useNavigate();

  useEffect(() => {
    // Fetch current user data and populate form fields
    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername); 
    fetchUserData(storedUsername); // Pass the storedUsername to fetchUserData
}, []);


const fetchUserData = (username) => {
    const url = `http://localhost:8081/user?username=${username}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Assuming the response data is an array and the user data is in the first object
        const userData = data[0];
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
        setPassword(userData.password);
      });
  };
  
  


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Construct the request body
          let requestBody = { username }; // Always include the username
          if (firstName.trim() !== '') requestBody.firstName = firstName;
          if (lastName.trim() !== '') requestBody.lastName = lastName;
          if (email.trim() !== '') requestBody.email = email;
          if (password.trim() !== '') requestBody.password = password;
      
          // Send the PUT request
          await axios.put('http://localhost:8081/user', requestBody);
          alert('Profile updated successfully');
          navigate("/");
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile. Please try again.');
        }
    };
    




  
  

  return (
    <div>
        <NavBar username={username} />
        <div className="container2">
    
    <h2>Edit Profile</h2>
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="submit-button">Save Changes</button>
    </form>
  </div>

    
    </div>
  );
  



}

export default EditProfile;
