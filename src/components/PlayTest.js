import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayTest = ({ match }) => {
  const [testData, setTestData] = useState(null);
  const testId = match.params.testId; // Extract testId from URL params

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`/api/tests/${testId}`);
        setTestData(response.data); // Assuming API returns test data
      } catch (error) {
        console.error('Error fetching test details:', error);
      }
    };

    fetchTestDetails();
  }, [testId]);

  if (!testData) {
    return <div>Loading test...</div>;
  }

  return (
    <div>
      <h2>{testData.title}</h2>
      <p>{testData.description}</p>
      {/* Display questions or interactive elements here */}
    </div>
  );
};

export default PlayTest;
