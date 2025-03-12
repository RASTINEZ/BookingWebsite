import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import NavBar from './NavBar';

const Register = ({}) => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    studentId: '',
  });
  const [error, setError] = useState('');
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
  
    // Check if any field is empty
    for (const key in formData) {
      if (formData[key] === '') {
        setError('Please fill in all fields');
        return;
      }
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8081/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      setError('');
  
      // Registration successful
      alert('Registration successful');
      setTimeout(() => {
        navigate('/login'); // Use navigate directly
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div>
      <NavBar username={username} />
      <div className="container">
        <br/>
        <h2>Register</h2>

        <Form onSubmit={handleSubmit}>
        <br/>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="studentId">
            <Form.Label>Student ID</Form.Label>
            <Form.Control type="text" name="studentId" value={formData.studentId} onChange={handleChange} />
          </Form.Group>


          <Button variant="primary" type="submit">
            Register
          </Button>
          <br/><br/>
        </Form>
        <p className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
          {error && (
            <div
              className="alert alert-danger"
              style={{
                padding: '20px',
                margin: '20px',
                width: '100%',
              }}
            >
              {error}
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default Register;
