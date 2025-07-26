import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
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
            <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          
          {/* Settings content */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-gray-600 mb-4">Manage your profile information and preferences</p>
              <button
                onClick={() => navigate('/profile')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Settings</h3>
              <p className="text-gray-600 mb-4">Configure your notification preferences</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-gray-700">Push notifications</span>
                </label>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Settings</h3>
              <p className="text-gray-600 mb-4">Control your privacy and data settings</p>
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Privacy Policy
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Actions</h3>
              <p className="text-gray-600 mb-4">Manage your account</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 