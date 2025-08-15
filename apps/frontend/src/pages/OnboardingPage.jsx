import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OnboardingPage = () => {
  const navigate = useNavigate();

  const title = "Join\nDinner\nwith 5\nAmazing\nStrangers";
  const image = "/on.jpg";

  const handleNext = () => {
    navigate('/auth');
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleAlreadyHaveAccount = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Back Arrow */}
      <div className="absolute top-12 left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col min-h-screen">
        {/* Top Section with Text Overlay */}
        <div className="flex items-center px-6 md:pt-[60px]" style={{ paddingTop: '330px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left md:text-center md:w-full"
          >
            <h1 className="text-6xl md:text-6xl font-extrabold text-white leading-none tracking-wide">
              {title.split('\n').map((line, index) => (
                <span key={index} className="block">{line}</span>
              ))}
            </h1>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="bg-purple-600 rounded-t-3xl md:rounded-3xl p-6 md:p-8 mt-auto mx-4 md:max-w-md md:mx-auto md:mt-8 md:mb-8">

          {/* Legal Text */}
          <p className="text-white/80 text-sm text-center mb-6 leading-relaxed">
            By signing up you agree to the{' '}
            <span className="underline">Terms of Service</span>,{' '}
            <span className="underline">Privacy Policy</span> and{' '}
            <span className="underline">Community Guidelines</span>.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={handleGetStarted}
              className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-950 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
            
            <motion.button
              onClick={handleAlreadyHaveAccount}
              className="w-full bg-white text-purple-900 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              I already have an account
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
