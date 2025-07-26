import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewMatches = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-gray-800">View Matches</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h2>
          
          {/* No matches message */}
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-6">Book your first dinner to start seeing matches!</p>
            <button
              onClick={() => navigate('/dinners')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Dinners
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMatches; 