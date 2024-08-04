import React, { useState } from 'react';

const HangmanGameTheme = () => {
  // Define the word to guess (for simplicity, it's hardcoded here)
  const wordToGuess = "HELLO";

  // State variables
  const [guess, setGuess] = useState(''); // Current letter guessed
  const [guessedLetters, setGuessedLetters] = useState([]); // Array of guessed letters
  const [triesLeft, setTriesLeft] = useState(6); // Number of tries left

  // Function to handle input change (update guess)
  const handleInputChange = (e) => {
    setGuess(e.target.value.toUpperCase()); // Convert to uppercase for consistency
  };

  // Function to handle form submission (guessing)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if the guessed letter is in the word
    if (guess && !guessedLetters.includes(guess)) {
      // Update guessed letters
      setGuessedLetters([...guessedLetters, guess]);

      // Check if the guessed letter is in the word
      if (!wordToGuess.includes(guess)) {
        // Incorrect guess
        setTriesLeft(triesLeft - 1);
      }
    }

    // Clear the input field after guessing
    setGuess('');
  };

  // Function to render the word with blanks for unrevealed letters
  const renderWord = () => {
    return wordToGuess.split('').map((letter, index) => (
      <span key={index} className="mx-1">
        {guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  // Function to determine if the game is won (all letters guessed)
  const isGameWon = () => {
    return wordToGuess.split('').every(letter => guessedLetters.includes(letter));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Hangman Game Theme</h1>
      <p>Guess the word:</p>
      <div className="my-4">
        {renderWord()}
      </div>
      {triesLeft > 0 && !isGameWon() && (
        <div className="my-4">
          <p>Tries left: {triesLeft}</p>
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="guessInput">Enter a letter:</label>
            <input
              type="text"
              id="guessInput"
              value={guess}
              onChange={handleInputChange}
              maxLength="1"
              className="mx-2 p-2 border"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Guess
            </button>
          </form>
        </div>
      )}
      {isGameWon() && (
        <div className="my-4">
          <p>Congratulations! You guessed the word.</p>
        </div>
      )}
      {triesLeft === 0 && !isGameWon() && (
        <div className="my-4">
          <p>Game over! The word was "{wordToGuess}".</p>
        </div>
      )}
    </div>
  );
}

export default HangmanGameTheme;
