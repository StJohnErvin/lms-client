import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from React Router

function GamifiedTestList() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tests'));
        const testsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTests(testsList);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  const handlePlayGame = () => {
    navigate('/hangman-game');  // Always navigate to the hangman game route
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Gamified Tests</h1>
      <ul className="space-y-4">
        {tests.map((test) => (
          <li key={test.id} className="border p-4 flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-2">{test.testName}</h2>
              <p className="mb-2">Game Type: {test.gameType}</p>
              <p className="mb-2">Created By: {test.createdBy}</p>
            </div>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-4"
              onClick={handlePlayGame}  // Always navigate to Hangman game
            >
              Play Game
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GamifiedTestList;
