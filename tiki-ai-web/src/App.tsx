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
import RegistrationPage from './pages/RegistrationPage';
import LearningPage from './pages/LearningPage';
import PracticePage from './pages/PracticePage';
import ProfilePage from './pages/ProfilePage';
import QuestionsPage from './pages/QuestionPage'; // Import the QuestionsPage
import { AuthProvider, useAuth } from './AuthContext'; // Update the import path as necessary


function App() {
  const auth = useAuth();

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <header className="App-header">
          <NavBar /> {/* NavBar is a separate component now */}

          </header>
          <main>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={
                // Use the useAuth hook within a component or custom hook
                <AuthConsumer />
              } />              
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

const NavBar: React.FC = () => {
  const auth = useAuth();

  return (
    <nav>
      <Link to="/home">Home</Link>  
      <Link to="/tasks">Tasks</Link>  
      <Link to="/practice">Practice</Link>
      <Link to="/learning">Learning</Link>
      {auth?.isLoggedIn ? (
        <Link to="/profile">Profile</Link>
      ) : (
        <>
          <Link to="/login">Login</Link>  
        </>
      )} 
    </nav>
  );
};

const AuthConsumer: React.FC = () => {
  const { isLoggedIn } = useAuth() ?? { isLoggedIn: false };
  return isLoggedIn ? <ProfilePage /> : <LoginPage />;
};

export default App;
