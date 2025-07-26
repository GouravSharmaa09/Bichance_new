import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleJoinNow = () => {
    navigate('/auth');
  };
  return (
    <motion.nav 
      className="bg-[#FEF7ED] border-b border-red-100 shadow-sm fixed w-full z-50 h-16 px-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ padding: 0 }}
    >
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            transition={{ duration: 0.2 }}
          >
            <img src="/l1.png"  style={{ width: 140, height: 60, objectFit: 'cover', marginLeft: 0, marginRight: 4 }} onClick={() => navigate('/')} />
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.button 
              onClick={() => navigate('/')} 
              className={`font-medium transition-colors duration-300 ${location.pathname === '/' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}
              whileHover={{ scale: 1.05 }}
            >
              Home
            </motion.button>
            <motion.button 
              onClick={() => navigate('/about')} 
              className={`font-medium transition-colors duration-300 ${location.pathname === '/about' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}
              whileHover={{ scale: 1.05 }}
            >
              About
            </motion.button>
            <motion.button 
              onClick={() => navigate('/blog')} 
              className={`font-medium transition-colors duration-300 ${location.pathname === '/blog' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}
              whileHover={{ scale: 1.05 }}
            >
              Blog
            </motion.button>
            <motion.button 
              onClick={() => navigate('/contact-us')} 
              className={`font-medium transition-colors duration-300 ${location.pathname === '/contact-us' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}
              whileHover={{ scale: 1.05 }}
            >
              Contact Us
            </motion.button>
            <motion.button 
              onClick={handleJoinNow}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-red-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-[#FEF7ED] border-t border-red-100 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              <button onClick={() => navigate('/')} className={`text-left px-4 py-2 ${location.pathname === '/' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}>Home</button>
              <button onClick={() => navigate('/about')} className={`text-left px-4 py-2 ${location.pathname === '/about' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}>About</button>
              <button onClick={() => navigate('/blog')} className={`text-left px-4 py-2 ${location.pathname === '/blog' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}>Blog</button>
              <button onClick={() => navigate('/contact-us')} className={`text-left px-4 py-2 ${location.pathname === '/contact-us' ? 'text-red-600 font-bold' : 'text-gray-700 hover:text-red-600'}`}>Contact Us</button>
              <button 
                onClick={handleJoinNow}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full mx-4 font-semibold"
              >
                Join Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default MainNav; 