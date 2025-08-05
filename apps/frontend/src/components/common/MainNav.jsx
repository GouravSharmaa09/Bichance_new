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
      <div className="bg-purple-800 text-white py-2 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            animate={{
              x: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm relative z-10">
          <div className="flex items-center space-x-6 mb-2 md:mb-0">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-body font-medium">+1 234 567 8900</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-body font-medium">hello@bichance.com</span>
            </motion.div>
          </div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-heading font-medium">Every Wednesday • 7:00 PM</span>
          </motion.div>
        </div>
      </div>

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