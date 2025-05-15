import React from 'react';
import ExamScheduler from './components/ExamScheduler'; // ✅ correct path

function App() {
  const person_id = 1; // Replace with real user ID if needed

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-xl w-full p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Exam Scheduler</h1>
        <ExamScheduler person_id={person_id} />
      </div>
    </div>
  );
}

export default App;
