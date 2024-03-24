import React, { useState, useEffect, useRef } from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<{ sender: 'user' | 'ai', message: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  let recognition: SpeechRecognition | null = null;

  const recognitionRef = useRef(null);


  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setSpeechSupported(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((currentInput) => currentInput + " " + transcript); // Appends the new transcript
        setIsListening(false);
      };
      

      recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
      setSpeechSupported(false);
    }
  }, []);

  const startListening = () => {
    console.log("Currently listening...");
    if (recognition) {
      console.log(recognition);
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

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
        {speechSupported && (
        <>
          <button type="button" onClick={startListening} disabled={isListening}>
            Start Talking
          </button>
          <button type="button" onClick={stopListening} disabled={!isListening}>
            Stop Talking
          </button>
        </>
      )}
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
