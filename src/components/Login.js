import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';  // Import Firebase auth
import { UserContext } from '../context/UserContext';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Error logging in:", error);
      alert('Login failed');
    }
  };

  return (
    <div className="container mx-auto">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
