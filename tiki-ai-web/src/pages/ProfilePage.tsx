import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Adjust the import path as necessary

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    gradeLevel: '',
    age: '',
  });

  useEffect(() => {
    // Get user data from local storage
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data)); // Parse the JSON string into an object
    }
  }, []);

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
      localStorage.removeItem('userData'); // Clear user data from local storage on logout
      navigate('/login');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Welcome, {userData.name}!</p>
      <p>Username: {userData.username}</p>
      <p>Grade Level: {userData.gradeLevel}</p>
      <p>Age: {userData.age}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
