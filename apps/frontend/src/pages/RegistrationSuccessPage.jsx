import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegistrationSuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate('/signin');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center fade-in-up">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">
          Welcome to <span className="text-red-500 font-bold">Bichance</span>! Your account has been created successfully. 
          You'll be redirected to your dashboard in a few seconds.
        </p>
        <button 
          onClick={() => navigate('/signin')}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage; 