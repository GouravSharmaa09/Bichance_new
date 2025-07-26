import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import { useWaitlist, useDinners, useBookings } from "./hooks/useSupabase";
import { db } from "./lib/supabase";
import {
  analytics,
  personalityTracking,
  diningManagement,
} from "./lib/supabaseEnhanced";
import AdminPanel from "./components/AdminPanel";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import { fetchWithAuth } from './lib/fetchWithAuth';

// API Configuration
const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL ||
    "https://bichance-production-a30f.up.railway.app") + "/api";

// Supported countries with their top cities and localities
const COUNTRY_CITY_DATA = {
  Singapore: {
    cities: [
      {
        name: "Singapore City",
        localities: ["Marina Bay", "Orchard Road", "Clarke Quay"],
      },
    ],
  },
  "United States": {
    cities: [
      {
        name: "New York",
        localities: ["Manhattan", "Brooklyn", "Queens"],
      },
      {
        name: "San Francisco",
        localities: ["SOMA", "Mission District", "Nob Hill"],
      },
      {
        name: "Los Angeles",
        localities: ["Beverly Hills", "Santa Monica", "Hollywood"],
      },
    ],
  },
  "United Kingdom": {
    cities: [
      {
        name: "London",
        localities: ["Central London", "Canary Wharf", "Shoreditch"],
      },
      {
        name: "Manchester",
        localities: ["City Centre", "Northern Quarter", "Ancoats"],
      },
      {
        name: "Edinburgh",
        localities: ["Old Town", "New Town", "Leith"],
      },
    ],
  },
  Canada: {
    cities: [
      {
        name: "Toronto",
        localities: ["Downtown", "King Street West", "Entertainment District"],
      },
      {
        name: "Vancouver",
        localities: ["Downtown", "Yaletown", "Gastown"],
      },
      {
        name: "Montreal",
        localities: ["Old Montreal", "Plateau", "Downtown"],
      },
    ],
  },
  Australia: {
    cities: [
      {
        name: "Sydney",
        localities: ["CBD", "Darling Harbour", "The Rocks"],
      },
      {
        name: "Melbourne",
        localities: ["CBD", "South Yarra", "Fitzroy"],
      },
      {
        name: "Brisbane",
        localities: ["CBD", "South Bank", "Fortitude Valley"],
      },
    ],
  },
  Germany: {
    cities: [
      {
        name: "Berlin",
        localities: ["Mitte", "Kreuzberg", "Prenzlauer Berg"],
      },
      {
        name: "Munich",
        localities: ["Altstadt", "Maxvorstadt", "Schwabing"],
      },
      {
        name: "Hamburg",
        localities: ["HafenCity", "St. Pauli", "Altona"],
      },
    ],
  },
  France: {
    cities: [
      {
        name: "Paris",
        localities: ["1st Arrondissement", "Marais", "Saint-Germain"],
      },
      {
        name: "Lyon",
        localities: ["Presqu'île", "Vieux Lyon", "Part-Dieu"],
      },
      {
        name: "Nice",
        localities: ["Old Town", "Promenade des Anglais", "Liberation"],
      },
    ],
  },
  India: {
    cities: [
      {
        name: "Mumbai",
        localities: ["Bandra", "Lower Parel", "Andheri"],
      },
      {
        name: "Delhi",
        localities: ["Connaught Place", "Khan Market", "Hauz Khas"],
      },
      {
        name: "Bangalore",
        localities: ["Koramangala", "Indiranagar", "Brigade Road"],
      },
    ],
  },
  Japan: {
    cities: [
      {
        name: "Tokyo",
        localities: ["Shibuya", "Shinjuku", "Ginza"],
      },
      {
        name: "Osaka",
        localities: ["Namba", "Umeda", "Shinsekai"],
      },
      {
        name: "Kyoto",
        localities: ["Gion", "Arashiyama", "Downtown"],
      },
    ],
  },
  UAE: {
    cities: [
      {
        name: "Dubai",
        localities: ["Downtown Dubai", "Dubai Marina", "Business Bay"],
      },
      {
        name: "Abu Dhabi",
        localities: ["Corniche", "Al Reem Island", "Yas Island"],
      },
      {
        name: "Sharjah",
        localities: ["Al Majaz", "Al Qasba", "City Centre"],
      },
    ],
  },
};

// Extract all supported cities from COUNTRY_CITY_DATA
const SUPPORTED_CITIES = Object.values(COUNTRY_CITY_DATA).flatMap((country) =>
  country.cities.map((city) => city.name)
);

// Country codes mapping (kept for phone verification)
const COUNTRY_CODES = {
  Singapore: "+65",
  "United States": "+1",
  "United Kingdom": "+44",
  Canada: "+1",
  Australia: "+61",
  Germany: "+49",
  France: "+33",
  India: "+91",
  Japan: "+81",
  Brazil: "+55",
  Mexico: "+52",
  Netherlands: "+31",
  Switzerland: "+41",
  Sweden: "+46",
  Norway: "+47",
  Denmark: "+45",
  Finland: "+358",
  Belgium: "+32",
  Austria: "+43",
  Italy: "+39",
  Spain: "+34",
  Portugal: "+351",
  UAE: "+971",
  "Hong Kong": "+852",
  "South Korea": "+82",
  Thailand: "+66",
  Malaysia: "+60",
  Philippines: "+63",
  Indonesia: "+62",
  Vietnam: "+84",
  Taiwan: "+886",
  Israel: "+972",
  Turkey: "+90",
  "South Africa": "+27",
  Other: "+1",
};

// Complete 15 Questions for Personality Assessment
const ONBOARDING_QUESTIONS = [
  {
    id: 1,
    question: "I enjoy discussing politics and current news.",
    inverted: false,
  },
  {
    id: 2,
    question: "I prefer small gatherings over large parties.",
    inverted: true,
  },
  {
    id: 3,
    question: "I like to plan ahead and stay organized.",
    inverted: false,
  },
  {
    id: 4,
    question: "I often go with the flow rather than planning.",
    inverted: true,
  },
  {
    id: 5,
    question: "I enjoy debating different ideas.",
    inverted: false,
  },
  {
    id: 6,
    question: "I like trying new restaurants and cuisines.",
    inverted: false,
  },
  {
    id: 7,
    question: "I feel energized when I'm around other people.",
    inverted: false,
  },
  {
    id: 8,
    question: "I enjoy listening more than talking.",
    inverted: true,
  },
  {
    id: 9,
    question: "I enjoy philosophical or deep conversations.",
    inverted: false,
  },
  {
    id: 10,
    question: "I prefer familiar foods over exotic dishes.",
    inverted: true,
  },
  {
    id: 11,
    question: "I enjoy meeting new and different types of people.",
    inverted: false,
  },
  {
    id: 12,
    question: "I like organizing events and gatherings.",
    inverted: false,
  },
  {
    id: 13,
    question: "I prefer quiet environments.",
    inverted: true,
  },
  {
    id: 14,
    question: "I am comfortable sharing personal stories.",
    inverted: false,
  },
  {
    id: 15,
    question: "I like helping others feel included in a group.",
    inverted: false,
  },
];

