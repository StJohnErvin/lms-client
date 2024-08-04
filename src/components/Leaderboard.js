import React from 'react';

const Leaderboard = () => {
  const leaderboardData = [
    { id: 1, name: 'John Doe', score: 150 },
    { id: 2, name: 'Jane Smith', score: 140 },
    { id: 3, name: 'Alice Johnson', score: 130 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-200">
          {leaderboardData.map(user => (
            <li key={user.id} className="py-4 flex justify-between">
              <span className="text-gray-700 font-bold">{user.name}</span>
              <span className="text-gray-500">{user.score} points</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
