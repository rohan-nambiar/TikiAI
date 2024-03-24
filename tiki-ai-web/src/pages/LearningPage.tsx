import React, { useState, useEffect } from 'react';
import './LearningPage.css'; // Make sure the path matches where your CSS file is located
import { Link } from 'react-router-dom';



const LearningPage: React.FC = () => {
  // State initialization
  const [subject, setSubject] = useState('');
  const [age, setAge] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');

  // Prefill the form if user data exists in local storage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData.age) setAge(parsedUserData.age.toString());
      if (parsedUserData.gradeLevel) setGradeLevel(parsedUserData.gradeLevel.toString());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch('http://localhost:8080/api/youtube/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Assuming the backend expects a JSON object with these fields
        body: JSON.stringify({ subject: subject, age: age, gradeLevel: gradeLevel }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Assuming the response contains the YouTube link
      console.log(data);
      setYoutubeLink(data[0]); // Update your state with the YouTube link
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="LearningPage-container"> {/* Use container class for overall styling */}
      <h2>Learning Page</h2>
      <form onSubmit={handleSubmit} className="LearningPage-form"> {/* Apply form styling */}
        <div>
          <label htmlFor="subject">What do you want to learn?</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="LearningPage-input" // Apply input field styling
          />
        </div>
        <div>
          <label htmlFor="age">How old are you?</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="LearningPage-input" // Apply input field styling
          />
        </div>
        <div>
          <label htmlFor="gradeLevel">What is your grade level?</label>
          <input
            type="text"
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="LearningPage-input" // Apply input field styling
          />
        </div>
        <button type="submit" className="LearningPage-button"> {/* Apply button styling */}
          Find Learning Material
        </button>
      </form>
      {youtubeLink && (
        <div className="LearningPage-link"> {/* Use the link section class for styling */}
          <h3>Recommended Video:</h3>
          <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="LearningPage-videoLink">
            Watch Now
          </a>
        </div>
      )}
    </div>
  );
  
};

export default LearningPage;
