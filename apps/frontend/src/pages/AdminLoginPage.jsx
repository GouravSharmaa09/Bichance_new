import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Access</h2>
          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg"
          >
            Enter Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 