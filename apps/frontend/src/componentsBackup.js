import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';
import { 
  Heart, Users, MapPin, Clock, Star, ChevronRight, ChevronLeft,
  User, Settings, Calendar, CreditCard, MessageSquare,
  CheckCircle, X, ArrowLeft, Camera, Globe, Sparkles,
  Timer, Coffee, DollarSign, Shield, Award, LogOut,
  Mail, Lock, Eye, EyeOff, Upload, Check, TrendingUp,
  Activity, CalendarDays, Crown, AlertCircle
} from 'lucide-react';
import { fetchWithAuth } from './lib/fetchWithAuth';

const API_BASE_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001') + '/api';

// Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        await fetchCurrentUser();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        await fetchCurrentUser();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Component
export function AuthForm({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.email, formData.password, formData.name);
    }

    if (result.success) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome back' : 'Join bichance'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-400 transition-colors"
                  placeholder="Your full name"
                />
                <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-400 transition-colors"
                placeholder="your.email@example.com"
              />
              <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-400 transition-colors pr-10"
                placeholder="Enter your password"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-400 hover:text-orange-500 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-gray-600 hover:text-gray-900 flex items-center justify-center w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to homepage
          </button>
        )}
      </div>
    </div>
  );
}

// Onboarding Flow Component
export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [districts, setDistricts] = useState([]);
  const { token, refreshUser } = useAuth();

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/districts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const steps = [
    { number: 1, title: "Personality Assessment", component: PersonalityAssessment },
    { number: 2, title: "Choose Your District", component: LocationSelection },
    { number: 3, title: "Schedule Preferences", component: SchedulingPreferences },
    { number: 4, title: "Food Preferences", component: DietaryPreferences },
    { number: 5, title: "Complete Profile", component: ProfileCreation }
  ];

  const handleNext = (data) => {
    if (currentStep === 1) {
      setAssessmentData(data);
    } else {
      setProfileData({...profileData, ...data});
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Welcome to bichance</h1>
            <div className="text-sm text-gray-600">{currentStep} of {steps.length}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              onNext={handleNext}
              onBack={currentStep > 1 ? handleBack : null}
              data={currentStep === 1 ? assessmentData : profileData}
              districts={districts}
              token={token}
              refreshUser={refreshUser}
              isLastStep={currentStep === steps.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Personality Assessment Component
function PersonalityAssessment({ onNext, data }) {
  const [responses, setResponses] = useState({
    question_1: data.question_1 || null,
    question_2: data.question_2 || null,
    question_3: data.question_3 || null,
    question_4: data.question_4 || null
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const questions = [
    {
      id: 1,
      text: "I prefer spending my evenings...",
      options: [
        { value: 1, text: "In small, intimate gatherings" },
        { value: 2, text: "At large, energetic parties" },
        { value: 3, text: "One-on-one with close friends" },
        { value: 4, text: "Exploring new places alone" }
      ]
    },
    {
      id: 2,
      text: "Are your opinions usually guided by:",
      options: [
        { value: 1, text: "Logic and facts" },
        { value: 2, text: "Emotions and feelings" }
      ]
    },
    {
      id: 3,
      text: "Do you consider yourself more of a...",
      options: [
        { value: 1, text: "Planner who likes structure" },
        { value: 2, text: "Spontaneous adventure seeker" }
      ]
    },
    {
      id: 4,
      text: "If your life were a fashion statement would it be:",
      options: [
        { value: 1, text: "Classic and timeless" },
        { value: 2, text: "Trendy and expressive" }
      ]
    }
  ];

  const handleResponse = (questionId, value) => {
    setResponses({...responses, [`question_${questionId}`]: value});
    
    if (currentQuestion < questions.length) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(responses)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        onNext(responses);
      } else {
        const error = await response.json();
        toast.error(error.detail);
      }
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  };

  const isComplete = Object.values(responses).every(r => r !== null);
  const currentQ = questions[currentQuestion - 1];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Let's get to know you
      </h2>
      <p className="text-gray-600 mb-12">
        Answer a few questions to help us find your perfect dinner companions
      </p>

      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentQuestion} of {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mb-8">
          <div 
            className="bg-orange-400 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            {currentQ.text}
          </h3>
          
          <div className="grid gap-4">
            {currentQ.options.map(option => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResponse(currentQ.id, option.value)}
                className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                  responses[`question_${currentQ.id}`] === option.value
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-400'
                }`}
              >
                <div className="font-medium text-gray-900">{option.text}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {isComplete && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors"
        >
          Continue
        </motion.button>
      )}
    </div>
  );
}

// Location Selection Component
function LocationSelection({ onNext, districts, onBack }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Choose Your District
      </h2>
      <p className="text-gray-600 mb-12">
        Select where you'd like to join your first magical dinner experience
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {districts.map(district => (
          <motion.button
            key={district.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedDistrict(district)}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              selectedDistrict?.id === district.id
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 hover:border-orange-400'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">{district.name}</h3>
              {district.is_hot && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  HOT
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{district.rating}</span>
            </div>
            <div className="text-sm text-gray-600">
              {district.dinners_this_month} dinners this month
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {district.city}, {district.country}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => onNext({ location: selectedDistrict?.name })}
          disabled={!selectedDistrict}
          className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Scheduling Preferences Component
function SchedulingPreferences({ onNext, onBack, data }) {
  const [preferences, setPreferences] = useState({
    timePreference: data.timePreference || '',
    frequency: data.frequency || '',
    availability: data.availability || {}
  });

  const timeSlots = [
    { value: 'lunch', label: 'Lunch (12-2pm)', icon: Coffee },
    { value: 'early_dinner', label: 'Early Dinner (5-7pm)', icon: Clock },
    { value: 'dinner', label: 'Dinner (7-9pm)', icon: Users }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi_weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'occasionally', label: 'Occasionally' }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        When Can You Join Us?
      </h2>
      <p className="text-gray-600 mb-12">
        Let us know your preferred times and frequency for dinner events
      </p>

      {/* Time Preferences */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferred Time</h3>
        <div className="grid gap-4">
          {timeSlots.map(slot => (
            <button
              key={slot.value}
              onClick={() => setPreferences({...preferences, timePreference: slot.value})}
              className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                preferences.timePreference === slot.value
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-400'
              }`}
            >
              <slot.icon className="w-5 h-5 text-orange-400 mr-3" />
              <span className="font-medium text-gray-900">{slot.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">How Often?</h3>
        <div className="grid grid-cols-2 gap-4">
          {frequencies.map(freq => (
            <button
              key={freq.value}
              onClick={() => setPreferences({...preferences, frequency: freq.value})}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.frequency === freq.value
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-400'
              }`}
            >
              <span className="font-medium text-gray-900">{freq.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => onNext(preferences)}
          disabled={!preferences.timePreference || !preferences.frequency}
          className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Dietary Preferences Component
function DietaryPreferences({ onNext, onBack, data }) {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: data.dietaryRestrictions || [],
    cuisinePreferences: data.cuisinePreferences || [],
    spiceLevel: data.spiceLevel || 'medium'
  });

  const restrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'No Restrictions'
  ];

  const cuisines = [
    'Italian', 'Asian', 'Mediterranean', 'French', 'Mexican', 'Indian'
  ];

  const spiceLevels = [
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Medium' },
    { value: 'spicy', label: 'Spicy' },
    { value: 'very_spicy', label: 'Very Spicy' }
  ];

  const toggleRestriction = (restriction) => {
    const updated = preferences.dietaryRestrictions.includes(restriction)
      ? preferences.dietaryRestrictions.filter(r => r !== restriction)
      : [...preferences.dietaryRestrictions, restriction];
    setPreferences({...preferences, dietaryRestrictions: updated});
  };

  const toggleCuisine = (cuisine) => {
    const updated = preferences.cuisinePreferences.includes(cuisine)
      ? preferences.cuisinePreferences.filter(c => c !== cuisine)
      : [...preferences.cuisinePreferences, cuisine];
    setPreferences({...preferences, cuisinePreferences: updated});
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Food Preferences
      </h2>
      <p className="text-gray-600 mb-12">
        Help us choose restaurants that match your dietary needs and taste preferences
      </p>

      {/* Dietary Restrictions */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Dietary Restrictions</h3>
        <div className="grid grid-cols-2 gap-4">
          {restrictions.map(restriction => (
            <button
              key={restriction}
              onClick={() => toggleRestriction(restriction)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.dietaryRestrictions.includes(restriction)
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-400'
              }`}
            >
              <span className="font-medium text-gray-900">{restriction}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Preferences */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Favorite Cuisines</h3>
        <div className="grid grid-cols-2 gap-4">
          {cuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.cuisinePreferences.includes(cuisine)
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-400'
              }`}
            >
              <span className="font-medium text-gray-900">{cuisine}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spice Level */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Spice Level</h3>
        <div className="grid grid-cols-2 gap-4">
          {spiceLevels.map(level => (
            <button
              key={level.value}
              onClick={() => setPreferences({...preferences, spiceLevel: level.value})}
              className={`p-4 rounded-lg border-2 transition-colors ${
                preferences.spiceLevel === level.value
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-400'
              }`}
            >
              <span className="font-medium text-gray-900">{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => onNext(preferences)}
          className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Profile Creation Component
function ProfileCreation({ onNext, onBack, data, token, refreshUser, isLastStep }) {
  const [profile, setProfile] = useState({
    name: data.name || '',
    age: data.age || '',
    bio: data.bio || '',
    conversationTopics: data.conversationTopics || [],
    location: data.location || ''
  });
  const [loading, setLoading] = useState(false);

  const topics = [
    'Travel', 'Technology', 'Food & Cooking', 'Books', 'Movies',
    'Music', 'Sports', 'Art', 'Business', 'Science', 'Philosophy',
    'Photography', 'Fashion', 'Fitness', 'Gaming', 'Nature'
  ];

  const toggleTopic = (topic) => {
    const updated = profile.conversationTopics.includes(topic)
      ? profile.conversationTopics.filter(t => t !== topic)
      : [...profile.conversationTopics, topic];
    setProfile({...profile, conversationTopics: updated});
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fullProfile = {
        ...profile,
        age: parseInt(profile.age),
        preferences: {
          dietary_restrictions: data.dietaryRestrictions || [],
          cuisine_preferences: data.cuisinePreferences || [],
          spice_level: data.spiceLevel || 'medium',
          time_preferences: [data.timePreference || 'dinner'],
          frequency: data.frequency || 'weekly'
        }
      };

      const response = await fetchWithAuth(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fullProfile)
      });

      if (response.ok) {
        toast.success('Profile completed successfully!');
        await refreshUser();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Complete Your Profile
      </h2>
      <p className="text-gray-600 mb-12">
        Tell us a bit about yourself so others can get to know you better
      </p>

      <div className="space-y-8 text-left max-w-lg mx-auto">
        {/* Profile Photo */}
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-orange-400" />
          </div>
          <button className="text-orange-400 hover:text-orange-500 text-sm font-medium">
            Upload Profile Photo
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-400 transition-colors"
            placeholder="Your full name"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => setProfile({...profile, age: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-400 transition-colors"
            placeholder="Your age"
            min="18"
            max="100"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio <span className="text-gray-500">(150 characters max)</span>
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-orange-400 transition-colors resize-none"
            rows="3"
            maxLength="150"
            placeholder="Tell us about yourself, your interests, or what you're looking forward to..."
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {profile.bio.length}/150
          </div>
        </div>

        {/* Conversation Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Conversation Topics You Enjoy
          </label>
          <div className="grid grid-cols-2 gap-2">
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`p-2 text-sm rounded-lg border-2 transition-colors ${
                  profile.conversationTopics.includes(topic)
                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-orange-400 text-gray-700'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-12">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !profile.name || !profile.age || !profile.bio}
          className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </div>
    </div>
  );
}

// Dashboard Component
export function Dashboard() {
  const { user, logout } = useAuth0();
  const [currentView, setCurrentView] = useState('home');
  const [dinners, setDinners] = useState([]);
  const [userDinners, setUserDinners] = useState([]);
  const [pastDinners, setPastDinners] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch available dinners
      const dinnersResponse = await fetchWithAuth(`${API_BASE_URL}/dinners`, { headers });
      if (dinnersResponse.ok) {
        const dinnersData = await dinnersResponse.json();
        setDinners(dinnersData);
      }

      // Fetch user's dinner participations
      const userDinnersResponse = await fetchWithAuth(`${API_BASE_URL}/users/my-dinners`, { headers });
      if (userDinnersResponse.ok) {
        const userDinnersData = await userDinnersResponse.json();
        const upcoming = userDinnersData.filter(d => new Date(d.date) > new Date());
        const past = userDinnersData.filter(d => new Date(d.date) <= new Date());
        setUserDinners(upcoming);
        setPastDinners(past);
      }

      // Fetch subscription status
      const subResponse = await fetchWithAuth(`${API_BASE_URL}/users/subscription-status`, { headers });
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscriptionStatus(subData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const views = {
    home: <DashboardHome 
      dinners={dinners} 
      userDinners={userDinners} 
      pastDinners={pastDinners}
      subscriptionStatus={subscriptionStatus}
      onRefresh={fetchDashboardData}
      loading={loading} 
    />,
    dinners: <DinnersView dinners={dinners} onRefresh={fetchDashboardData} />,
    my_events: <MyEventsView 
      userDinners={userDinners} 
      pastDinners={pastDinners}
      onRefresh={fetchDashboardData}
    />,
    subscription: <SubscriptionView 
      subscriptionStatus={subscriptionStatus}
      onRefresh={fetchDashboardData}
    />,
    profile: <ProfileView user={user} />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">bichance</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome back, {user?.name || user?.nickname || 'there'}!
            </div>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-xl border border-gray-200 p-6 h-fit">
          <nav className="space-y-2">
            {[
              { id: 'home', label: 'Dashboard', icon: Users },
              { id: 'dinners', label: 'Available Dinners', icon: Calendar },
              { id: 'my_events', label: 'My Events', icon: Heart },
              { id: 'subscription', label: 'Subscription', icon: CreditCard },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {views[currentView]}
        </main>
      </div>
    </div>
  );
}

// Dashboard Home View
function DashboardHome({ dinners, userDinners, pastDinners, subscriptionStatus, onRefresh, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <p className="text-gray-600">Welcome to your personalized bichance experience</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{userDinners.length}</div>
              <div className="text-sm text-gray-600">Upcoming Dinners</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{pastDinners.length}</div>
              <div className="text-sm text-gray-600">Completed Dinners</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{dinners.length}</div>
              <div className="text-sm text-gray-600">Available Events</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              subscriptionStatus?.active ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              <Crown className={`w-6 h-6 ${
                subscriptionStatus?.active ? 'text-purple-400' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {subscriptionStatus?.plan || 'Free'}
              </div>
              <div className="text-sm text-gray-600">
                {subscriptionStatus?.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Dinners */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Next Dinners</h2>
            <button 
              onClick={() => window.location.href = '#my_events'}
              className="text-orange-400 hover:text-orange-500 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          {userDinners.length > 0 ? (
            <div className="space-y-4">
              {userDinners.slice(0, 3).map(dinner => (
                <div key={dinner.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dinner.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {dinner.district}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(dinner.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-400">${dinner.price}</div>
                      <div className="text-sm text-green-600">Confirmed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>No upcoming dinners</p>
              <button className="mt-2 text-orange-400 hover:text-orange-500 text-sm font-medium">
                Browse available dinners
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {pastDinners.slice(0, 3).map(dinner => (
              <div key={dinner.id} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Completed dinner at {dinner.restaurant_name}</p>
                  <p className="text-xs text-gray-500">{new Date(dinner.date).toLocaleDateString()}</p>
                </div>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
            ))}
            
            {pastDinners.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>No activity yet</p>
                <p className="text-xs">Join your first dinner to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional view components (DinnersView, MatchesView, etc.) would go here...
function DinnersView({ dinners, onRefresh }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Dinners</h1>
      {/* Dinner listing implementation */}
      <div className="text-gray-500">Dinners view coming soon...</div>
    </div>
  );
}

function MatchesView({ matches }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Matches</h1>
      {/* Matches listing implementation */}
      <div className="text-gray-500">Matches view coming soon...</div>
    </div>
  );
}

function ProfileView({ user }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      {/* Profile management implementation */}
      <div className="text-gray-500">Profile view coming soon...</div>
    </div>
  );
}

function PaymentView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Settings</h1>
      {/* Payment management implementation */}
      <div className="text-gray-500">Payment view coming soon...</div>
    </div>
  );
}



// Dashboard Home View
function DashboardHome({ dinners, userDinners, pastDinners, subscriptionStatus, onRefresh, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <p className="text-gray-600">Welcome to your personalized bichance experience</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{userDinners.length}</div>
              <div className="text-sm text-gray-600">Upcoming Dinners</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{pastDinners.length}</div>
              <div className="text-sm text-gray-600">Completed Dinners</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{dinners.length}</div>
              <div className="text-sm text-gray-600">Available Events</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              subscriptionStatus?.active ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              <Crown className={`w-6 h-6 ${
                subscriptionStatus?.active ? 'text-purple-400' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {subscriptionStatus?.plan || 'Free'}
              </div>
              <div className="text-sm text-gray-600">
                {subscriptionStatus?.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Dinners */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Next Dinners</h2>
            <button 
              onClick={() => window.location.href = '#my_events'}
              className="text-orange-400 hover:text-orange-500 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          {userDinners.length > 0 ? (
            <div className="space-y-4">
              {userDinners.slice(0, 3).map(dinner => (
                <div key={dinner.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dinner.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {dinner.district}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(dinner.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-400">${dinner.price}</div>
                      <div className="text-sm text-green-600">Confirmed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>No upcoming dinners</p>
              <button className="mt-2 text-orange-400 hover:text-orange-500 text-sm font-medium">
                Browse available dinners
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {pastDinners.slice(0, 3).map(dinner => (
              <div key={dinner.id} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Completed dinner at {dinner.restaurant_name}</p>
                  <p className="text-xs text-gray-500">{new Date(dinner.date).toLocaleDateString()}</p>
                </div>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
            ))}
            
            {pastDinners.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>No activity yet</p>
                <p className="text-xs">Join your first dinner to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// My Events View
function MyEventsView({ userDinners, pastDinners, onRefresh }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <button
          onClick={onRefresh}
          className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-orange-400 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({userDinners.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-orange-400 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past Events ({pastDinners.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {userDinners.length > 0 ? (
              userDinners.map(dinner => (
                <div key={dinner.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{dinner.title}</h3>
                      <p className="text-gray-600">{dinner.restaurant_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(dinner.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-green-600 font-medium">Confirmed</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{dinner.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{new Date(dinner.date).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{dinner.current_participants}/{dinner.max_participants} people</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-lg font-bold text-orange-400">${dinner.price}</div>
                    <div className="flex gap-3">
                      <button className="text-gray-600 hover:text-gray-900 text-sm">
                        View Details
                      </button>
                      <button className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors text-sm">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming dinners</h3>
                <p className="text-gray-600 mb-4">Book your next dinner experience</p>
                <button className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors">
                  Browse Dinners
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastDinners.length > 0 ? (
              pastDinners.map(dinner => (
                <div key={dinner.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{dinner.title}</h3>
                      <p className="text-gray-600">{dinner.restaurant_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(dinner.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-600">Rate Experience</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{dinner.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{dinner.max_participants} people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${dinner.price}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-green-600">✓ Completed</div>
                    <div className="flex gap-3">
                      <button className="text-orange-400 hover:text-orange-500 text-sm">
                        Leave Review
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 text-sm">
                        Book Similar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
                <p className="text-gray-600">Your dinner history will appear here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Subscription View
function SubscriptionView({ subscriptionStatus, onRefresh }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription</h1>
        <p className="text-gray-600">Manage your bichance membership</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            subscriptionStatus?.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {subscriptionStatus?.active ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {subscriptionStatus?.plan || 'Free Plan'}
            </h3>
            <p className="text-gray-600 mb-4">
              {subscriptionStatus?.plan === 'Premium' 
                ? 'Unlimited dinners, priority matching, and exclusive events'
                : 'Access to basic dinner events and matching'
              }
            </p>
            <div className="text-2xl font-bold text-gray-900">
              ${subscriptionStatus?.amount || '0'}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">AI personality matching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">
                {subscriptionStatus?.plan === 'Premium' ? 'Unlimited' : '2'} dinners per month
              </span>
            </div>
            <div className="flex items-center gap-2">
              {subscriptionStatus?.plan === 'Premium' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">Priority customer support</span>
            </div>
            <div className="flex items-center gap-2">
              {subscriptionStatus?.plan === 'Premium' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">Exclusive events and venues</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
          {subscriptionStatus?.plan !== 'Premium' && (
            <button className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors">
              Upgrade to Premium
            </button>
          )}
          <button className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            {subscriptionStatus?.active ? 'Manage Subscription' : 'View Plans'}
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
        
        <div className="space-y-4">
          {/* Mock payment history */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-900">Premium Subscription</div>
              <div className="text-sm text-gray-600">Dec 1, 2024</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">$29.99</div>
              <div className="text-sm text-green-600">Paid</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-900">Dinner Event - SoHo</div>
              <div className="text-sm text-gray-600">Nov 28, 2024</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">$45.00</div>
              <div className="text-sm text-green-600">Paid</div>
            </div>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Payment history will appear here</p>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next billing date
            </label>
            <div className="text-gray-900">
              {subscriptionStatus?.next_billing || 'No upcoming charges'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment method
            </label>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">
                {subscriptionStatus?.payment_method || 'No payment method'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="text-orange-400 hover:text-orange-500 text-sm font-medium">
            Update payment method
          </button>
        </div>
      </div>
    </div>
  );
}

// Updated Dinners View
function DinnersView({ dinners, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDinners = dinners.filter(dinner => {
    const matchesSearch = dinner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dinner.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'available' && dinner.available_spots > 0) ||
                         (filter === 'premium' && dinner.price > 50);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Available Dinners</h1>
        <button
          onClick={onRefresh}
          className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search dinners or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-400"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-400"
        >
          <option value="all">All Dinners</option>
          <option value="available">Available Spots</option>
          <option value="premium">Premium Events</option>
        </select>
      </div>

      {/* Dinners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDinners.map(dinner => (
          <div key={dinner.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{dinner.title}</h3>
              <p className="text-gray-600 text-sm">{dinner.restaurant_name}</p>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{dinner.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{new Date(dinner.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{dinner.available_spots} spots left</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-orange-400">${dinner.price}</div>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dinner.available_spots > 0
                    ? 'bg-orange-400 text-white hover:bg-orange-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={dinner.available_spots === 0}
              >
                {dinner.available_spots > 0 ? 'Join Dinner' : 'Full'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDinners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dinners found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

function ProfileView({ user }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || user?.nickname}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div className="text-gray-500">Profile management coming soon...</div>
      </div>
    </div>
  );
}