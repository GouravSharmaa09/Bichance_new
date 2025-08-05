import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faInfoCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home', icon: faHome },
  { to: '/about', label: 'About', icon: faInfoCircle },
  { to: '/signin', label: 'Sign In', icon: faSignInAlt },
  // Add more links as needed
];

export default function MobileNavBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden block">
      <button
        className="fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-lg border border-gray-200"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <FontAwesomeIcon icon={faBars} className="text-2xl text-gray-800" />
      </button>
      {/* Side Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="bg-white w-64 h-full shadow-xl p-6 flex flex-col animate-slideInLeft relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-purple-500 text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="mt-8 flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 text-lg font-semibold text-gray-800 hover:text-purple-600"
                  onClick={() => setOpen(false)}
                >
                  <FontAwesomeIcon icon={link.icon} className="text-xl" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
} 