import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, fetchCurrentUser } from '../store/authSlice';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { checkOnboardingCompletion } from '../utils/onboardingUtils';
import { motion } from 'framer-motion';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Removed automatic redirect to dashboard - now handled in handleSubmit with onboarding check

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your real API call
      const response = await fetchWithAuth('https://bichance-production-a30f.up.railway.app/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.access_token) {
        dispatch(login({ 
          user: data.user, 
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          email: data.user.email 
        }));
        // Fetch latest user data
        await dispatch(fetchCurrentUser());
        toast.success('Welcome back!');
        
        // Check if user has completed onboarding
        const hasCompletedOnboarding = await checkOnboardingCompletion();
        console.log('SignInPage - Onboarding completion status:', hasCompletedOnboarding);
        
        if (hasCompletedOnboarding) {
          console.log('SignInPage - Redirecting to dashboard');
        navigate('/dashboard');
        } else {
          console.log('SignInPage - Redirecting to onboarding');
          navigate('/onboarding');
        }
      } else {
        toast.error(data.message || data.detail || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 text-white">
        <span className="text-sm font-medium">9:41</span>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-3 bg-white rounded-sm"></div>
          <div className="w-6 h-3 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-40 flex justify-between items-center px-6">
        <span className="text-white font-bold text-lg">LOGO</span>
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/auth.avif)' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col h-full">
        {/* Top Section with Text Overlay */}
        <div className="flex-1 flex items-center justify-center px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Welcome<br />
              Back
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Sign in to continue your journey
            </p>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-t-3xl p-6 md:max-w-md md:mx-auto md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-white font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-300 outline-none text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                  placeholder="Enter your email"
                  required
              />
            </div>

            <div>
                <label className="block text-white font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-300 outline-none text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                  placeholder="Enter your password"
                  required
              />
          </div>

              <motion.button
              type="submit"
              disabled={loading}
                className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-950 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            {/* Legal Text */}
            <p className="text-white/80 text-sm text-center mt-6 leading-relaxed">
              By signing in you agree to the{' '}
              <span className="underline">Terms of Service</span>,{' '}
              <span className="underline">Privacy Policy</span> and{' '}
              <span className="underline">Community Guidelines</span>.
            </p>

            {/* Alternative Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-white text-purple-900 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-300"
              >
                Create New Account
            </button>
              
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full text-white/80 underline text-center"
              >
                Forgot your password?
              </button>
            </div>
          </motion.div>
          </div>
      </div>
    </div>
  );
};

export default SignInPage; 