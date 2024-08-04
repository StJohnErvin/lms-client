import React, { useState } from 'react';

const Step2 = ({ next, back, formData }) => {
  const [questions, setQuestions] = useState(formData.questions);

  const handleQuestionChange = (index, e) => {
    const newQuestions = questions.slice();
    newQuestions[index][e.target.name] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const newQuestions = questions.slice();
    newQuestions[qIndex].options[oIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleNext = () => {
    next({ questions });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${qIndex}`}>
            Question {qIndex + 1}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            id={`question-${qIndex}`}
            type="text"
            name="question"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e)}
          />
          {q.options.map((option, oIndex) => (
            <div key={oIndex} className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`option-${qIndex}-${oIndex}`}>
                Option {oIndex + 1}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={`option-${qIndex}-${oIndex}`}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
              />
            </div>
          ))}
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`answer-${qIndex}`}>
            Answer
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={`answer-${qIndex}`}
            type="text"
            name="answer"
            placeholder="Enter answer"
            value={q.answer}
            onChange={(e) => handleQuestionChange(qIndex, e)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
      >
        Add Question
      </button>
      <div className="flex justify-between">
        <button
          onClick={back}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step2;
