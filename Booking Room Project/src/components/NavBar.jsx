import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const NavBar = ({username}) => {
  const navigate  = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');

  const [storedUsername, setUsername] = useState(null);

  

    
  useEffect(() => { 
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      getName(storedUsername)
        .then(data => {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setRole(data.role);
        })
        .catch(error => {
          console.error('Failed to retrieve name:', error);
        });
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('username');    
    setUsername(null); // Update state in App component (if applicable)
    // Optionally redirect to the login page:
    alert('Logout successful'); // Show success message as alert
    navigate('/');
    

     // Or use useNavigate() if you have it set up

    window.location.reload();
  };

  // Function to retrieve the name from the backend
const getName = async (storedUsername) => {
  try {
    const response = await fetch(`http://localhost:8081/getname/${storedUsername}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve name');
    }
    const data = await response.json();
    return data; // This will contain first_name and last_name
  } catch (error) {
    console.error('Error retrieving name:', error);
    // Handle error
  }
};

// Usage example

if (storedUsername) {
  getName(storedUsername)
    .then(data => {
      console.log('Retrieved name:', data.first_name, data.last_name);
      // Use the retrieved name as needed
    })
    .catch(error => {
      console.error('Failed to retrieve name:', error);
    });
} else {
  console.error('Username not found in local storage');
  // Handle the case where the username is not found in local storage
}


  return (
        <nav className="navbar custom-navbar" data-bs-theme="dark">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">KU Room Service</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">&nbsp;&nbsp;Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="/">&nbsp;&nbsp;Rooms</a>
        </li>
        
        {!username && ( <> 
        <li className="nav-item">
          <a className="nav-link active" href="/Login">&nbsp;&nbsp;Login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" href="/Register">&nbsp;&nbsp;Register</a>
        </li>
        </> )}
        
        {username && (
      <> 
        <li className="nav-item">
          <span className="nav-link active">Welcome, {firstName} !</span>
        </li>
        <li className="nav-item">

           
           <a className="nav-link edit-profile" href={`/EditProfile/${username}`}>&nbsp;&nbsp;Edit Profile</a>

           <a className="nav-link booking-history" href={`/historypage/${username}`}>&nbsp;&nbsp;Booking History</a>
           <button className="btn btn-link custom-logout-btn" onClick={handleLogout} >Logout</button> {/* Or style it according to your preferences */}

        </li>
      </>
    )}
    {(role === "admin" || role === "mod")  && (
      <> 
        

           <a className="nav-link active" href="/AdminPage">Admin Page</a>
        
      </>
    )}



        {/* <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown link
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li> */}
      </ul>
    </div>
  </div>
</nav>
      
        
      );
}

export default NavBar;