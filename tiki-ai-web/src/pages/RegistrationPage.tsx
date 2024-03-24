// RegistrationPage.tsx
import React, { useState } from 'react';
import './RegistrationPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook


const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    gradeLevel: '',
    age: '',
  });
  const auth = useAuth(); // Get the authentication methods from the context
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Preparing the data to match the User model in the backend
    const postData = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      gradeLevel: formData.gradeLevel, // Parsing to integer
      age: parseInt(formData.age, 10), // Parsing to integer
    };

    try {
      const response = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      }
      const data = await response.json();
      console.log(data);
      const userData = {
        name: data.name,
        username: data.username,
        gradeLevel: data.gradeLevel,
        age: data.age,
      };
      localStorage.setItem('userData', JSON.stringify(data)); // Save user data

      if (auth) {
        auth.login(); // Set the login state to true
      }
      // Assuming successful registration redirects to the home page
      navigate('/home');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="registration-container">
      <h2>Create Your Account</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gradeLevel">Grade Level</label>
          <input type="text" id="gradeLevel" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <button type="submit" className="registration-button">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

export default RegistrationPage;
