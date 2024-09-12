import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'scores'));
        const leaderboardList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort leaderboard data by score in descending order
        const sortedLeaderboardData = leaderboardList.sort((a, b) => b.score - a.score);
        setLeaderboardData(sortedLeaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-200">
          {leaderboardData.map(user => (
            <li key={user.id} className="py-4 flex justify-between">
              <span className="text-gray-700 font-bold">{user.name || 'Unknown'}</span>
              <span className="text-gray-500">{user.score || 0} points</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
