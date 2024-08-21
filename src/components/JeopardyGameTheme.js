// src/components/JeopardyGameTheme.js
import React, { useState } from 'react';
import { categories } from '../data/jeopardyQuestions';

const JeopardyGameTheme = () => {
  const [score, setScore] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const handleQuestionClick = (categoryIndex, questionIndex) => {
    const questionId = `${categoryIndex}-${questionIndex}`;
    if (!answeredQuestions.has(questionId)) {
      setSelectedQuestion({ categoryIndex, questionIndex });
      setAnswer('');
      setQuestionAnswered(false);
    }
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const { categoryIndex, questionIndex } = selectedQuestion;
    const correctAnswer = categories[categoryIndex].questions[questionIndex].answer;
    const questionId = `${categoryIndex}-${questionIndex}`;
    
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(score + categories[categoryIndex].questions[questionIndex].value);
    }
    setAnsweredQuestions(new Set(answeredQuestions).add(questionId));
    setQuestionAnswered(true);
  };

  const resetGame = () => {
    setScore(0);
    setSelectedQuestion(null);
    setAnswer('');
    setQuestionAnswered(false);
    setAnsweredQuestions(new Set());
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Jeopardy Game</h1>
      <div className="mb-4">
        <h2 className="text-xl">Score: {score}</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="text-lg font-bold">{category.category}</h3>
            <div className="space-y-2">
              {category.questions.map((q, questionIndex) => {
                const questionId = `${categoryIndex}-${questionIndex}`;
                return (
                  <button
                    key={questionIndex}
                    className={`p-2 w-full rounded ${answeredQuestions.has(questionId) ? 'bg-gray-400' : 'bg-blue-500'} hover:bg-blue-600 text-white`}
                    onClick={() => handleQuestionClick(categoryIndex, questionIndex)}
                    disabled={answeredQuestions.has(questionId)}
                  >
                    ${q.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {selectedQuestion && !questionAnswered && (
        <div className="my-4">
          <h3 className="text-lg mb-2">
            {categories[selectedQuestion.categoryIndex].questions[selectedQuestion.questionIndex].question}
          </h3>
          <form onSubmit={handleAnswerSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="p-2 border rounded mr-2"
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
              Submit Answer
            </button>
          </form>
        </div>
      )}
      {questionAnswered && (
        <div className="my-4">
          <h4 className="text-lg">Correct Answer: {categories[selectedQuestion.categoryIndex].questions[selectedQuestion.questionIndex].answer}</h4>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
            onClick={() => setSelectedQuestion(null)}
          >
            Continue
          </button>
        </div>
      )}
      <div className="my-4">
        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default JeopardyGameTheme;
