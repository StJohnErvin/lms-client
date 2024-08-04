import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HangmanIcon from '../assets/hangman-icon.png';
import JeopardyIcon from '../assets/jeopardy-icon.png';
import MillionaireIcon from '../assets/millionaire-icon.png';

const gameIcons = {
  Hangman: HangmanIcon,
  Jeopardy: JeopardyIcon,
  Millionaire: MillionaireIcon,
};

function GamifiedTestList() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/exams/list');
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Gamified Tests</h1>
      <ul className="space-y-4">
        {tests.map((test) => (
          <li key={test._id} className="border p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-2">{test.testName}</h2>
              <p className="mb-2">Game Type: {test.gameType}</p>
              <p className="mb-2">Created By: {test.createdBy}</p>
            </div>
            <img src={gameIcons[test.gameType]} alt={test.gameType} className="w-12 h-12 object-contain" />
            <Link to={`/play-game/${test._id}`} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-4">
              Play Game
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GamifiedTestList;
