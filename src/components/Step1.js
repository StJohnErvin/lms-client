import React, { useState } from 'react';

const Step1 = ({ next, formData }) => {
  const [testName, setTestName] = useState(formData.testName);
  const [examTime, setExamTime] = useState(formData.examTime);
  const [gameType, setGameType] = useState(formData.gameType);

  const handleNext = () => {
    next({ testName, examTime, gameType });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="testName">
          Exam Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="testName"
          type="text"
          placeholder="Enter exam title"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examTime">
          Exam Time
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="examTime"
          type="text"
          placeholder="Enter exam time"
          value={examTime}
          onChange={(e) => setExamTime(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameType">
          Bonus/Extra Exam: Choose Game Type
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="gameType"
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
        >
          <option value="">Select a game</option>
          <option value="Hangman">Hangman</option>
          <option value="Jeopardy">Jeopardy</option>
          <option value="Millionaire">Who Wants to Be a Millionaire?</option>
        </select>
      </div>
      <button
        onClick={handleNext}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Next
      </button>
    </div>
  );
};

export default Step1;
