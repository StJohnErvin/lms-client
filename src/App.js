import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './context/UserContext';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import AccountManagement from './components/AccountManagement';
import CreateTest from './components/CreateExam';
import GradeEvaluation from './components/GradeEvaluation';
import Leaderboard from './components/Leaderboard';
import GamifiedTestList from './components/GamifiedTestList';
import PlayTest from './components/PlayTest';
import HangmanGameTheme from './components/HangmanGameTheme';
import JeopardyGameTheme from './components/JeopardyGameTheme';
import MillionaireGameTheme from './components/MillionaireGameTheme';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check if user is logged in
  const checkLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setUser(null); // Clear user state on error
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    } else {
      setLoading(false); // Set loading to false if there's no token
    }
  };

  // Run checkLoggedIn on initial load
  useEffect(() => {
    checkLoggedIn();
  }, []);

  // Render loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/grades" element={<GradeEvaluation />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/gamified-test" element={<GamifiedTestList />} />
          <Route path="/play-test/:testId" element={<PlayTest />} />
          <Route path="/hangman-game" element={<HangmanGameTheme />} />
          <Route path="/jeopardy-game" element={<JeopardyGameTheme />} />
          <Route path="/millionaire-game" element={<MillionaireGameTheme />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
