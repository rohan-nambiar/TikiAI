import React, { useState } from 'react';
import './TaskPage.css'; // Ensure this path is correct
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

// Define a type for your event data
type CalendarEvent = {
  title: string;
  date: string; // Date format should match what FullCalendar expects
};

const TasksPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [taskInput, setTaskInput] = useState<string>('');

  // Function to handle the submission of a new task
  const handleAddTask = async () => {
    if (!taskInput) {
      alert('Please enter a task');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/chatgpt/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: taskInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { task, date } = await response.json();

      // Add the new event to the calendar based on the response
      setEvents(currentEvents => [
        ...currentEvents,
        { title: task, date: date }
      ]);

      setTaskInput(''); // Clear task input after submission
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="TasksPage-container">
      <h2>Tasks Page</h2>
      <div className="task-input-group">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter your task here"
          className="task-input"
        />
        <button onClick={handleAddTask} className="task-button">Add Task</button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default TasksPage;
