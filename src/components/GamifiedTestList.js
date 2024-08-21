import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function GamifiedTestList() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

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

  // Function to handle game navigation based on the game type
  const handlePlayGame = (gameType) => {
    switch (gameType) {
      case 'Hangman':
        navigate('/hangman-game');
        break;
      case 'Jeopardy':
        navigate('/jeopardy-game');
        break;
      case 'Who Wants to Be a Millionaire?':
        navigate('/millionaire-game');
        break;
      default:
        console.error('Unknown game type:', gameType);
        alert('Unknown game type');
    }
  };

  // Function to handle navigation to the Edit page
  const handleEditTest = (testId) => {
    navigate(`/edit-test/${testId}`);
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
              <p className="mb-2">Exam Time: {test.examTime}</p> {/* Added examTime */}
              <p className="mb-2">Created By: {test.createdBy}</p>
            </div>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-4"
              onClick={() => handlePlayGame(test.gameType)}
            >
              Play Game
            </button>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-4"
              onClick={() => handleEditTest(test.id)}  // Navigate to Edit page
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GamifiedTestList;
