import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    // Fake student details to display
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

    return (
      <div>
        <h2>Profile</h2>
        <p>Name: {fakeUser.name}</p>
        <p>Email: {fakeUser.email}</p>
        <p>Username: {fakeUser.username}</p>
        <p>Role: {fakeUser.role}</p>
        <p>Student ID: {fakeUser.studentID}</p>
        <p>Major: {fakeUser.major}</p>
        <p>Year: {fakeUser.year}</p>
        <p>GPA: {fakeUser.gpa}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Profile;