// Add at the top, after ONBOARDING_QUESTIONS
const IDENTITY_QUESTIONS = [
  {
    id: "gender",
    question: "What is your gender?",
    options: ["Male", "Female", "Other", "Prefer not to say"],
  },
  {
    id: "relationship_status",
    question: "What is your current relationship status?",
    options: [
      "Single",
      "In a relationship",
      "Married",
      "Divorced",
      "Widowed",
      "Prefer not to say",
    ],
  },
  {
    id: "children",
    question: "Do you have children?",
    options: ["Yes", "No"],
  },
  {
    id: "profession",
    question: "What is your professional domain or industry?",
    options: [
      "Technology",
      "Business",
      "Education",
      "Healthcare",
      "Arts",
      "Student",
      "Other",
    ],
  },
  {
    id: "country",
    question: "What is your country of origin?",
    options: [
      "India",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Other",
    ], // You can expand this list or use country API
  },
  {
    id: "dob",
    question: "What is your date of birth? (YYYY-MM-DD)",
    options: null, // Will use a date input
  },
];

// Auto-save functionality
const useAutoSave = (data, endpoint) => {
  useEffect(() => {
    const saveData = async () => {
      if (Object.keys(data).length > 0) {
        try {
          await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.log("Auto-save failed:", error);
        }
      }
    };

    const debounceTimer = setTimeout(saveData, 1000);
    return () => clearTimeout(debounceTimer);
  }, [data, endpoint]);
};

// Location detection hook
const useLocationDetection = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = async () => {
    setLoading(true);
    try {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use a free geocoding service to get city name
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
              );
              const data = await response.json();
              setLocation({
                city: data.city || data.locality || "Unknown",
                country: data.countryName || "Unknown",
                detected: true,
              });
            } catch (error) {
              console.error("Geocoding failed:", error);
              setLocation({
                city: "Unknown",
                country: "Unknown",
                detected: false,
              });
            }
            setLoading(false);
          },
          (error) => {
            console.error("Geolocation failed:", error);
            setLocation({ city: "", country: "", detected: false });
            setLoading(false);
          }
        );
      } else {
        setLocation({ city: "", country: "", detected: false });
        setLoading(false);
      }
    } catch (error) {
      console.error("Location detection failed:", error);
      setLocation({ city: "", country: "", detected: false });
      setLoading(false);
    }
  };

  return { location, loading, detectLocation };
};

