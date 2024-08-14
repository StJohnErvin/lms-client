import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        {user ? (
          <>
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
          </>
        ) : (
          <Login />
        )}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
