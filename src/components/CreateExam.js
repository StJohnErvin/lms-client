import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateTest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    testName: '',
    examTime: '',
    gameType: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }], // Default for Jeopardy and Millionaire
    materials: null, // For uploading materials
  });
  const [errors, setErrors] = useState({ examTime: '' });

  const user = {
    uid: 'newUser', // Hardcoded user ID
    name: 'Fake Teacher', // Hardcoded name
    role: 'teacher', // Hardcoded role
  };

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

  // Handle file changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, materials: file });
  };

  // Handle question changes
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][name] = value;
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

    let materialURL = null;

    if (formData.materials) {
      const storageRef = ref(storage, `materials/${formData.materials.name}`);
      const snapshot = await uploadBytes(storageRef, formData.materials);
      materialURL = await getDownloadURL(snapshot.ref);
    }

    const finalData = {
      ...formData,
      createdBy: user.uid,
      role: user.role,
      materialURL,
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
        materials: null,
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
                placeholder="Enter exam timer (MM:SS)"
              />
              {errors.examTime && <p className="text-red-500 text-xs italic">{errors.examTime}</p>}
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
                <option value="">Select a game type</option>
                <option value="Hangman">Hangman</option>
                <option value="Jeopardy">Jeopardy</option>
                <option value="Who Wants to Be a Millionaire?">Who Wants to Be a Millionaire?</option>
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
            {formData.gameType === 'Hangman' ? (
              formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${qIndex}`}>
                    Hangman Question {qIndex + 1}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`question-${qIndex}`}
                    name="question"
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    placeholder="Enter the question"
                  />
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`answer-${qIndex}`}>
                    Hangman Answer
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`answer-${qIndex}`}
                    name="answer"
                    type="text"
                    value={question.answer}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    placeholder="Enter the answer"
                  />
                </div>
              ))
            ) : (
              formData.questions.map((question, qIndex) => (
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
                    placeholder="Enter the question"
                  />
                  {formData.gameType !== 'Hangman' && (
                    <>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Options
                      </label>
                      {question.options.map((option, oIndex) => (
                        <input
                          key={oIndex}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                          type="text"
                          name="options"
                          value={option}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, {
                              target: {
                                name: 'options',
                                value: [...question.options.slice(0, oIndex), e.target.value, ...question.options.slice(oIndex + 1)],
                              },
                            })
                          }
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      ))}
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`correctAnswer-${qIndex}`}>
                        Correct Answer
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={`correctAnswer-${qIndex}`}
                        name="correctAnswer"
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, e)}
                        placeholder="Enter the correct answer"
                      />
                    </>
                  )}
                </div>
              ))
            )}

            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="materials">
                Upload Materials
              </label>
              <input
                type="file"
                id="materials"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setCurrentStep(1)}
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateTest;
