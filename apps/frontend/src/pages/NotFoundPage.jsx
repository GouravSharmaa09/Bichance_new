import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center fade-in-up">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 