import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center fade-in-up">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Email Verification Page</h1>
        <button onClick={() => navigate('/')} className="text-red-500 hover:text-red-700 underline transition-colors">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 