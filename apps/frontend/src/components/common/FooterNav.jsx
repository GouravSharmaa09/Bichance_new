import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faBlog, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function FooterNav() {
  const location = useLocation();
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center py-3">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-red-600' : 'text-gray-600'} hover:text-red-800`}>
        <FontAwesomeIcon icon={faHome} className="text-2xl" />
        <span className="text-xs font-bold mt-1">Home</span>
      </Link>
      <Link to="/about" className={`flex flex-col items-center ${location.pathname === '/about' ? 'text-red-600' : 'text-gray-600'} hover:text-red-800`}>
        <FontAwesomeIcon icon={faInfoCircle} className="text-2xl" />
        <span className="text-xs font-bold mt-1">About</span>
      </Link>
      <Link to="/blog" className={`flex flex-col items-center ${location.pathname === '/blog' ? 'text-red-600' : 'text-gray-600'} hover:text-red-800`}>
        <FontAwesomeIcon icon={faBlog} className="text-2xl" />
        <span className="text-xs font-bold mt-1">Blog</span>
      </Link>
      <Link to="/contact-us" className={`flex flex-col items-center ${location.pathname === '/contact-us' ? 'text-red-600' : 'text-gray-600'} hover:text-red-800`}>
        <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
        <span className="text-xs font-bold mt-1">Contact Us</span>
      </Link>
    </div>
  );
} 