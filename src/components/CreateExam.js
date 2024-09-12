import React, { useState, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { UserContext } from '../context/UserContext';

const CreateTest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    testName: '',
    examTime: '',
    gameType: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }], // Default for Jeopardy and Millionaire
  });
  const [errors, setErrors] = useState({ examTime: '' });

  const { user } = useContext(UserContext);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'examTime') {
      const timePattern = /^([0-5]?[0-9]):([0-5][0-9])$/;
      const isValid = timePattern.test(value);
      setFormData({ ...formData, [name]: value });

      if (!isValid) {
        setErrors({ ...errors, examTime: 'Please enter a valid time in MM:SS format.' });
      } else {
        setErrors({ ...errors, examTime: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle question changes
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];

    if (name.startsWith('options')) {
      const optionIndex = parseInt(name.split('-')[1], 10);
      updatedQuestions[index].options[optionIndex] = value;
    } else {
      updatedQuestions[index][name] = value;
    }

    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle adding new questions
  const handleAddQuestion = () => {
    if (formData.gameType === 'Hangman') {
      setFormData({
        ...formData,
        questions: [...formData.questions, { question: '', answer: '' }],
      });
    } else {
      setFormData({
        ...formData,
        questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.examTime) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const finalData = {
      ...formData,
      createdBy: user.role,
      role: user.role,
    };

    try {
      await addDoc(collection(db, 'tests'), finalData);
      alert('Form submitted successfully');
      setCurrentStep(1);
      setFormData({
        testName: '',
        examTime: '',
        gameType: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
      });
    } catch (error) {
      console.error('Error adding document:', error.code, error.message);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Create a Gamified Test</h1>
      <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="testName">
                Exam Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="testName"
                name="testName"
                type="text"
                value={formData.testName}
                onChange={handleChange}
                placeholder="Enter exam title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examTime">
                Exam Timer (format MM:SS)
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.examTime ? 'border-red-500' : ''}`}
                id="examTime"
                name="examTime"
                type="text"
                value={formData.examTime}
                onChange={handleChange}
                placeholder="Enter exam time"
              />
              {errors.examTime && <p className="text-red-500 text-xs italic">{errors.examTime}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameType">
                Game Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="gameType"
                name="gameType"
                value={formData.gameType}
                onChange={handleChange}
              >
                <option value="">Select a game type</option>
                <option value="Hangman">Hangman</option>
                <option value="Jeopardy">Jeopardy</option>
                <option value="Who Wants to Be a Millionaire?">Who Wants to Be a Millionaire?</option>
              </select>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setCurrentStep(2)}
            >
              Next
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4">Questions</h2>
              {formData.questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${index}`}>
                    Question {index + 1}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`question-${index}`}
                    name="question"
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(index, e)}
                    placeholder="Enter the question"
                  />

                  {formData.gameType !== 'Hangman' && (
                    <>
                      {['A', 'B', 'C', 'D'].map((option, idx) => (
                        <div key={option} className="mb-2">
                          <label className="block text-gray-700 text-sm font-bold mt-4" htmlFor={`option${option}-${index}`}>
                            Option {option}
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id={`option${option}-${index}`}
                            name={`options-${idx}`}
                            type="text"
                            value={question.options[idx]}
                            onChange={(e) => handleQuestionChange(index, e)}
                            placeholder={`Option ${option}`}
                          />
                        </div>
                      ))}

                      <label className="block text-gray-700 text-sm font-bold mt-4" htmlFor={`correctAnswer-${index}`}>
                        Correct Answer
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={`correctAnswer-${index}`}
                        name="correctAnswer"
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(index, e)}
                        placeholder="Enter the correct answer"
                      />
                    </>
                  )}

                  {formData.gameType === 'Hangman' && (
                    <>
                      <label className="block text-gray-700 text-sm font-bold mt-4" htmlFor={`answer-${index}`}>
                        Answer
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={`answer-${index}`}
                        name="answer"
                        type="text"
                        value={question.answer}
                        onChange={(e) => handleQuestionChange(index, e)}
                        placeholder="Enter the answer"
                      />
                    </>
                  )}
                </div>
              ))}
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateTest;
