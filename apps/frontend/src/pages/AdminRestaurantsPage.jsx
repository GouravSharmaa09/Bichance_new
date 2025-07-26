import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRestaurantsPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Restaurants Page</h1>
        <button onClick={() => navigate('/admin')} className="text-blue-600 hover:text-blue-800">
          Back to Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminRestaurantsPage; 