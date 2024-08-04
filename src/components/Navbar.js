import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="text-white">Profile</Link>
          <Link to="/account-management" className="text-white">Account Management</Link>
          <Link to="/create-test" className="text-white">Create Test</Link>
          <Link to="/grades" className="text-white">Grades</Link>
          <Link to="/leaderboard" className="text-white">Leaderboard</Link>
          <Link to="/gamified-test" className="text-white">Gamified Test</Link>
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
