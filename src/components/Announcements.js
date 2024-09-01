// src/components/Announcements.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'announcements'));
        const announcementsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(announcementsList);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Announcements</h1>
      {announcements.length > 0 ? (
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="border p-4">
              <h2 className="text-lg font-medium">{announcement.title}</h2>
              <p className="text-gray-600">{announcement.date}</p>
              <p className="mt-2">{announcement.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default Announcements;
