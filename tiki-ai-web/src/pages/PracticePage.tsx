import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticePage.css';

interface Question {
  questionText: string;
  options: string[];
  answer: string;
}

const PracticePage: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');


  // Function to fetch subtopics
  const fetchSubtopics = async (subject: string, gradeLevel: number, age: number) => {
    console.log(gradeLevel, age);
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

  const handleSubtopicClick = async (subtopic: string) => {
    setSelectedSubtopic(subtopic);
    setIsModalOpen(true);
    let subject = subtopic;

    // Retrieve userData from localStorage
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.error("No user data found in localStorage.");
      return; // Exit the function if userData is not available
    }
    
    const { gradeLevel, age } = JSON.parse(userDataString);

    // Now, use gradeLevel and age to fetch the questions
    const response = await fetch('http://localhost:8080/api/chatgpt/getQuestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject, // Make sure this is the correct field name expected by your backend
        age,
        gradeLevel,
      }),
    });
  
    if (!response.ok) {
      console.error('Failed to fetch questions');
      return;
    }
    const data = await response.json();
    const questionsContent = data.choices[0].message.content;
    const parsedQuestions = parseQuestions(questionsContent);
    console.log(data + " " + parsedQuestions);
    setQuestions(parsedQuestions);
    setCurrentQuestionIndex(0); // Initialize current question index
    setIsModalOpen(true);
  };

  const parseQuestions = (content: string): Question[] => {
    return content.split('\n\n').map(q => {
      const parts = q.split('\n').filter(part => part.trim() !== '');
      const questionText = parts[0];
      const options = parts.slice(1, parts.length - 2); // Exclude the "Correct answer:" part
      const answer = parts[parts.length - 1].split(': ')[1].trim(); // Extract the correct answer
      return { questionText, options, answer };
    });
  };
  

  const checkAnswer = () => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedAnswer === correctAnswer) {
      alert('Correct!');
    } else {
      alert(`Incorrect! The correct answer is ${correctAnswer}`);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      alert('Quiz completed!');
      setIsModalOpen(false);
    }
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
      {isModalOpen && (
        <div className="modal-content">
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <>
              <h2>Question: {questions[currentQuestionIndex].questionText}</h2>
              <ul>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <li key={index} onClick={() => setSelectedAnswer(option)}>{option}</li>
                ))}
              </ul>
              <button onClick={checkAnswer}>Submit Answer</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticePage;