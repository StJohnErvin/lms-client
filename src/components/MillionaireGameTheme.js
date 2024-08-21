// src/components/MillionaireGameTheme.js
import React, { useState } from 'react';
import { questions } from '../data/questions';

const MillionaireGameTheme = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsGameOver(true);
      }
    } else {
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Who Wants to Be a Millionaire?</h1>
      {!isGameOver ? (
        <>
          <p className="mb-4">{currentQuestion.question}</p>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`p-2 rounded ${selectedAnswer === option ? 'bg-green-500' : 'bg-blue-500'} hover:bg-blue-600 text-white`}
                onClick={() => handleAnswerClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl mb-4">
            {score === questions.length ? 'Congratulations! You won!' : `Game Over! Your score: ${score}`}
          </h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MillionaireGameTheme;
