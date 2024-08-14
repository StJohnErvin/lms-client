import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FakeLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginSuccess(true);
    // Simulate a successful login by storing user details
    localStorage.setItem('user', JSON.stringify({ username: formData.username }));
    // Navigate to the profile page
    navigate('/profile');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h1>
        {loginSuccess ? (
          <div className="text-green-600 text-center">
            <p>Login successful! Welcome, {formData.username}!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FakeLogin;
