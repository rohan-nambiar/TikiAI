import React, { useState } from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<{ sender: 'user' | 'ai', message: string }[]>([]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
    };

    try {
        const response = await fetch('http://localhost:8080/api/chatgpt/ask', requestOptions);
        if (!response.ok) {
            throw new Error('Response from server not ok');
        }
        // Assuming the response is JSON. Use response.json() to parse it.
        const data = await response.json(); // Parse the JSON response
        console.log('AI response:', data);

        // Extract the content from the response
        const aiContent = data.choices[0].message.content;

        // Update conversation history with the extracted content
        setConversation([...conversation, { sender: 'user', message: userMessage }, { sender: 'ai', message: aiContent }]);
    } catch (error) {
        console.error('There was an error!', error);
    }

    setInput(''); // Clear input after sending
  };

  return (
    <div className="home-page">
      <h2>Home Page</h2>
      <p>Welcome to the Tiki AI Personal Assistant!</p>
      <form onSubmit={handleSubmit} className="message-form">
        <input type="text" value={input} onChange={handleInputChange} placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
      <div className="conversation">
        {conversation.map((entry, index) => (
          <div key={index} className={`message ${entry.sender}`}>
            <span>{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
