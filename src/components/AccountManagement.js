import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Get user UID
      const userId = userCredential.user.uid;

      // Save additional user data in Firestore
      await setDoc(doc(db, 'users', userId), {
        name: formData.name,
        age: formData.age,
        username: formData.username,
        gender: formData.gender,
        address: formData.address,
        role: formData.role,
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
    return <p className="text-red-600 text-center mt-4">Access denied. Admins only.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="age" className="text-gray-700 font-semibold mb-2">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="text-gray-700 font-semibold mb-2">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="gender" className="text-gray-700 font-semibold mb-2">Gender</label>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-gray-700 font-semibold mb-2">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="role" className="text-gray-700 font-semibold mb-2">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default AccountManagement;
