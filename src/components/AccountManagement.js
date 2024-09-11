import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const AccountManagement = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    username: '',
    password: '',
    gender: '',
    address: '',
    role: 'student', // Default role is student
  });

  useEffect(() => {
    console.log('Current user:', user); // Log the user object
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send user data to backend API
      const res = await axios.post('/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('User created successfully');
      setFormData({
        name: '',
        age: '',
        email: '',
        username: '',
        password: '',
        gender: '',
        address: '',
        role: 'student', // Reset to default role
      });
    } catch (err) {
      console.error(err);
      alert('Error creating user');
    }
  };

  if (user?.role !== 'admin') {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default AccountManagement;
