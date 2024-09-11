import React, { useState, useEffect, useContext } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        if (!userId) {
          throw new Error('User not authenticated');
        }

        let docRef;
        if (user?.role === 'admin') {
          docRef = doc(db, 'user', userId); // Admin data
        } else {
          docRef = doc(db, 'users', userId); // Regular user data
        }

        console.log('Fetching data from:', docRef.path); // Debug log

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data()); // Debug log
          setProfileData(docSnap.data());
        } else {
          console.error('No such document at path:', docRef.path); // Debug log
          setError('No such document!');
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        setError('Error fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div className="text-gray-600 text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Profile</h2>
      <div className="space-y-4">
        <p><strong>Name:</strong> {profileData.name || 'N/A'}</p>
        <p><strong>Email:</strong> {profileData.email || 'N/A'}</p>
        <p><strong>Username:</strong> {profileData.username || 'N/A'}</p>
        <p><strong>Role:</strong> {profileData.role || 'N/A'}</p>
        {profileData.role === 'student' && (
          <>
            <p><strong>Student ID:</strong> {profileData.studentID || 'N/A'}</p>
            <p><strong>Major:</strong> {profileData.major || 'N/A'}</p>
            <p><strong>Year:</strong> {profileData.year || 'N/A'}</p>
            <p><strong>GPA:</strong> {profileData.gpa || 'N/A'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
