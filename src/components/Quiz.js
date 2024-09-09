import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Start with 0 until loaded
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { gameType } = state || {};

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
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isFinished) {
      navigate('/profile'); // Redirect to Profile when time runs out
    }
  }, [timeLeft, navigate, isFinished]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
                className={`block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mb-2 ${
                  selectedOption === option ? 'bg-blue-700' : ''
                }`}
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
