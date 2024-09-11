import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isStudent = user?.role === 'student';

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="text-white">Profile</Link>
          
          <Link
            to="/account-management"
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-disabled={isStudent}
          >
            Account Management
          </Link>

          <Link
            to="/create-test"
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-disabled={isStudent}
          >
            Create Test
          </Link>

          <Link to="/grades" className="text-white">Grades</Link>
          <Link to="/leaderboard" className="text-white">Leaderboard</Link>
          <Link to="/gamified-test" className="text-white">Gamified Test</Link>

          <Link
            to="/announcements"
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-disabled={isStudent}
          >
            Announcements
          </Link>

          <Link
            to="/add-announcement"
            className={`text-white ${isStudent ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-disabled={isStudent}
          >
            Add Announcement
          </Link>
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
