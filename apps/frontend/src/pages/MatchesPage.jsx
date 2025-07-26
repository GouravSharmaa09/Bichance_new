import React from 'react';
import { useNavigate } from 'react-router-dom';

const MatchesPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Matches Page</h1>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-800">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MatchesPage; 