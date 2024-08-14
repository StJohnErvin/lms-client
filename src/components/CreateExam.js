import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const CreateTest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    testName: '',
    examTime: '',
    gameType: '',
    questions: [{ question: '', options: ['', '', '', ''], answer: '' }],
  });

  // Hardcoded user data
  const user = {
    uid: 'fakeUserId', // Hardcoded user ID
    name: 'Fake Teacher', // Hardcoded name
    role: 'teacher' // Hardcoded role
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][name] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const { value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', options: ['', '', '', ''], answer: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData, createdBy: user.uid, role: user.role }; // Use hardcoded user details
  
    try {
      const docRef = await addDoc(collection(db, "tests"), finalData);
      console.log("Document written with ID: ", docRef.id);
      alert('Form submitted successfully');
      setCurrentStep(1);
      setFormData({
        testName: '',
        examTime: '',
        gameType: '',
        questions: [{ question: '', options: ['', '', '', ''], answer: '' }],
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error submitting form');
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
                Exam Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="examTime"
                name="examTime"
                type="text"
                value={formData.examTime}
                onChange={handleChange}
                placeholder="Enter exam time"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameType">
                Extra Game Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="gameType"
                name="gameType"
                value={formData.gameType}
                onChange={handleChange}
              >
                <option>Hangman</option>
                <option>Jeopardy</option>
                <option>Who Wants to Be a Millionaire?</option>
              </select>
            </div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setCurrentStep(2)}
            >
              Next
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${qIndex}`}>
                  Question {qIndex + 1}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={`question-${qIndex}`}
                  name="question"
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  placeholder="Enter question"
                />
                <div className="mt-4">
                  {question.options.map((option, oIndex) => (
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
                        placeholder="Enter option"
                      />
                    </div>
                  ))}
                </div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`answer-${qIndex}`}>
                  Correct Answer
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={`answer-${qIndex}`}
                  name="answer"
                  type="text"
                  value={question.answer}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  placeholder="Enter correct answer"
                />
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddQuestion}
            >
              Add Another Question
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
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
