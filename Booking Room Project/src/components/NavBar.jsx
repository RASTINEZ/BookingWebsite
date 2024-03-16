import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const NavBar = ({username}) => {
  const navigate  = useNavigate();

  

  const [storedUsername, setUsername] = useState(null);
  useEffect(() => { 
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername); 
  }, []); // Run the effect only once on component mount

  const handleLogout = () => {
    localStorage.removeItem('username');    
    setUsername(null); // Update state in App component (if applicable)
    // Optionally redirect to the login page:
    alert('Logout successful'); // Show success message as alert
    navigate('/');
    

     // Or use useNavigate() if you have it set up

    window.location.reload();
  };

  return (
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
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
          <span className="nav-link active">Welcome, {username}!</span>
        </li>
        <li className="nav-item">
           <button className="btn btn-link" onClick={handleLogout}>Logout</button> {/* Or style it according to your preferences */}

           <a className="nav-link active" href={`/historypage/${username}`}>Booking History</a>
        </li>
      </>
    )}
    {(username === "admin" || username === "rastin")  && (
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