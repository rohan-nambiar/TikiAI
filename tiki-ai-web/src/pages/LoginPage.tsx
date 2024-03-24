import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file for styles
import { LoginCredentials } from '../interfaces/registration'; // Import the interfaces
import { Link } from 'react-router-dom'; // Import the Link component

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting:', credentials);
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
        <button type="submit" className="login-button"><Link to="/home">Login</Link></button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p> {/* Add this line */}
    </div>
  );
}

export default LoginPage;
