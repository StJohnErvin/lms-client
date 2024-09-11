import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isStudent = user?.role === 'student';

  const handleClick = (path) => {
    if (isStudent) {
      // Prevent navigation for students
      return;
    }
    navigate(path);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="text-white">Profile</Link>
          
          <span
            onClick={() => handleClick('/account-management')}
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Account Management
          </span>

          <span
            onClick={() => handleClick('/create-test')}
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Create Test
          </span>

          <Link to="/grades" className="text-white">Grades</Link>
          <Link to="/leaderboard" className="text-white">Leaderboard</Link>
          <Link to="/gamified-test" className="text-white">Gamified Test</Link>

          <span
            onClick={() => handleClick('/announcements')}
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Announcements
          </span>

          <span
            onClick={() => handleClick('/add-announcement')}
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Add Announcement
          </span>
        </div>
        {user && (
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
