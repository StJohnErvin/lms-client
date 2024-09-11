import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, deleteObject } from 'firebase/storage';
import { UserContext } from '../context/UserContext';

function GamifiedTestList() {
  const [tests, setTests] = useState([]);
  const { user } = useContext(UserContext); // Get user context
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

  // Function to navigate to the game page for the selected test
  const handlePlayGame = (testId, gameType, question, answer) => {
    if (gameType === 'Hangman') {
      // Navigate to Hangman component with test ID, question, and answer
      navigate(`/hangman/${testId}`, { state: { question, answer } });
    } else {
      // Navigate to quiz page for other game types
      navigate(`/quiz/${testId}`, { state: { gameType } });
    }
  };

  // Function to handle navigation to the Edit page
  const handleEditTest = (testId) => {
    navigate(`/edit-test/${testId}`);
  };

  // Function to handle deleting a test
  const handleDeleteTest = async (testId, materialURL) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this test? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      // If there is a material URL, delete the file from Firebase Storage
      if (materialURL) {
        const fileRef = ref(storage, materialURL);
        await deleteObject(fileRef);
      }

      // Delete the test document from Firestore
      await deleteDoc(doc(db, 'tests', testId));

      // Update the local state to remove the deleted test
      setTests(prevTests => prevTests.filter(test => test.id !== testId));
      alert('Test deleted successfully.');
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete the test. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Gamified Tests</h1>
      {tests.length > 0 ? (
        <ul className="space-y-4">
          {tests.map((test) => (
            <li key={test.id} className="border p-4 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-medium mb-2">{test.testName}</h2>
                <p className="mb-1"><strong>Game Type:</strong> {test.gameType}</p>
                <p className="mb-1"><strong>Exam Timer:</strong> {test.examTime} minutes</p>
                <p className="mb-1"><strong>Created By:</strong> {test.createdBy}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => handlePlayGame(test.id, test.gameType, test.question, test.answer)}
                >
                  Play Game
                </button>
                {user.role !== 'student' && (
                  <>
                    <button 
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                      onClick={() => handleEditTest(test.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                      onClick={() => handleDeleteTest(test.id, test.materialURL)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No gamified tests available.</p>
      )}
    </div>
  );
}

export default GamifiedTestList;
