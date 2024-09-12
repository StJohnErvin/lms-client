import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const GradeEvaluation = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'scores'));
        const gradesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort grades alphabetically by student name
        const sortedGrades = gradesList.sort((a, b) => {
          const nameA = a.student ? a.student.toLowerCase() : '';
          const nameB = b.student ? b.student.toLowerCase() : '';
          return nameA.localeCompare(nameB);
        });

        setGrades(sortedGrades);
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Grade Evaluation</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-200">
          {grades.map(record => (
            <li key={record.id} className="py-4 flex justify-between">
              <span className="text-gray-700 font-bold">{record.student || 'Unknown'}</span>
              <span className="text-gray-500">{record.score || 'No score'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GradeEvaluation;
