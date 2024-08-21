import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EditTest = () => {
  const { testId } = useParams();  // Get the test ID from the URL
  const [formData, setFormData] = useState({
    testName: '',
    examTime: '',
    gameType: '',
    questions: [{ question: '', options: ['', '', '', ''], answer: '' }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const docRef = doc(db, 'tests', testId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [testId]);

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
    try {
      const docRef = doc(db, 'tests', testId);
      await updateDoc(docRef, formData);
      alert('Test updated successfully');
      navigate('/gamified-tests');  // Navigate back to the test list
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('Error updating test: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Edit Test</h1>
      <form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
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
                    name="option"
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    placeholder={`Enter option ${oIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Test
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            type="button"
            onClick={() => navigate('/gamified-tests')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTest;
