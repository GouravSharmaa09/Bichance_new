import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-black text-white pt-12 pb-6 w-full" style={{ position: 'relative', bottom: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full">
          {/* Logo left */}
          <div className="flex-1 flex justify-start mb-8 md:mb-0">
            <img src="/l1.png" alt="bichance logo" style={{ width: 180, height: 80, objectFit: 'cover', margin: '24px 0 16px 0' }} />
          </div>
          {/* Main footer content centered, with border above and below */}
          <div className="flex-1 flex flex-col items-center w-full">
            <div className="border-t border-b border-gray-800 py-8 w-full flex flex-col items-center">
              {/* Centered Links */}
              <div className="flex flex-wrap justify-center gap-6 mb-6">
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white text-sm">Home</button>
                <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white text-sm">About</button>
                <button onClick={() => navigate('/blog')} className="text-gray-300 hover:text-white text-sm">Blog</button>
                <button onClick={() => navigate('/faq')} className="text-gray-300 hover:text-white text-sm">FAQ</button>
                <button onClick={() => navigate('/help')} className="text-gray-300 hover:text-white text-sm">Help Center</button>
                <button onClick={() => navigate('/privacy')} className="text-gray-300 hover:text-white text-sm">Privacy Policy</button>
                <button onClick={() => navigate('/terms')} className="text-gray-300 hover:text-white text-sm">Terms & Conditions</button>
                <button onClick={() => navigate('/contact-us')} className="text-gray-300 hover:text-white text-sm">Contact Us</button>
              </div>
              {/* Store Badges Centered */}
              <div className="flex gap-4 justify-center mb-6">
                <a href="https://play.google.com/store/games?hl=en_IN&pli=1" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-12 transition-transform duration-200 hover:scale-105 hover:shadow-lg rounded-lg bg-black"
                    style={{ minWidth: 150 }}
                  />
                </a>
                <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-12 transition-transform duration-200 hover:scale-105 hover:shadow-lg rounded-lg bg-black"
                    style={{ minWidth: 150 }}
                  />
                </a>
              </div>
              {/* Social Icons Centered */}
              <div className="flex gap-4 justify-center mb-6">
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black border border-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
                  </span>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black border border-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H6v4h4v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </span>
                </a>
                {/* Twitter/X - latest logo */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black border border-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-black">
                      <path d="M17.53 2H21.5L14.36 10.39L22.75 21.5H16.08L10.98 14.73L5.19 21.5H1.22L8.8 12.61L0.75 2H7.58L12.18 8.18L17.53 2ZM16.36 19.5H18.19L7.75 4.5H5.81L16.36 19.5Z" fill="currentColor"/>
                    </svg>
                  </span>
                </a>
                {/* WhatsApp - latest logo */}
                <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="group">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black border border-gray-700 hover:bg-white hover:shadow-lg transition-all duration-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-black">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.205 5.077 4.366.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zM12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.484 1.34 4.997l-1.389 5.077 5.207-1.368c1.482.81 3.16 1.26 4.839 1.26 5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.182-2.927-7.07C17.186 3.043 14.674 2.003 12.004 2.003z" fill="currentColor"/>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
            {/* Copyright */}
            <div className="text-center text-gray-400 text-xs w-full mt-6">
              <p>&copy; 2025 All rights reserved. bichance</p>
              <p className="mt-1 text-gray-400 text-xs">Developed by Gourav Sharma</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 