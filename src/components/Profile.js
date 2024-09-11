import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);

  // Fake user data for display if no user context is available
  const fakeUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    username: "johndoe123",
    role: "Student",
    studentID: "S123456",
    major: "Computer Science",
    year: "Sophomore",
    gpa: "3.8",
  };

  const displayUser = user || fakeUser;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Profile</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Name:</label>
          <p className="text-gray-800">{displayUser.name}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Email:</label>
          <p className="text-gray-800">{displayUser.email}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Username:</label>
          <p className="text-gray-800">{displayUser.username}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Role:</label>
          <p className="text-gray-800">{displayUser.role}</p>
        </div>
        {/* Conditionally render additional fields based on role */}
        {displayUser.role === "Student" && (
          <>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Student ID:</label>
              <p className="text-gray-800">{displayUser.studentID}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Major:</label>
              <p className="text-gray-800">{displayUser.major}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Year:</label>
              <p className="text-gray-800">{displayUser.year}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">GPA:</label>
              <p className="text-gray-800">{displayUser.gpa}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
