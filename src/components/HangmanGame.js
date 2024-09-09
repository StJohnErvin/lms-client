import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const HangmanGame = () => {
  const location = useLocation();
  const { question = 'Default question', answer = '' } = location.state || {};  // Extracting question and answer from location state

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || isGameOver) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!answer.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const displayWord = () => {
    return answer.split('').map((letter) =>
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const isGameOver = wrongGuesses >= maxWrongGuesses;
  const isGameWon = !displayWord().includes('_');

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Question: {question}</h2>

      <div className="mb-4">
        <p className="text-2xl mb-2">Word:</p>
        <div className="border border-gray-400 rounded p-2 text-center text-2xl font-mono">
          {displayWord()}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">Wrong guesses: {wrongGuesses} / {maxWrongGuesses}</p>

      {isGameOver && (
        <p className="text-red-600 font-semibold">Game Over! The word was: {answer}</p>
      )}
      {isGameWon && (
        <p className="text-green-600 font-semibold">Congratulations! You guessed the word!</p>
      )}

      <div className="grid grid-cols-6 gap-2 mt-4">
        {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || isGameOver}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            aria-label={`Guess letter ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HangmanGame;
