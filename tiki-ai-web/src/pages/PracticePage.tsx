import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import './PracticePage.css';


const PracticePage: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch subtopics
  const fetchSubtopics = async (subject: string, gradeLevel: number, age: number) => {
    const response = await fetch('http://localhost:8080/api/chatgpt/createSubTopic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        age,
        gradeLevel,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch subtopics');
      return;
    }

    const data = await response.json();
    console.log(data);
    const topics = data.choices[0].message.content.split('\n').map((line: string) => line.substring(3));
    setSubtopics(topics);
  };

  // Handler for when the subject input changes
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  // Handler for when the user presses Enter in the subject input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && subject.trim() !== '') {
      // Retrieve userData from localStorage
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        fetchSubtopics(subject, userData.gradeLevel, userData.age);
      }
    }
  };

  const handleSubtopicClick = (subtopic: string) => {
    // Use navigate to change the route
    navigate(`/questions?subtopic=${encodeURIComponent(subtopic)}`);
  };

  return (
<div className="PracticePage-container">
      <h2>Practice Page</h2>
      <input
        type="text"
        className="PracticePage-input"
        value={subject}
        onChange={handleSubjectChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter a subject and press Enter"
      />
      <p>Select a subtopic to practice:</p>
      <div className="PracticePage-subtopics">
        {subtopics.map((subtopic, index) => (
          <button key={index} onClick={() => handleSubtopicClick(subtopic)} className="PracticePage-subtopicButton">
            {subtopic}
          </button>
        ))}
      </div>
    </div>
 );
};

export default PracticePage;
