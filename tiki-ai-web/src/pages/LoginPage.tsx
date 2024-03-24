import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file for styles
import { LoginCredentials } from '../interfaces/registration'; // Import the interfaces
import { Link, useNavigate } from 'react-router-dom'; // Import the Link component
import { useAuth } from '../AuthContext'; // Adjust the import path as necessary


const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });
  const { login } = useAuth()!;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed. Please check your username and password.');
      }
      const data = await response.json();
      const userData = {
        name: data.name,
        username: data.username,
        gradeLevel: data.gradeLevel,
        age: data.age,
      };
      localStorage.setItem('userData', JSON.stringify(data)); // Save user data
    // Assuming login successful if we get here
      if (login) {
        login(); // Update login state
      }
      navigate("/home"); // Redirect to home page upon successful login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your username and password.'); // This will show the popup
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p> {/* Add this line */}
    </div>
  );
}

export default LoginPage;
