import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { login as reduxLogin } from '../store/authSlice';
import { fetchWithAuth } from '../lib/fetchWithAuth';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'https://bichance-production-a30f.up.railway.app') + '/api/v1';

// Simple Registration/Login Component
export function SimpleAuth({ onAuthSuccess }) {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [step, setStep] = useState('enterEmail'); // 'enterEmail' | 'enterOtp' | 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const dispatch = useDispatch();

  const cities = [
    'New York', 'London', 'Singapore', 'Mumbai', 'Delhi', 'Bangalore',
    'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Paris', 'Tokyo'
  ];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { identifier: formData.email || formData.phone, password: formData.password }
        : formData;

      const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        if (!isLogin) {
          dispatch(reduxLogin({ 
            user: data.user, 
            access_token: data.access_token, 
            refresh_token: data.refresh_token, 
            email: data.user.email 
          }));
          navigate('/onboarding');
        } else {
          onAuthSuccess(data.user);
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Authentication failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        toast.success('OTP sent to your email!');
        setStep('enterOtp');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const res = await fetchWithAuth('https://bichance-production-a30f.up.railway.app/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      console.log('OTP verify response:', data);
      if (res.ok) {
        toast.success('OTP verified! Login successful.');
        setOtpToken(data.data.access_token);
        localStorage.setItem('auth_token', data.data.access_token);
        localStorage.setItem('token', data.data.access_token); // Save as 'token' for dashboard
        setUser({ email, ...data.data }); // <-- set user in context
        dispatch(reduxLogin({ 
          user: { email, ...data.data }, 
          access_token: data.data.access_token, 
          refresh_token: data.data.refresh_token, 
          email 
        }));
        navigate('/onboarding');
      } else {
        const error = await res.json();
        toast.error(error.detail || 'Invalid or expired OTP');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">bichance</h1>
          <p className="text-gray-600 mt-2">
            {isOtpMode ? 'OTP Login' : (isLogin ? 'Welcome back!' : 'Join the community')}
          </p>
        </div>
        {isOtpMode ? (
          <form onSubmit={step === 'enterEmail' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
            {step === 'enterEmail' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="your@email.com"
                />
              </div>
            )}
            {step === 'enterOtp' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter OTP received"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {otpLoading ? 'Loading...' : (step === 'enterEmail' ? 'Send OTP' : 'Verify OTP')}
            </button>
            {step === 'enterOtp' && (
              <button
                type="button"
                onClick={() => setStep('enterEmail')}
                className="w-full mt-2 text-red-500 hover:text-red-600 text-sm"
              >
                Change Email
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isLogin ? 'Email or Phone' : 'Email'}
              </label>
              <input
                type={isLogin ? "text" : "email"}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={isLogin ? "Email or phone number" : "your@email.com"}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="+1234567890"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select your city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsOtpMode(!isOtpMode)}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            {isOtpMode ? 'Use Email/Password Login' : 'Use OTP Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SimpleAuth; 