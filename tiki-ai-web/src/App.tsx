import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.css';

// Import your page components
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import AdvicePage from './pages/PracticePage';
import RegistrationPage from './pages/RegistrationPage';
import LearningPage from './pages/LearningPage';
import PracticePage from './pages/PracticePage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link> | 
            <Link to="/login">Login</Link> | 
            <Link to="/tasks">Tasks</Link> | 
            <Link to="/practice">Practice</Link>
            <Link to="/learning">Learning</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
