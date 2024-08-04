import React from 'react';

const GradeEvaluation = () => {
  const grades = [
    { id: 1, student: 'John Doe', grade: 'A' },
    { id: 2, student: 'Jane Smith', grade: 'B' },
    { id: 3, student: 'Alice Johnson', grade: 'A-' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Grade Evaluation</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-200">
          {grades.map(record => (
            <li key={record.id} className="py-4 flex justify-between">
              <span className="text-gray-700 font-bold">{record.student}</span>
              <span className="text-gray-500">{record.grade}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GradeEvaluation;