// Main Enhanced Onboarding Flow
export function ExclusiveOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    locality: "",
    bio: "",
    interests: [],
    dietaryRestrictions: [],
    occupation: "",
    education: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    personalityScores: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { addToWaitlist } = useWaitlist();

  const totalSteps = 8; // Member check, Phone, Country, City, Binary, Personality, Result, Identity, Details, Account, Complete

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const [compatibilityScore, setCompatibilityScore] = useState(null);

  const handleNext = (score) => {
    if (typeof score === "number") {
      setCompatibilityScore(score);
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.email || !formData.password) {
        toast.error("Email and password are required");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Create account with Supabase
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        city: formData.city,
        locality: formData.locality,
        bio: formData.bio,
        interests: formData.interests,
        dietary_restrictions: formData.dietaryRestrictions,
        occupation: formData.occupation,
        education: formData.education,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        personality_scores: formData.personalityScores,
      };

      const result = await signUp(formData.email, formData.password, userData);

      if (result.success && result.data?.user) {
        // Success - navigate to dashboard
        toast.success("Account created successfully! Welcome to Bichance!");
        onComplete(formData);
      } else {
        // Handle signup error
        toast.error(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepComponent = () => {
    console.log("Current step:", currentStep);
    switch (currentStep) {
      case 1:
        return (
          <PhoneVerificationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <CountrySelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <CityLocalitySelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <PersonalityQuestionsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StrangerPossibilityResultStep
            formData={formData}
            score={compatibilityScore}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <IdentityQuestionsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 7:
        return (
          <UserDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 8:
        return (
          <CompletionStep
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Progress Bar */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <div className="bg-black/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-black"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-black text-sm mt-2">
          <span>Step {currentStep}</span>
          <span>{totalSteps} Steps</span>
        </div>
      </div>

      <AnimatePresence mode="wait">{getStepComponent()}</AnimatePresence>
    </div>
  );
}

// Step 1: Member Check
function MemberCheckStep({ formData, updateFormData, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (isExisting) => {
    setSelectedOption(isExisting);
    updateFormData({ isExistingMember: isExisting });
  };

  const handleContinue = () => {
    if (selectedOption !== null) {
      onNext();
    } else {
      toast.error("Please select an option");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl relative z-10 border border-white/30 min-h-[750px]"
      style={{ backgroundColor: "#FEF7ED" }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          👋
        </motion.div>
        <h2 className="text-3xl font-bold text-black mb-2">
          Welcome to bichance
        </h2>
        {/* <div className="italic text-lg md:text-xl font-serif text-center mb-4">WELCOME <span className="not-italic">TO BICHANCE</span></div> */}
        <p className="text-neutral-900">Are you already a member?</p>
      </div>

      <div className="space-y-4 mb-8">
        <motion.button
          onClick={() => handleOptionSelect(true)}
          className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
            selectedOption === true
              ? "border-purple-400 bg-purple-500/20 text-black"
              : "border-white/20 hover:border-purple-300 hover:bg-white/5 text-neutral-900"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🎭</span>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-black">
                Yes, I'm already a member
              </h3>
              <p className="text-sm text-neutral-900">
                Sign in to your existing account
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => handleOptionSelect(false)}
          className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
            selectedOption === false
              ? "border-purple-400 bg-purple-500/20 text-black"
              : "border-white/20 hover:border-purple-300 hover:bg-white/5 text-neutral-900"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl">✨</span>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-black">
                No, I'm new here
              </h3>
              <p className="text-sm text-neutral-900">
                Join our exclusive dining community
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      <motion.button
        onClick={handleContinue}
        disabled={selectedOption === null}
        className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue →
      </motion.button>
    </motion.div>
  );
}

// Step 2: Phone Verification & Login
function PhoneVerificationStep({ formData, updateFormData, onNext, onBack }) {
  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber || "");
  const [countryCode, setCountryCode] = useState("+65");
  const [checking, setChecking] = useState(false);
  const [userExists, setUserExists] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const dispatch = useDispatch();

  const verifyOtpAndLogin = async (otp) => {
    try {
      const response = await fetch(
        "https://bichance-production-a30f.up.railway.app/api/v1/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ phone: `${countryCode}${phoneNumber}`, otp }),
        }
      );
      const data = await response.json();
      if (response.ok && data.access_token) {
        dispatch(login({ user: data.user, token: data.access_token }));
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("OTP verified! You are now logged in.");
        onNext(); // Continue onboarding
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  const checkPhoneNumber = async () => {
    if (phoneNumber.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setChecking(true);
    const fullNumber = `${countryCode}${phoneNumber}`;
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");

    try {
      // Call journey/save API with mobile number
      const requestBody = {
        question_key: "mobile",
        answer: fullNumber,
        question: "Your mobile number",
      };
      const res = await fetchWithAuth(
        "https://bichance-production-a30f.up.railway.app/api/v1/journey/save",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(
          "Failed to save mobile: " +
            (errorData.detail || errorData.message || "")
        );
      }

      setUserExists(false);
      updateFormData({
        phoneNumber: fullNumber,
        userExists: false,
        canLogin: false,
      });

      toast.success("Phone number verified! Continuing with registration...");
      setTimeout(() => onNext(), 1000);
    } catch (error) {
      console.error("Phone verification error:", error);
      updateFormData({
        phoneNumber: fullNumber,
        userExists: false,
        canLogin: false,
      });
      toast.success("Continuing with registration...");
      setTimeout(() => onNext(), 1000);
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen min-h-screen bg-[#FEF7ED] p-0 border-0 border-black/20 overflow-y-auto"
      style={{ borderRadius: 0, backgroundImage: 'url(/pv.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-6 sm:p-8 max-w-md w-full mx-auto mt-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4 md:mt-12"
          >
            📱
          </motion.div>
          <h2 className="text-3xl font-bold text-black mb-2">
            Your Phone Number
          </h2>
          <div className="italic text-lg md:text-xl font-serif text-center mb-4">
            PHONE <span className="not-italic">VERIFICATION</span>
          </div>
          <p className="text-neutral-900">
            {formData.isExistingMember
              ? "We'll check if you're already in our system"
              : "We'll verify you're a new member"}
          </p>
        </div>

        <div className="mb-8 w-full max-w-md mx-auto text-center md:mt-10">
          <label className="block text-black font-medium mb-4">
            Phone Number
          </label>

          <div className="flex flex-row space-x-3 mb-4 w-full justify-center items-center">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm w-1/3"
            >
              {Object.entries(COUNTRY_CODES).map(([country, code]) => (
                <option
                  key={country}
                  value={code}
                  className="bg-gray-800 text-black"
                >
                  {code} ({country})
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="87654321"
              className="bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm w-1/2"
            />
          </div>

          <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg mb-4 w-55">
            <p className="text-blue-900 text-sm">
              📱 Full number:{" "}
              <strong>
                {countryCode}
                {phoneNumber}
              </strong>
            </p>
          </div>

          {userExists !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                userExists
                  ? "bg-green-500/20 border-green-400/30"
                  : "bg-blue-500/20 border-blue-400/30"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  userExists ? "text-green-900" : "text-blue-900"
                }`}
              >
                {userExists
                  ? `✅ Account found! Status: ${userStatus}`
                  : "✨ New member - welcome to bichance!"}
              </p>
            </motion.div>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-2 mt-4 px-2 sm:px-0">
          <div className="w-full max-w-[260px] sm:max-w-md mx-auto">
            <SlideToSendOTP
              onSlide={checkPhoneNumber}
              loading={checking}
              disabled={phoneNumber.length < 8 || checking}
              countdown={0}
              label="Verify Number"
            />
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="mx-auto mt-3 flex items-center justify-center w-28 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white shadow hover:from-red-600 hover:to-red-800 transition-colors text-xs font-semibold"
            aria-label="Go to Home"
          >
            Go to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Step 3: Country Selection
function CountrySelectionStep({ formData, updateFormData, onNext, onBack }) {
  const [selectedCountry, setSelectedCountry] = useState(
    formData.selectedCountry || ""
  );
  const [availableCountries, setAvailableCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://bichance-production-a30f.up.railway.app/api/v1/geo/countries",
      {
        headers: { accept: "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAvailableCountries(data.data.countries || []);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setError("Failed to load countries");
        setLoading(false);
      });
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    updateFormData({
      selectedCountry: country,
      selectedCity: "", // Reset city when country changes
      selectedLocality: "", // Reset locality when country changes
    });
    // Save to journey
    saveJourneyField(
      "current_country",
      country,
      "Where would you like to have your dinners?"
    );
    onNext(); // Immediately go to next step
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen min-h-screen bg-[#FEF7ED] shadow-none p-0 border-0 border-black/20 overflow-y-auto"
      style={{ borderRadius: 0 }}
    >
      {/* Back Arrow */}
      <button
        onClick={onBack}
        className="absolute left-6 top-4 text-black hover:text-gray-700 text-2xl font-bold focus:outline-none"
        aria-label="Back"
      >
        <span className="fi fi-rs-arrow-alt-circle-left"></span>
      </button>
      <div className="not-italic font-bold text-2xl md:text-3xl text-black text-center mb-2 mt-8">
        Location
      </div>
      <div className="italic text-lg md:text-xl font-serif text-center mb-4">
        WHERE WOULD YOU LIKE TO<br />
        <span className="not-italic">HAVE <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent font-bold">YOUR DINNERS</span>?</span>
      </div>
      <div className="text-center text-gray-700 mb-6">
        You can change it later
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading countries...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="w-full flex md:justify-end md:items-start">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-xl justify-center mx-auto">
            {availableCountries.map((country) => (
              <button
                key={country}
                onClick={() => handleCountrySelect(country)}
                className={`rounded-xl p-2 max-w-[150px] w-full h-16 border-2 flex flex-col items-center justify-center shadow-md text-center transition-all
                  ${
                    selectedCountry === country
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105 font-extrabold"
                      : "bg-white border-gray-300 hover:border-red-400 hover:bg-gray-50 font-semibold"
                  }
                `}
                style={{ transition: "all 0.2s" }}
              >
                <span className="w-full flex items-center justify-center text-center whitespace-normal break-words overflow-hidden max-h-full px-1">{country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Step 4: City and Locality Selection
function CityLocalitySelectionStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}) {
  const [selectedCity, setSelectedCity] = useState(formData.selectedCity || "");
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const selectedCountry = formData.selectedCountry;

  useEffect(() => {
    if (selectedCountry) {
      setLoading(true);
      fetch(
        "https://bichance-production-a30f.up.railway.app/api/v1/geo/country",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: selectedCountry }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailableCities(
            (data.data.cities || []).map((city) => ({
              name: city,
              localities: [],
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load cities");
          setLoading(false);
        });
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    updateFormData({
      selectedCity: cityName,
      selectedLocality: "",
      isLocationSupported: true, // Cities in our data are supported
    });
    // Save to journey
    saveJourneyField("current_city", cityName, "Select city");
    onNext(); // Immediately go to next step
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen min-h-screen bg-[#FEF7ED] shadow-none p-0 border-0 border-black/20 overflow-y-auto"
      style={{ borderRadius: 0 }}
    >
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-black hover:text-gray-700 text-2xl font-bold focus:outline-none"
        aria-label="Back"
      >
        <span className="fi fi-rs-arrow-alt-circle-left"></span>
      </button>
      <div className="font-bold text-2xl md:text-3xl text-black text-center mb-2">
        Location
      </div>
      <div className="italic text-lg md:text-xl font-serif text-center mb-4">
        SELECT <span className="not-italic">CITY</span>
      </div>
      <div className="text-center text-gray-700 mb-6">
        You can change it later
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading cities...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="w-full flex md:justify-end md:items-start">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-xl justify-center mx-auto">
            {availableCities.map((city) => (
              <motion.button
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
                className={`rounded-xl p-2 max-w-[150px] w-full h-16 border-2 flex flex-col items-center justify-center shadow-md text-center transition-all
                  ${
                    selectedCity === city.name
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105 font-extrabold"
                      : "bg-white border-gray-300 hover:border-red-400 hover:bg-gray-50 font-semibold"
                  }
                `}
                style={{ transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)" }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="w-full flex items-center justify-center text-center whitespace-normal break-words overflow-hidden max-h-full px-1">
                  {city.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
function UserDetailsStep({ formData, updateFormData, onNext, onBack }) {
  const [details, setDetails] = useState(
    formData.userDetails || {
      firstName: "",
      lastName: "",
    }
  );

  const handleDetailsChange = (field, value) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    updateFormData({ userDetails: newDetails });
  };

  const handleContinue = async () => {
    if (details.firstName && details.lastName) {
      // Save name to journey API
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("token");
      if (token) {
        try {
          const requestBody = {
            question_key: "name",
            answer: `${details.firstName} ${details.lastName}`.trim(),
            question: "Your full name",
          };
          await fetchWithAuth(
            "https://bichance-production-a30f.up.railway.app/api/v1/journey/save",
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            }
          );
        } catch (err) {
          toast.error("Failed to save name");
        }
      }
      onNext();
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen min-h-screen bg-[#FEF7ED] shadow-none p-0 border-0 border-black/20 overflow-y-auto"
      style={{ borderRadius: 0 }}
    >
      {/* Back Arrow */}
      <button
        onClick={onBack}
        className="absolute left-6 top-6 text-black hover:text-gray-700 text-2xl font-bold focus:outline-none"
        aria-label="Back"
      >
        <span className="fi fi-rs-arrow-alt-circle-left"></span>
      </button>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <h2 className="text-3xl font-bold text-black mb-2">Almost Done!</h2>
        <div className="italic text-lg md:text-xl font-serif text-center mb-4">
          FINAL <span className="not-italic">DETAILS</span>
        </div>
        <p className="text-neutral-900">Just a few final details</p>
      </div>

      <div className="space-y-6 mb-8 flex flex-col items-center">
        <div className="flex flex-row gap-4 w-full justify-center">
          <div className="w-full max-w-xs" style={{ maxWidth: '140px' }}>
            <label className="block text-black font-medium mb-2 text-center">
              First Name *
            </label>
            <input
              type="text"
              value={details.firstName}
              onChange={(e) => handleDetailsChange("firstName", e.target.value)}
              className="w-full bg-white/10 border-2 border-gray-400 rounded-xl px-3 py-2 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-500 focus:border-gray-600 backdrop-blur-sm mx-auto"
            />
          </div>
          <div className="w-full max-w-xs" style={{ maxWidth: '140px' }}>
            <label className="block text-black font-medium mb-2 text-center">
              Last Name *
            </label>
            <input
              type="text"
              value={details.lastName}
              onChange={(e) => handleDetailsChange("lastName", e.target.value)}
              className="w-full bg-white/10 border-2 border-gray-400 rounded-xl px-3 py-2 text-black placeholder-black/50 focus:ring-2 focus:ring-purple-500 focus:border-gray-600 backdrop-blur-sm mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={handleContinue}
          disabled={!details.firstName || !details.lastName}
          className="w-40 mx-auto bg-gradient-to-r from-red-500 to-red-700 hover:from-black hover:to-gray-800 text-white py-3 px-4 rounded-full font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-center text-base"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Complete Registration →
        </motion.button>
      </div>
    </motion.div>
  );
}

// Step 6: Completion
// Account Creation Step (Step 7)
const AccountCreationStep = ({ formData, updateFormData, onNext, onBack }) => {
  const { email: authEmail } = useSelector((state) => state.auth.user || {});
  const [email, setEmail] = useState(formData.email || "");
  const [password, setPassword] = useState(formData.password || "");
  const [confirmPassword, setConfirmPassword] = useState(
    formData.confirmPassword || ""
  );
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Get email from all possible sources
  const getBestEmail = () => {
    if (formData.email) return formData.email;
    if (formData.userDetails && formData.userDetails.email)
      return formData.userDetails.email;
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.email) return parsed.email;
      } catch (e) {}
    }
    if (authEmail) return authEmail;
    return "";
  };

  useEffect(() => {
    const bestEmail = getBestEmail();
    if (bestEmail && !email) {
      setEmail(bestEmail);
      updateFormData({ email: bestEmail });
    }
  }, [formData.email, formData.userDetails, authEmail]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleContinue = () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    updateFormData({ email, password, confirmPassword });
    onNext();
  };

  return (
    <motion.div
      key="account-creation"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="bg-[#FEF7ED] sm:bg-white/95 backdrop-blur-lg p-0 sm:p-8 w-full sm:max-w-2xl relative z-10 border-0 sm:border border-white/30 text-center"
      style={{ borderRadius: 0 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">
          Create Your Account
        </h2>
        <div className="italic text-lg md:text-xl font-serif text-center mb-4">
          ACCOUNT <span className="not-italic">CREATION</span>
        </div>
        <p className="text-neutral-900">
          Set up your login credentials to complete registration
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <div className="text-left">
          <label className="block text-black font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className={`w-full p-4 rounded-lg border-2 bg-white/10 backdrop-blur-sm text-black placeholder-black/50 focus:outline-none transition-colors ${
              emailError
                ? "border-red-400"
                : "border-white/20 focus:border-purple-400"
            }`}
          />
          {emailError && (
            <p className="text-red-400 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="text-left">
          <label className="block text-black font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            className={`w-full p-4 rounded-lg border-2 bg-white/10 backdrop-blur-sm text-black placeholder-black/50 focus:outline-none transition-colors ${
              passwordError
                ? "border-red-400"
                : "border-white/20 focus:border-purple-400"
            }`}
          />
          <p className="text-black/60 text-xs mt-1">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="text-left">
          <label className="block text-black font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className={`w-full p-4 rounded-lg border-2 bg-white/10 backdrop-blur-sm text-black placeholder-black/50 focus:outline-none transition-colors ${
              passwordError
                ? "border-red-400"
                : "border-white/20 focus:border-purple-400"
            }`}
          />
          {passwordError && (
            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <motion.button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-lg border border-white/30 text-black hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={handleContinue}
          className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-black hover:to-gray-800 text-white font-semibold hover:from-red-600 hover:to-red-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Account
        </motion.button>
      </div>
    </motion.div>
  );
};

// Completion Step (Step 8) - Show success message and finish
const CompletionStep = ({ formData, onNext, onBack }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 w-screen h-screen min-h-screen flex items-center justify-center bg-[#FEF7ED]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-[#FEF7ED] rounded-3xl p-8 w-full max-w-2xl relative z-10 border border-white/30 flex flex-col items-center justify-center"
        style={{ borderRadius: 0 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        <h1 className="text-4xl font-bold text-black mb-4 sm:text-center text-left pl-6">
          Registration Complete!
        </h1>

        <p className="text-xl text-black/70 mb-8 text-center">
          {formData.isLocationSupported
            ? "Welcome to the bichance community! We'll review your application and get back to you within 24-48 hours."
            : "Thanks for your interest! We'll notify you as soon as we launch in your city."}
        </p>

        <motion.button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-black hover:to-gray-800 text-white px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          Finish
        </motion.button>
      </motion.div>
    </div>
  );
};

// Registration Success Screen
export function ExclusiveRegistrationSuccess({ profileData }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0F0F23 0%, #1A1B3A 50%, #2D2E5F 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl relative z-10 border border-white/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🎭
        </motion.div>

        <h1 className="text-4xl font-bold text-black mb-4">
          Application Under Review
        </h1>

        <p className="text-xl text-black/70 mb-8">
          Thank you for joining bichance! Our team will review your profile and
          get back to you.
        </p>

        <div className="bg-gradient-to-r from-red-500/20 to-red-500/20 rounded-2xl p-6 border border-red-400/30">
          <h3 className="text-lg font-semibold text-red-200 mb-3">
            🔍 What's Next?
          </h3>

          <div className="text-left space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-red-400 mt-1">1.</span>
              <div>
                <p className="text-black font-medium">Review Process</p>
                <p className="text-black/70 text-sm">
                  Our team will carefully review your application
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-red-400 mt-1">2.</span>
              <div>
                <p className="text-black font-medium">Phone Verification</p>
                <p className="text-black/70 text-sm">
                  We'll send a WhatsApp message to verify your number
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-red-400 mt-1">3.</span>
              <div>
                <p className="text-black font-medium">Decision</p>
                <p className="text-black/70 text-sm">
                  You'll hear back from us within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Admin Panel (keeping existing functionality)
export function EnhancedAdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE_URL}/admin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(Array.isArray(data) ? data : []);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      setRestaurants([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    else if (activeTab === "restaurants") fetchRestaurants();
    else if (activeTab === "bookings") fetchBookings();
  }, [activeTab]);

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "users", name: "Users", icon: "👥" },
    { id: "restaurants", name: "Restaurants", icon: "🍽️" },
    { id: "bookings", name: "Bookings", icon: "📅" },
    { id: "matching", name: "Matching", icon: "🧠" },
    { id: "reports", name: "Reports", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                bichance Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Administrator</span>
              <motion.button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  localStorage.removeItem("admin_token");
                  window.location.reload();
                }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardData &&
                [
                  {
                    title: "Total Users",
                    value: dashboardData.total_users,
                    icon: "👥",
                    color: "bg-blue-500",
                  },
                  {
                    title: "Active Users",
                    value: dashboardData.active_users,
                    icon: "🟢",
                    color: "bg-green-500",
                  },
                  {
                    title: "Total Bookings",
                    value: dashboardData.total_bookings,
                    icon: "📅",
                    color: "bg-purple-500",
                  },
                  {
                    title: "Revenue",
                    value: `$${dashboardData.revenue_this_period.toLocaleString()}`,
                    icon: "💰",
                    color: "bg-yellow-500",
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    className="bg-white rounded-lg shadow p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <div className={`${metric.color} rounded-lg p-3 mr-4`}>
                        <span className="text-white text-2xl">
                          {metric.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {dashboardData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Revenue by Package
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(dashboardData.revenue_by_package).map(
                      ([package_type, revenue]) => (
                        <div
                          key={package_type}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize">{package_type}</span>
                          <span className="font-semibold">
                            ${revenue.toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Retention Rate</span>
                      <span className="font-semibold">
                        {dashboardData.user_retention_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancellation Rate</span>
                      <span className="font-semibold">
                        {dashboardData.cancellation_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-semibold">
                        {dashboardData.customer_satisfaction}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {users.length} total users found
                </p>
              </div>

              {users.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-lg mb-2">👥</div>
                  <p className="text-gray-500">No users found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Users will appear here once they register
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Registration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Spending
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.user_id || user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.registration_date
                              ? new Date(
                                  user.registration_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.total_bookings || 0} bookings
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.completed_dinners || 0} completed
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(user.total_spent || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-purple-600 hover:text-purple-900 text-sm">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Other tabs content */}
        {activeTab !== "dashboard" && activeTab !== "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow p-8 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">
              {tabs.find((t) => t.id === activeTab)?.name} Panel
            </h3>
            <p className="text-gray-600">
              This section is under development. Full functionality coming soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Export AdminPanel component
export { default as AdminPanel } from "./components/AdminPanel";

// Add PersonalityQuestionsStep (1-10 scale, 15 questions)
function PersonalityQuestionsStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(formData.personalityAnswers || {});
  const [isLoading, setIsLoading] = useState(false);
  const isLastQuestion =
    currentQuestionIndex === ONBOARDING_QUESTIONS.length - 1;
  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex];
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("token");

  // Debug token
  useEffect(() => {
    console.log("Current token:", token);
    console.log(
      "localStorage access_token:",
      localStorage.getItem("access_token")
    );
    console.log("localStorage auth_token:", localStorage.getItem("auth_token"));
    console.log("sessionStorage token:", sessionStorage.getItem("token"));
  }, [token]);

  // Debug current question
  useEffect(() => {
    console.log("Current question:", currentQuestion);
    console.log("Current question index:", currentQuestionIndex);
  }, [currentQuestion, currentQuestionIndex]);

  // Helper to send answer to journey/save API
  const saveJourneyAnswer = async (questionIdx, answer, questionText) => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");
    if (!token) {
      alert("Please log in again.");
      // Optionally: window.location.href = "/auth";
      return;
    }
    // Convert answer to "yes"/"no"
    const answerText = answer === 1 ? "yes" : "no";
    try {
      const requestBody = {
        question_key: `q${questionIdx - 1}`,
        answer: answerText, // Use "yes" or "no"
        question: questionText,
      };
      // Additional validation - questionIdx is 1-indexed, we need 0-indexed
      const zeroBasedIndex = questionIdx - 1;
      if (zeroBasedIndex < 0 || zeroBasedIndex > 14) {
        console.error(
          "Invalid question index:",
          zeroBasedIndex,
          "from questionIdx:",
          questionIdx
        );
        throw new Error("Invalid question index");
      }
      // Special debug for first question
      if (questionIdx === 1) {
        console.log("First question debug:", {
          questionIdx,
          questionKey: `q${questionIdx - 1}`,
          answer: answer.toString(),
          questionText,
          requestBody,
        });
      }
      console.log("Sending journey save request:", requestBody);
      const res = await fetchWithAuth(
        "https://bichance-production-a30f.up.railway.app/api/v1/journey/save",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      handleLogoutOn401(res.status);
      // Log the actual response for debugging
      const responseText = await res.text();
      console.log("API Response:", res.status, responseText);
      if (!res.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { detail: responseText };
        }
        console.error("Journey save failed:", res.status, errorData);
        console.error("Request that failed:", requestBody);
        throw new Error(
          `Failed to save answer: ${res.status} ${
            errorData.detail || errorData.message || ""
          }`
        );
      }
      console.log("Journey answer saved successfully");
    } catch (err) {
      console.error("Journey save error:", err);
      toast.error("Failed to save answer: " + err.message);
    }
  };

  const handleSelect = async (value) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    updateFormData({ personalityAnswers: newAnswers });

    console.log(`Saving answer for question ${currentQuestionIndex + 1}:`, {
      questionId: currentQuestion.id,
      questionKey: `q${currentQuestion.id - 1}`, // Use question.id (1-indexed) to get correct 0-indexed key
      answer: value,
      question: currentQuestion.question,
      isFirstQuestion: currentQuestionIndex === 0,
    });

    // Save answer to API - use currentQuestion.id (1-indexed) instead of currentQuestionIndex (0-indexed)
    await saveJourneyAnswer(
      currentQuestion.id,
      value,
      currentQuestion.question
    );
    setTimeout(() => {
      if (isLastQuestion) {
        // Do nothing here, wait for button click
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 400);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  // Calculate compatibility score from personality scores
  const calculateCompatibilityScore = (scores) => {
    // Always return a score between 91 and 100 for demo
    return Math.floor(Math.random() * 10) + 91;
  };

  const handleSubmitJourney = async () => {
    setIsLoading(true);
    if (!token) {
      console.error("No authentication token found");
      toast.error("Authentication required. Please log in again.");
      setIsLoading(false);
      return;
    }

    // Check if all questions are answered
    const answeredQuestions = Object.keys(answers).length;
    const totalQuestions = ONBOARDING_QUESTIONS.length;

    console.log(
      "Answered questions:",
      answeredQuestions,
      "of",
      totalQuestions
    );
    if (answeredQuestions < totalQuestions) {
      toast.error("Please answer all questions");
      setIsLoading(false);
      return;
    }

    // Submit journey
    try {
      await saveJourneyAnswer(
        currentQuestion.id,
        answers[currentQuestion.id],
        currentQuestion.question
      );
      onNext();
    } catch (err) {
      toast.error("Failed to submit journey: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen min-h-screen bg-[#FEF7ED] shadow-none p-0 border-0 border-black/20 overflow-y-auto"
      style={{ borderRadius: 0 }}
    >
      <div className="w-full pt-8 pb-2 bg-[#FEF7ED] sticky top-0 z-40">
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-4 text-black hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Back"
        >
          <span className="fi fi-rs-arrow-alt-circle-left"></span>
        </button>
        <div className="italic text-lg md:text-xl font-serif w-full text-center mt-2 mb-1">
          PERSONALITY <span className="not-italic">QUESTIONS</span>
        </div>
        <div className="w-full text-center text-gray-700 mb-2">
          Answer honestly to help us match you better
        </div>
      </div>
      {/* Progress bar above the question */}
      <div className="w-full mb-4">
        <div className="bg-black/10 rounded-full h-2 overflow-hidden max-w-xs mx-auto w-full">
          <div
            style={{
              width: `${((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100}%`,
            }}
            className="h-full bg-black transition-all duration-300"
          />
        </div>
        <div className="flex justify-between text-black text-xs mt-1 max-w-xs mx-auto w-full">
          <span>Q {currentQuestionIndex + 1}</span>
          <span>{ONBOARDING_QUESTIONS.length} Questions</span>
        </div>
      </div>
      <h2
        className="font-bold text-2xl md:text-3xl text-black text-center mt-0 mb-1 tracking-wide break-words px-4 w-full max-w-[90vw] md:max-w-xl mx-auto"
        style={{
          fontFamily: "AmstelvarAlpha, sans-serif",
          fontStyle: "normal",
        }}
      >
        {currentQuestion.question}? 
      </h2>
      {isLastQuestion ? (
        <>
          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mb-8 mt-4">
            <button
              onClick={() => handleSelect(1)}
              className={`w-full py-6 rounded-2xl border-2 text-xl font-bold shadow transition-all text-center
                ${
                  answers[currentQuestion.id] === 1
                    ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105"
                    : "bg-white border-gray-300 hover:border-red-400 hover:bg-red-50"
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleSelect(0)}
              className={`w-full py-6 rounded-2xl border-2 text-xl font-bold shadow transition-all text-center
                ${
                  answers[currentQuestion.id] === 0
                    ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105"
                    : "bg-white border-gray-300 hover:border-red-400 hover:bg-red-50"
                }`}
            >
              No
            </button>
          </div>
          <button
            onClick={handleSubmitJourney}
            className="mx-auto mt-2 flex items-center justify-center w-56 py-3 rounded-full border-2 font-bold shadow bg-gradient-to-r from-red-500 to-red-700 hover:from-black hover:to-gray-800 text-white border-red-600 scale-105 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minWidth: '140px', maxWidth: '220px' }}
            disabled={answers[currentQuestion.id] === undefined || isLoading}
          >
            {isLoading ? (
              <span className="text-lg">Submitting...</span>
            ) : (
              <span className="text-lg font-bold">Submit Journey</span>
            )}
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mb-8 mt-4">
          <button
            onClick={() => handleSelect(1)}
            className={`w-full py-6 rounded-2xl border-2 text-xl font-bold shadow transition-all text-center
              ${
                answers[currentQuestion.id] === 1
                  ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105"
                  : "bg-white border-gray-300 hover:border-red-400 hover:bg-red-50"
              }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleSelect(0)}
            className={`w-full py-6 rounded-2xl border-2 text-xl font-bold shadow transition-all text-center
              ${
                answers[currentQuestion.id] === 0
                  ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105"
                  : "bg-white border-gray-300 hover:border-red-400 hover:bg-red-50"
              }`}
          >
            No
          </button>
        </div>
      )}
      {/* Place this at the very end of the motion.div, after all question content */}
      <div className="w-full flex justify-center bg-[#FEF7ED] mt-24 pb-4">
        <img src="/QA.png" alt="Dinner conversation illustration" className="w-full max-w-md rounded-xl" />
      </div>
    </motion.div>
  );
}

// Add IdentityQuestionsStep (div-based)
function IdentityQuestionsStep({ formData, updateFormData, onNext, onBack }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(formData.identityAnswers || {});
  const [dobError, setDobError] = useState("");
  const questions = IDENTITY_QUESTIONS;
  const isLast = current === questions.length - 1;
  const currentQ = questions[current];

  // Helper to call /api/v1/users/me after last question
  const fetchUserMe = async () => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");
    if (!token) {
      alert("Please log in again.");
      // Optionally: window.location.href = "/auth";
      return;
    }
    try {
      const res = await fetchWithAuth(
        "https://bichance-production-a30f.up.railway.app/api/v1/users/me",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleLogoutOn401(res.status);
      if (res.ok) {
        const userData = await res.json();
        console.log("Fetched user data after identity questions:", userData);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch user data:", res.status, errorData);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleSelect = (option) => {
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);
    updateFormData({ identityAnswers: newAnswers });
    // Save to journey
    saveJourneyField(currentQ.id, option, currentQ.question);
    setTimeout(() => {
      if (isLast) {
        fetchUserMe();
        onNext();
      } else {
        setDobError("");
        setCurrent(current + 1);
      }
    }, 400);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    updateFormData({ identityAnswers: newAnswers });
    // Age validation
    if (currentQ.id === "dob") {
      const today = new Date();
      const dob = new Date(value);
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const day = today.getDate() - dob.getDate();
      let is18 = age > 18 || (age === 18 && (m > 0 || (m === 0 && day >= 0)));
      if (!is18) {
        setDobError("Your age should be at least 18 years");
      } else {
        setDobError("");
      }
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      onBack();
    }
  };
  const handleSubmitIdentity = async () => {
    // Save all answers in one go
    for (const q of questions) {
      await saveJourneyField(q.id, answers[q.id], q.question);
    }
    await fetchUserMe();
    onNext();
  };
  // Step/progress bar for identity questions
  const progress = ((current + 1) / questions.length) * 100;

  const isDobInvalid = currentQ.id === "dob" && dobError;
  const isSubmitDisabled = !answers[currentQ.id] || isDobInvalid;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center w-screen h-screen min-h-screen bg-[#FEF7ED] shadow-none p-0 pt-4 border-0 border-black/20 overflow-y-auto"
      style={{ borderRadius: 0 }}
    >
      <button
        onClick={handlePrevious}
        className="absolute left-16 top-4 text-black text-3xl font-extrabold focus:outline-none z-20 hover:scale-110 transition-transform"
        aria-label="Back"
      >
        <span className="fi fi-rs-arrow-alt-circle-left"></span>
      </button>
      <div className="italic text-lg md:text-xl font-serif text-center mb-4 mt-2">
        IDENTITY <span className="not-italic">QUESTIONS</span>
      </div>
      <div className="w-full mb-6 flex items-center justify-center gap-2">
        <span className="text-black text-xs font-semibold" style={{ minWidth: 32 }}>Q {current + 1}</span>
        <div
          className="rounded-full h-2 overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '300px',
            background: '#FEF7ED',
            ...(window.innerWidth < 640
              ? { width: '70%', maxWidth: '120px', background: '#FEF7ED' }
              : {}),
          }}
        >
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-black transition-all duration-300"
          />
        </div>
        <span className="text-black text-xs font-semibold" style={{ minWidth: 60, textAlign: 'right' }}>{questions.length} Steps</span>
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-black mb-6 mt-2 text-center w-full">
        {currentQ.question}
      </h2>
      <div className="relative w-full max-w-md flex-1" style={{ minHeight: '220px' }}>
        <div
          className="flex flex-col gap-4 w-full h-full mb-8"
          style={{
            backgroundImage: 'url(/id2.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            backgroundSize: 'contain',
            minHeight: window.innerWidth >= 768 ? '400px' : '320px',
            paddingBottom: window.innerWidth >= 768 ? '180px' : '120px',
            opacity: 1,
          }}
        >
          {currentQ.options ? (
            currentQ.options.map((opt) => (
              <motion.button
                key={opt}
                onClick={() => {
                  if (isLast) {
                    // Only select, do not auto-advance
                    const newAnswers = { ...answers, [currentQ.id]: opt };
                    setAnswers(newAnswers);
                    updateFormData({ identityAnswers: newAnswers });
                  } else {
                    setDobError("");
                    handleSelect(opt);
                  }
                }}
                className={`w-2/3 max-w-xs mx-auto py-4 rounded-lg border-2 text-base font-semibold shadow transition-all text-center ${
                  answers[currentQ.id] === opt
                    ? "bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 scale-105 font-extrabold"
                    : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                }`}
                style={{ transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)" }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-bold text-base tracking-wide">
                  {opt}
                </span>
              </motion.button>
            ))
          ) : (
            <>
              <input
                type="date"
                className="w-full py-4 px-4 rounded-xl border-2 text-xl font-semibold shadow transition-all text-center border-gray-300 hover:border-red-400 focus:border-red-600 focus:outline-none"
                value={answers[currentQ.id] || ""}
                onChange={handleDateChange}
                placeholder="YYYY-MM-DD"
                max={new Date().toISOString().split("T")[0]}
              />
              {isDobInvalid && (
                <div className="text-red-600 text-center font-bold mt-2">
                  {dobError}
                </div>
              )}
            </>
          )}
          {isLast && (
            <button
              onClick={handleSubmitIdentity}
              className="mx-auto mt-2 flex items-center justify-center w-56 py-3 rounded-full border-2 font-bold shadow bg-gradient-to-r from-red-500 to-red-700 hover:from-black hover:to-gray-800 text-white border-red-600 scale-105 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minWidth: '140px', maxWidth: '220px' }}
              disabled={isSubmitDisabled}
            >
              <span className="text-lg font-bold">Submit Identity</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Add StrangerPossibilityResultStep (score/result container, orange background, no progress bar)
function StrangerPossibilityResultStep({ formData, score, onNext, onBack }) {
  // Always animate to a random score between 91 and 100
  const [displayScore] = React.useState(() => Math.floor(Math.random() * 10) + 91);
  const [animatedScore, setAnimatedScore] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const frameRate = 30; // ms
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    const increment = displayScore / totalFrames;
    const interval = setInterval(() => {
      frame++;
      const next = Math.round(
        Math.min(displayScore, start + increment * frame)
      );
      setAnimatedScore(next);
      if (next >= displayScore || frame >= totalFrames) {
        setAnimatedScore(displayScore);
        clearInterval(interval);
      }
    }, frameRate);
    return () => clearInterval(interval);
  }, [displayScore]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center w-full min-h-0 bg-[#FF5A36] shadow-none p-0 pt-4 sm:relative sm:inset-auto sm:z-10 sm:px-12 sm:py-16 sm:max-w-2xl sm:min-h-screen sm:shadow-none border-0 sm:border border-black/20 mx-auto overflow-y-auto h-screen min-h-screen"
      style={{ borderRadius: 0 }}
    >
      {/* Back Arrow at top left of parent container */}
      <button
        onClick={onBack}
        className="absolute left-6 top-6 text-black text-4xl font-extrabold focus:outline-none z-30 hover:scale-110 transition-transform"
        aria-label="Back"
      >
        <span className="fi fi-rs-arrow-alt-circle-left"></span>
      </button>
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className="bg-white rounded-2xl px-10 py-12 max-w-md w-full flex flex-col items-center shadow-xl">
          <div className="flex items-center justify-center mb-2 w-full mt-2">
            <span className="text-6xl md:text-7xl font-extrabold text-black tracking-tight">
              {animatedScore}%
            </span>
          </div>
          <div className="text-center text-black text-lg font-bold mt-2">
            The possibility (based on your personality) of meeting new strangers
            at our dinners
          </div>
        </div>
      </div>
      <div className="w-full max-w-md px-4 pb-8">
        <button
          onClick={onNext}
          className="w-full max-w-md bg-black text-white rounded-full py-4 px-12 text-lg font-bold mt-8 shadow-lg hover:bg-gray-900 transition-all ml-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Helper to save country, city, and identity fields via journey API
const saveJourneyField = async (question_key, answer, questionText) => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("token");
  if (!token) {
    alert("Please log in again.");
    // Optionally: window.location.href = "/auth";
    return;
  }
  try {
    const requestBody = {
      question_key,
      answer: answer?.toString?.() ?? "",
      question: questionText,
    };
    const res = await fetchWithAuth(
      "https://bichance-production-a30f.up.railway.app/api/v1/journey/save",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Journey save failed:", res.status, errorData);
      toast.error(
        "Failed to save: " +
          (errorData.detail || errorData.message || question_key)
      );
    }
  } catch (err) {
    console.error("Journey save error:", err);
    toast.error("Failed to save: " + question_key);
  }
};

// Utility to handle logout on 401
function handleLogoutOn401(status) {
  if (status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    alert("Session expired. Please log in again.");
    window.location.href = "/auth";
  }
}

function SlideToSendOTP({ onSlide, loading, disabled, countdown, label }) {
  const [slide, setSlide] = React.useState(0);
  const [sliding, setSliding] = React.useState(false);
  const sliderRef = useRef(null);
  React.useEffect(() => {
    if (!loading && countdown === 0) setSlide(0);
  }, [loading, countdown]);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const handleMouseDown = (e) => {
    if (disabled) return;
    if (isDesktop) {
      setSlide(100);
      setTimeout(() => {
        onSlide({ preventDefault: () => {} });
        setSlide(0);
      }, 250);
    } else {
      setSliding(true);
    }
  };
  const handleMouseUp = (e) => {
    if (!sliding) return;
    setSliding(false);
    if (slide > 80) {
      onSlide({ preventDefault: () => {} });
    } else {
      setSlide(0);
    }
  };
  const handleMouseMove = (e) => {
    if (!sliding) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSlide(percent);
  };
  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-12 bg-black rounded-full overflow-hidden select-none mt-2 shadow-lg ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSliding(false)}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseMove}
      style={{ userSelect: 'none' }}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-200"
        style={{ width: `${slide}%` }}
      />
      <div
        className="absolute top-0 left-0 h-full flex items-center justify-center w-full z-10 pointer-events-none overflow-visible"
      >
        {loading ? (
          <span className="text-white font-semibold text-sm whitespace-nowrap">{label === 'Verify OTP' ? 'Verifying...' : 'Sending OTP...'}</span>
        ) : countdown > 0 ? (
          <span className="text-white font-semibold text-sm whitespace-nowrap">Wait {countdown}s</span>
        ) : slide > 80 ? (
          <span className="text-white font-semibold text-sm whitespace-nowrap">Release to {label}</span>
        ) : (
          <span className="text-white font-semibold text-sm tracking-wider whitespace-nowrap">SWIPE TO {label.toUpperCase()}</span>
        )}
      </div>
      <div
        className="absolute top-1 left-1 h-10 w-10 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow flex items-center justify-center z-20 transition-transform duration-200"
        style={{ transform: `translateX(${slide * (sliderRef.current ? sliderRef.current.offsetWidth - 48 : 0) / 100}px)` }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}
