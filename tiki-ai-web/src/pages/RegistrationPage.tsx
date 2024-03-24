// RegistrationPage.tsx
import React, { useState } from 'react';
import './RegistrationPage.css'; // You might want to create specific styles for the registration page
import { RegistrationData } from '../interfaces/registration'; // Import the interfaces
import { Link } from 'react-router-dom'; // Import the Link component

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>({ username: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation for password and confirmPassword match can be added here
    if(formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Here you would typically send the formData to your backend for registration
    console.log('Registering:', formData);
  };

  return (
    <div className="registration-container">
      <h2>Create Your Account</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="registration-button" ><Link to="/home">Register</Link></button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p> {/* Add this line */}
    </div>
  );
}

export default RegistrationPage;
