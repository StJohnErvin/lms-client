import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { UserContext } from '../context/UserContext';

function FakeLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Get setUser from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password);
      const user = userCredential.user;

      // Here you should fetch the user data from your backend or Firebase Firestore
      // to get additional information like role. For example:
      // const userData = await fetchUserDataFromBackend(user.uid);
      
      // For demonstration, we'll just include a mock role
      const userData = { username: user.email, role: 'admin' }; // Replace this with actual role fetching

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Set user data including role in context
      setError('');
      navigate('/profile');
      
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email
            </label>
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={formData.username}
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
              value={formData.password}
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
      </div>
    </div>
  );
}

export default FakeLogin;
