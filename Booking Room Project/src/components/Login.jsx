import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import NavBar from './NavBar';


const Login = ({}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
});
const [errorMessage, setErrorMessage] = useState('');
const navigate  = useNavigate();

const [username, setUsername] = useState(null);

useEffect(() => {
    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername); 

  },[])  


const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
            // Login successful
            setErrorMessage(''); // Clear previous error message
            alert('Login successful'); // Show success message as alert
            setTimeout(() => {
              navigate('/'); // Use navigate directly
            }, 500);
            localStorage.setItem('username', formData.username);
            
          } else {
            // Login failed
            setErrorMessage(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        setErrorMessage('An error occurred during login');
    }
};
return (
  <div>
      <NavBar username={username} />
      <div className="container">
      <br/>
          <h2>Login</h2>
          <Form onSubmit={handleSubmit}>
          <br/>
              <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
                  Login
              </Button>
              <br/><br/>
              {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>} {/* Display error message if present */}
          </Form>
          <p className="mt-3">
              Don't have an account? <Link to="/register">Register</Link>
          </p>
      </div>
  </div>
);
};

export default Login;