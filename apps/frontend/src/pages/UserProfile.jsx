import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faQuestionCircle, faChevronRight, faHouse, faBell } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
  const [activePage, setActivePage] = useState('profile');
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fef7ed] px-4 py-6">
      {/* Profile Section */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="text-center w-full">
          <div className="font-bold text-xl mb-4">Profile</div>
          <div className="flex justify-end w-full mb-2">
            <button className="text-gray-600 text-xl"><FontAwesomeIcon icon={faQuestionCircle} /></button>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-600" />
            </div>
            <div className="font-medium text-lg mb-2">Gourav</div>
            <button className="px-6 py-2 rounded-full border border-gray-800 font-semibold bg-white hover:bg-gray-100 transition mb-2">Edit profile</button>
          </div>
        </div>
        {/* Action Cards */}
        <div className="w-full flex flex-col gap-4 mb-4">
          <button className="flex items-center justify-between w-full bg-[#fef7ed] border border-gray-300 rounded-xl px-4 py-4 font-semibold text-left hover:bg-gray-100 transition">
            <span className="flex items-center gap-3"><FontAwesomeIcon icon={faCalendar} className="text-lg" /> Your Bookings</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
          </button>
          <button className="flex items-center justify-between w-full bg-[#fef7ed] border border-gray-300 rounded-xl px-4 py-4 font-semibold text-left hover:bg-gray-100 transition">
            <span className="flex items-center gap-3"><FontAwesomeIcon icon={faQuestionCircle} className="text-lg" /> Help Center</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
          </button>
        </div>
        {/* Guide Card */}
        <div className="w-full border border-gray-300 rounded-xl px-4 py-4 bg-[#fef7ed] flex flex-col gap-2 mb-4">
          <div className="font-bold mb-1">Guide</div>
          <div className="text-gray-700 text-sm mb-2">Discover our 6 steps to talking to strangers and having unforgettable dinners.</div>
          <button className="ml-auto px-5 py-2 rounded-full border border-gray-800 font-semibold bg-white hover:bg-gray-100 transition">Check it out</button>
        </div>
        {/* Bottom Navigation Bar */}
        <div className="w-full max-w-md flex justify-between items-center bg-white border-t border-gray-200 px-6 py-3">
          <button className={`flex flex-col items-center text-gray-700 hover:text-red-600 focus:outline-none ${activePage === 'home' ? 'text-red-600' : ''}`} onClick={() => setActivePage('home')}>
            <FontAwesomeIcon icon={faHouse} className="text-2xl" />
          </button>
          <button className={`flex flex-col items-center text-gray-700 hover:text-red-600 focus:outline-none ${activePage === 'notifications' ? 'text-red-600' : ''}`} onClick={() => setActivePage('notifications')}>
            <FontAwesomeIcon icon={faBell} className="text-2xl" />
          </button>
          <button className={`flex flex-col items-center text-gray-700 hover:text-red-600 focus:outline-none ${activePage === 'bookings' ? 'text-red-600' : ''}`} onClick={() => setActivePage('bookings')}>
            <FontAwesomeIcon icon={faCalendar} className="text-2xl" />
          </button>
          <button className={`flex flex-col items-center text-gray-700 hover:text-red-600 focus:outline-none ${activePage === 'profile' ? 'text-red-600' : ''}`} onClick={() => setActivePage('profile')}>
            <FontAwesomeIcon icon={faUser} className="text-2xl" />
        </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 