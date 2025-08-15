import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MainNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleJoinNow = () => {
    navigate('/auth');
  };

  return (
    <>
      {/* Top Bar */}
      {/* Removed the purple div with book table button and time */}

      {/* Navigation */}
      <motion.nav 
        className="bg-white shadow-lg sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.button 
              onClick={() => navigate('/')}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <h1 className="text-3xl font-display font-bold text-purple-800 tracking-tight">Bichance</h1>
            </motion.button>
            
            <div className="hidden md:flex items-center space-x-8">
                             {location.pathname !== '/' && (
                 <motion.button 
                   onClick={() => navigate('/')} 
                   className="text-gray-700 hover:text-purple-600 font-display font-bold transition-colors duration-300 relative group"
                   whileHover={{ scale: 1.05 }}
                 >
                   Home
                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                 </motion.button>
               )}
              <motion.button 
                onClick={() => navigate('/about')} 
                className="text-gray-700 hover:text-purple-600 font-heading font-medium transition-colors duration-300 relative group"
                whileHover={{ scale: 1.05 }}
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
              <motion.button 
                onClick={() => navigate('/blog')} 
                className="text-gray-700 hover:text-purple-600 font-heading font-medium transition-colors duration-300 relative group"
                whileHover={{ scale: 1.05 }}
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
              <motion.button 
                onClick={() => navigate('/contact-us')} 
                className="text-gray-700 hover:text-purple-600 font-heading font-medium transition-colors duration-300 relative group"
                whileHover={{ scale: 1.05 }}
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
              <motion.button 
                onClick={handleJoinNow}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-white border-t border-gray-100 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3">
                                 {location.pathname !== '/' && (
                   <motion.button 
                     onClick={() => navigate('/')} 
                     className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-display font-bold"
                     whileHover={{ x: 10 }}
                   >
                     Home
                   </motion.button>
                 )}
                <motion.button 
                  onClick={() => navigate('/about')} 
                  className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-heading font-medium"
                  whileHover={{ x: 10 }}
                >
                  About
                </motion.button>
                <motion.button 
                  onClick={() => navigate('/blog')} 
                  className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-heading font-medium"
                  whileHover={{ x: 10 }}
                >
                  Blog
                </motion.button>
                <motion.button 
                  onClick={() => navigate('/contact-us')} 
                  className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-heading font-medium"
                  whileHover={{ x: 10 }}
                >
                  Contact
                </motion.button>
                <motion.button 
                  onClick={handleJoinNow}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full mx-4 font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default MainNav; 