import React, { useEffect, useState, useContext } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { UserContext } from '../context/UserContext'; // Import UserContext

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Initialize with 5 minutes (300 seconds)
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { gameType } = state || {};
  const { user } = useContext(UserContext); // Access user context

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testId = location.pathname.split('/').pop(); // Get testId from URL
        const docRef = doc(db, 'tests', testId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setQuestions(data.questions || []);
          setTimeLeft((data.examTime || 5) * 60); // Set timer based on examTime (5 minutes default)
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [location]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsFinished(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (isFinished) {
      const saveScore = async () => {
        try {
          const userId = user?.id || 'guest'; // Use user ID from context or a default value
          await setDoc(doc(db, 'scores', userId), { score, testId: location.pathname.split('/').pop() });
        } catch (error) {
          console.error('Error saving score:', error);
        }
      };
      saveScore();
      navigate('/profile'); // Navigate to profile when finished
    }

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, navigate, score, location, user]); // Add user to dependency array

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00'; // Handle invalid or negative values
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderCompletionMessage = () => {
    switch (gameType) {
      case 'Hangman':
        return 'You are a Hangman master!';
      case 'Jeopardy':
        return 'Jeopardy champion!';
      case 'Who Wants to Be a Millionaire?':
        return 'Millionaire!';
      default:
        return 'Well done!';
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!isFinished && questions.length > 0 ? (
        <div>
          <h1 className="text-2xl mb-4">{gameType || 'Quiz'}</h1>
          <p className="mb-2">{questions[currentQuestionIndex].question}</p>
          <div className="mb-4">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                className={`block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-2 ${selectedOption === option ? 'bg-blue-700' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
          >
            Next
          </button>
          <p className="mt-4">Time left: {formatTime(timeLeft)}</p> {/* Display timer */}
        </div>
      ) : isFinished ? (
        <div>
          <h1 className="text-2xl mb-4">Quiz Completed</h1>
          <p>Your score: {score} / {questions.length}</p>
          <p>{renderCompletionMessage()}</p> {/* Display gameType message */}
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Quiz;
