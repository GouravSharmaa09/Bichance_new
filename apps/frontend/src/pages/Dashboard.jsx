import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBell,
  faCalendar,
  faUser,
  faChevronRight,
  faQuestionCircle,
  faArrowLeft,
  faTrash,
  faSignOutAlt,
  faEdit,
  faInfoCircle,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faUtensils,
  faStar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://bichance-production-a30f.up.railway.app";

// Admin login API function
export async function adminLogin(email, password) {
  const response = await fetch(
    "https://bichance-production-a30f.up.railway.app/api/v1/admin/login",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
}

// Logout API function
async function logoutApi(token) {
  const response = await fetch(
    "https://bichance-production-a30f.up.railway.app/api/v1/auth/logout",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: "",
    }
  );
  if (!response.ok) {
    throw new Error("Logout failed");
  }
  return response.json();
}

// Opt-in Dinner API function
async function optInDinner(dinnerId, budgetCategory, dietaryCategory, token) {
  console.log("Opt-in request data:", {
    dinner_id: dinnerId,
    budget_category: budgetCategory,
    dietary_category: dietaryCategory,
  });

  const response = await fetch(
    "https://bichance-production-a30f.up.railway.app/api/v1/dinner/opt-in",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        dinner_id: dinnerId,
        budget_category: budgetCategory || "medium",
        dietary_category: dietaryCategory || "vegetarian",
      }),
    }
  );
  
  console.log("Opt-in response status:", response.status);
  
  if (!response.ok) {
    let msg = "Failed to opt-in for dinner";
    try {
      const data = await response.json();
      console.log("Opt-in API response:", data);
      
      // Check if user is already opted in (this is not an error)
      if (data.detail === "Already opted in") {
        console.log("User already opted in - treating as success");
        return { success: true, message: "Already opted in" };
      }
      
      if (data.detail) msg = data.detail;
      if (data.message) msg = data.message;
    } catch (e) {
      console.log("Opt-in API error (no JSON):", e);
    }
    throw new Error(msg);
  }
  return response.json();
}

// Fetch upcoming dinners from backend
function useUpcomingDinners(token, userCity, userCountry) {
  const [dinners, setDinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDinners() {
      try {
        console.log("Fetching upcoming dinners...");
        console.log("API URL:", `${API_BASE_URL}/api/v1/dinner/upcoming`);
        console.log("Token:", token ? "Present" : "Missing");
        console.log("User location:", { city: userCity, country: userCountry });
        
        // Try the correct endpoint first
        let response;
        const endpoints = [
          '/api/v1/dinner/upcoming'  // This is the correct endpoint
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            response = await fetchWithAuth(
              `${API_BASE_URL}${endpoint}`,
              {
                method: "GET",
                headers: {
                  accept: "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
              }
            );
            
            if (response.ok) {
              console.log(`Success with endpoint: ${endpoint}`);
              break;
            } else {
              console.log(`Failed with endpoint: ${endpoint}, status: ${response.status}`);
            }
          } catch (err) {
            console.log(`Error with endpoint: ${endpoint}:`, err.message);
          }
        }
        
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Upcoming dinners response:", data);
          const dinnersData = data.data || data || [];
          setDinners(dinnersData);
          console.log("Set dinners:", dinnersData);
          
          if (dinnersData.length === 0) {
            console.log("No dinners found. This might be because:");
            console.log("- No dinners scheduled in user's current city/country");
            console.log("- User's location is not set properly");
            console.log("- All dinners are in the past");
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch dinners. Status:", response.status, "Error:", errorText);
          setError(`Failed to fetch dinners: ${response.status} - ${errorText}`);
          
          // Add mock data for development/testing
          console.log("Adding mock data for development");
          setDinners([
            {
              id: 1,
              restaurant_name: "Sample Restaurant",
              date: "2024-01-15",
              time: "7:00 PM",
              max_participants: 8,
              cuisine_type: "Italian"
            },
            {
              id: 2,
              restaurant_name: "Test Bistro",
              date: "2024-01-20",
              time: "8:00 PM",
              max_participants: 6,
              cuisine_type: "French"
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching dinners:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    // Only fetch dinners if we have location data
    if (userCity && userCountry) {
      fetchDinners();
    } else {
      console.log("Skipping dinner fetch - no location data available");
      setLoading(false);
    }
  }, [token, userCity, userCountry]);

  return { dinners, loading, error };
}

async function fetchUserProfile(token) {
  console.log("Fetching user profile...");
  console.log("API URL:", `${API_BASE_URL}/api/v1/users/me`);
  console.log("Token present:", !!token);
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/v1/users/me`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    
    console.log("User profile response status:", response.status);
    console.log("User profile response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("User profile error:", response.status, errorText);
      
      if (response.status === 401) {
        throw new Error("unauthorized");
      }
      throw new Error(`Failed to fetch profile: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("User profile data:", data);
    return data;
  } catch (error) {
    console.error("User profile fetch error:", error);
    throw error;
  }
}

async function fetchMyBookings(token) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/v1/dinner/my-bookings`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return response.json();
}



// Update the opted-in dinners API endpoint
async function fetchOptedInDinners(token) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/v1/dinner/my-bookings`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch opted-in dinners");
  }
  return response.json();
}

// Field to question key mapping - using API's expected question_key values
const FIELD_TO_QUESTION_KEY = {
  name: "name",
  email: "email", // Note: email might not be supported by journey/save API
  mobile: "mobile",
  gender: "gender",
  relationship_status: "relationship_status",
  children: "children",
  profession: "profession",
  dob: "dob",
  city: "current_city", // Changed from "city" to "current_city"
  country: "current_country", // Changed from "country" to "current_country"
  state: "state", // Note: state might not be supported
};

async function saveJourneyField(token, key, value, questionText) {
  try {
    console.log(`Saving field: ${key} = ${value} with question: ${questionText}`);
    
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/v1/journey/save`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question_key: key,
          answer: value,
          question: questionText || key,
        }),
      }
    );
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to save field ${key}: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`Successfully saved field ${key}:`, result);
    return result;
  } catch (error) {
    console.error(`Error saving field ${key}:`, error);
    throw error;
  }
}

export default function Dashboard() {
  const token = localStorage.getItem("access_token");
  const [activeTab, setActiveTab] = useState("home");
  const [step, setStep] = useState("dinner");
  const [selectedDate, setSelectedDate] = useState(null);
  const [mealPref, setMealPref] = useState("");
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: "User",
    email: "user@email.com",
    mobile: "",
    gender: "",
    relationship_status: "",
    children: "",
    profession: "",
    dob: "",
    city: "",
    country: "",
  });
  
  const helpSteps = [
    { title: "Getting Started", content: "Welcome to Bichance! This guide will help you understand the basics of using our platform. Navigate through the sections below to find what you need." },
    { title: "Profile Management", content: "Learn how to update your personal information, set preferences, and manage your profile visibility." },
    { title: "Booking Dinners", content: "Discover how to browse available dinners, opt-in for events, and confirm your reservations." },
    { title: "Managing Matches", content: "Understand how to view your dinner matches, connect with other participants, and manage your connections." },
    { title: "Subscription & Payments", content: "Information on managing your subscription, payment methods, and billing details." },
    { title: "Troubleshooting", content: "Common issues and their solutions. If you can't find your answer here, please contact support." },
    { title: "Contact Support", content: "How to reach our support team for further assistance. We're here to help!" }
  ];

  const guideSteps = [
    { title: "Step 1: Create Your Profile", content: "Start by creating a detailed profile. The more information you provide, the better matches you'll get!" },
    { title: "Step 2: Explore Dinners", content: "Browse through a variety of dinner events. You can filter by cuisine, budget, and location." },
    { title: "Step 3: Opt-in for a Dinner", content: "Found a dinner you like? Opt-in to join. Make sure your meal preferences are set!" },
    { title: "Step 4: Confirm Your Presence", content: "Once you're matched, confirm your presence. This helps us ensure a smooth experience for everyone." },
    { title: "Step 5: Connect with Matches", content: "After the dinner, you can connect with people you met. Build new friendships and networks!" }
  ];
  
  const userCity = profile.current_city || profile.city || "";
  const userCountry = profile.current_country || profile.country || "";
  
  const {
    dinners,
    loading: dinnersLoading,
    error: dinnersError,
  } = useUpcomingDinners(token, userCity, userCountry);
  const [editProfile, setEditProfile] = useState(profile);
  const [isOptingIn, setIsOptingIn] = useState(false);
  const [optingInDinnerId, setOptingInDinnerId] = useState(null);
  const [showMealPreference, setShowMealPreference] = useState(false);
  const [selectedDinnerForBooking, setSelectedDinnerForBooking] = useState(null);
  const [selectedMealPreference, setSelectedMealPreference] = useState('');
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [showBookingReceipt, setShowBookingReceipt] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState(null);
  const [userBookedDinners, setUserBookedDinners] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  
  // Function to convert 24-hour time to 12-hour format
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return '';
    try {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return time24; // Return original if formatting fails
    }
  };

  // Function to format ISO date to readable format
  const formatDateFromISO = (isoDate) => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return isoDate; // Return original if formatting fails
    }
  };

  // Function to extract time from ISO date
  const extractTimeFromISO = (isoDate) => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch (error) {
      return isoDate; // Return original if formatting fails
    }
  };
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isEditingPersonality, setIsEditingPersonality] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [optedInDinners, setOptedInDinners] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [locationInput, setLocationInput] = useState({
    city: profile.city || profile.current_city || "",
    country: profile.country || profile.current_country || "",
  });
  const [locationImg, setLocationImg] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const redirectTimeoutRef = useRef(null);
  const [showActions, setShowActions] = useState(false);
  const [confirmedDinners, setConfirmedDinners] = useState([]);
  const [pendingDinners, setPendingDinners] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedDinnerForManage, setSelectedDinnerForManage] = useState(null);
  const [isManagingDinner, setIsManagingDinner] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpStep, setHelpStep] = useState(1);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideStep, setGuideStep] = useState(1);

  // Reset booking flow when switching away from Home
  React.useEffect(() => {
    if (activeTab !== "home") {
      setStep("dinner");
      setSelectedDate(null);
      setMealPref("");
      setSelectedMembership(null);
      setCardDetails({ number: "", expiry: "", cvv: "", name: "" });
      setIsProcessing(false);
    }
  }, [activeTab]);

  // Fetch user's booked dinners when component mounts
  React.useEffect(() => {
    if (token) {
      fetchUserBookedDinners();
    }
  }, [token]);

  // Handle clicking outside notification dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Back button handler for booking steps
  const handleBack = () => {
    switch (step) {
      case "meal":
        setStep("dinner");
        break;
      case "membership":
        setStep("meal");
        break;
      case "payment":
        setStep("membership");
        break;
      case "success":
        setStep("dinner");
        setSelectedDate(null);
        setMealPref("");
        setSelectedMembership(null);
        setCardDetails({ number: "", expiry: "", cvv: "", name: "" });
        setIsProcessing(false);
        break;
      default:
        break;
    }
  };

    // Update handleProfileSave to send each field as a journey/save POST
  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      console.log("Starting profile save...");
      console.log("Current profile:", profile);
      console.log("Edit profile:", editProfile);
      
      const updates = [];
      const successfulUpdates = [];
      
      // Question text mapping for each field
      const questionTexts = {
        name: "What is your name?",
        mobile: "What is your mobile number?",
        gender: "What is your gender?",
        relationship_status: "What is your relationship status?",
        children: "Do you have children?",
        profession: "What is your profession?",
        dob: "What is your date of birth?",
        current_city: "What city do you live in?",
        current_country: "What country do you live in?",
      };
      
      // Only send supported fields that have changed
      for (const [field, key] of Object.entries(FIELD_TO_QUESTION_KEY)) {
        // Skip email and state as they might not be supported by journey/save API
        if (field === 'email' || field === 'state') {
          continue;
        }
        
        if (
          editProfile[field] !== undefined &&
          editProfile[field] !== profile[field] &&
          editProfile[field] !== ""
        ) {
          try {
            const result = await saveJourneyField(token, key, editProfile[field], questionTexts[key]);
            successfulUpdates.push(field);
            console.log(`Successfully saved ${field}:`, result);
          } catch (error) {
            console.error(`Failed to save ${field}:`, error);
            // Continue with other fields even if one fails
          }
        }
      }
      
      // Personality answers
      if (
        editProfile.personality_answers &&
        Array.isArray(editProfile.personality_answers)
      ) {
        editProfile.personality_answers.forEach(async (ans, idx) => {
          if (
            !profile.personality_answers ||
            profile.personality_answers[idx]?.answer !== ans.answer
          ) {
            try {
              const result = await saveJourneyField(token, `q${idx}`, ans.answer, ans.question);
              successfulUpdates.push(`personality_${idx}`);
              console.log(`Successfully saved personality question ${idx}:`, result);
            } catch (error) {
              console.error(`Failed to save personality question ${idx}:`, error);
            }
          }
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`Successfully updated ${successfulUpdates.length} field(s)!`);
        setProfile(editProfile);
      } else {
        toast.info("No changes to save");
      }
      
      setShowEditProfile(false);
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error("Failed to update profile: " + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteSuccess(true);
    setTimeout(() => {
      setShowDelete(false);
      setDeleteSuccess(false);
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }, 1500);
  };

  // Handle personality answer changes
  const handlePersonalityAnswerChange = (index, newAnswer) => {
    setEditProfile(prev => ({
      ...prev,
      personality_answers: prev.personality_answers.map((answer, i) => 
        i === index ? { ...answer, answer: newAnswer } : answer
      )
    }));
  };

  // Handle personality save
  const handlePersonalitySave = async () => {
    setProfileLoading(true);
    try {
      const successfulUpdates = [];
      
      // Save each changed personality answer
      for (let i = 0; i < editProfile.personality_answers.length; i++) {
        const newAnswer = editProfile.personality_answers[i];
        const oldAnswer = profile.personality_answers[i];
        
        if (newAnswer.answer !== oldAnswer.answer) {
          try {
            await saveJourneyField(token, `q${i}`, newAnswer.answer, newAnswer.question);
            successfulUpdates.push(`q${i}`);
            console.log(`Successfully saved personality question ${i}:`, newAnswer);
          } catch (error) {
            console.error(`Failed to save personality question ${i}:`, error);
          }
        }
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`Successfully updated ${successfulUpdates.length} personality question(s)!`);
        setProfile(editProfile);
        setIsEditingPersonality(false);
      } else {
        toast.info("No personality changes to save");
      }
    } catch (err) {
      console.error("Personality save error:", err);
      toast.error("Failed to update personality: " + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle location save
  const handleLocationSave = async () => {
    setProfileLoading(true);
    try {
      const successfulUpdates = [];
      
      // Save country if changed
      if (locationInput.country !== profile.current_country && locationInput.country !== profile.country) {
        try {
          await saveJourneyField(token, "current_country", locationInput.country, "What country do you live in?");
          successfulUpdates.push("country");
          console.log("Successfully saved country:", locationInput.country);
        } catch (error) {
          console.error("Failed to save country:", error);
        }
      }
      
      // Save city if changed
      if (locationInput.city !== profile.current_city && locationInput.city !== profile.city) {
        try {
          await saveJourneyField(token, "current_city", locationInput.city, "What city do you live in?");
          successfulUpdates.push("city");
          console.log("Successfully saved city:", locationInput.city);
        } catch (error) {
          console.error("Failed to save city:", error);
        }
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`Successfully updated location!`);
        // Update profile with new location data
        setProfile(prev => ({
          ...prev,
          current_country: locationInput.country,
          current_city: locationInput.city,
          country: locationInput.country,
          city: locationInput.city
        }));
        setEditProfile(prev => ({
          ...prev,
          current_country: locationInput.country,
          current_city: locationInput.city,
          country: locationInput.country,
          city: locationInput.city
        }));
        setShowLocationModal(false);
      } else {
        toast.info("No location changes to save");
      }
    } catch (err) {
      console.error("Location save error:", err);
      toast.error("Failed to update location: " + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch profile and check subscription status on mount
  useEffect(() => {
    async function fetchProfileAndSubscription() {
      setProfileLoading(true);
      setProfileError("");
      try {
        // Test API connectivity first
        console.log("Testing API connectivity...");
        console.log("API_BASE_URL:", API_BASE_URL);
        console.log("Token:", token ? "Present" : "Missing");
        
        const response = await fetchUserProfile(token);
        console.log("Profile response from /api/v1/users/me:", response);
        
        // Extract the actual user data from the response
        const userData = response.data || response;
        console.log("User data:", userData);
        console.log("User data fields available:", Object.keys(userData));
        console.log("Location data:", {
          current_city: userData.current_city,
          current_country: userData.current_country,
          city: userData.city,
          country: userData.country
        });
        
        setProfile(userData);
        setEditProfile(userData);
        
        if (userData && userData.subscription_status === "active") {
          setHasActiveSubscription(true);
        } else {
          setHasActiveSubscription(false);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.message === "unauthorized") {
          toast.error("Session expired. Please sign in again.");
          localStorage.clear();
          sessionStorage.clear();
          dispatch(logout());
          navigate("/signin");
          return;
        }
        setProfileError(err.message);
      } finally {
        setProfileLoading(false);
      }
    }
    
    // Only fetch if we have a token
    if (token) {
      fetchProfileAndSubscription();
    }
  }, [token, dispatch, navigate]);

  // Fetch bookings on mount
  useEffect(() => {
    async function fetchBookings() {
      setBookingsLoading(true);
      setBookingsError("");
      try {
        const data = await fetchMyBookings(token);
        setBookings(data.data || []);
      } catch (err) {
        setBookingsError(err.message);
      } finally {
        setBookingsLoading(false);
      }
    }
    fetchBookings();
  }, [token]);

  // Fetch opted-in dinners on mount
  useEffect(() => {
    async function fetchOptedIn() {
      try {
        const data = await fetchOptedInDinners(token);
        console.log("Opted-in dinners data:", data);
        setOptedInDinners(data.data || data || []);
      } catch (err) {
        console.error("Failed to fetch opted-in dinners:", err);
        // Set empty array to avoid errors
        setOptedInDinners([]);
      }
    }
    fetchOptedIn();
  }, [token]);

  // Update locationInput when profile changes
  useEffect(() => {
    const currentCity = profile.current_city || profile.city || "";
    const currentCountry = profile.current_country || profile.country || "";
    
    console.log("Profile location update:", { currentCity, currentCountry });
    
    setLocationInput({
      city: currentCity,
      country: currentCountry,
    });
    
    // Update location image when profile changes
    if (currentCity) {
      setLocationImg(getCityImage(currentCity));
    }
    
    // Cache profile data in localStorage to prevent loss on reload
    if (profile.name) {
      localStorage.setItem('cached_profile', JSON.stringify(profile));
    }
  }, [profile.current_city, profile.current_country, profile.city, profile.country, profile.name]);
  
  // Load cached profile data on mount to prevent empty state on reload
  useEffect(() => {
    const cachedProfile = localStorage.getItem('cached_profile');
    if (cachedProfile && !profile.name) {
      try {
        const parsedProfile = JSON.parse(cachedProfile);
        console.log("Loading cached profile:", parsedProfile);
        setProfile(parsedProfile);
        setEditProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing cached profile:", error);
        localStorage.removeItem('cached_profile');
      }
    }
  }, []);

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  function getCityImage(city) {
    if (!city) return "/default-city.jpg";
    
    const cityImages = {
      "Mumbai": "/mumbai.jpg",
      "Delhi": "/delhi.jpg",
      "Bangalore": "/bangalore.jpg",
      "Hyderabad": "/hyderabad.jpg",
      "Chennai": "/chennai.jpg",
      "Kolkata": "/kolkata.jpg",
      "Pune": "/pune.jpg",
      "Ahmedabad": "/ahmedabad.jpg",
      "Jaipur": "/jaipur.jpg",
      "Surat": "/surat.jpg",
      "New Delhi": "/delhi.jpg",
      "Bengaluru": "/bangalore.jpg",
      "Kolkata": "/kolkata.jpg",
      "Chennai": "/chennai.jpg",
      "Pune": "/pune.jpg",
      "Ahmedabad": "/ahmedabad.jpg",
      "Jaipur": "/jaipur.jpg",
      "Surat": "/surat.jpg",
      "Lucknow": "/default-city.jpg",
      "Kanpur": "/default-city.jpg",
      "Nagpur": "/default-city.jpg",
      "Indore": "/default-city.jpg",
      "Thane": "/mumbai.jpg",
      "Bhopal": "/default-city.jpg",
      "Visakhapatnam": "/default-city.jpg",
      "Pimpri-Chinchwad": "/pune.jpg",
      "Patna": "/default-city.jpg",
      "Vadodara": "/ahmedabad.jpg",
      "Ghaziabad": "/delhi.jpg",
      "Ludhiana": "/default-city.jpg",
      "Agra": "/default-city.jpg",
      "Nashik": "/default-city.jpg",
      "Faridabad": "/delhi.jpg",
      "Meerut": "/delhi.jpg",
      "Rajkot": "/ahmedabad.jpg",
      "Kalyan-Dombivli": "/mumbai.jpg",
      "Vasai-Virar": "/mumbai.jpg",
      "Varanasi": "/default-city.jpg",
      "Srinagar": "/default-city.jpg",
      "Aurangabad": "/default-city.jpg",
      "Dhanbad": "/default-city.jpg",
      "Amritsar": "/default-city.jpg",
      "Allahabad": "/default-city.jpg",
      "Ranchi": "/default-city.jpg",
      "Howrah": "/kolkata.jpg",
      "Coimbatore": "/chennai.jpg",
      "Jabalpur": "/default-city.jpg",
      "Gwalior": "/default-city.jpg",
      "Vijayawada": "/default-city.jpg",
      "Jodhpur": "/jaipur.jpg",
      "Madurai": "/chennai.jpg",
      "Raipur": "/default-city.jpg",
      "Kota": "/jaipur.jpg",
      "Guwahati": "/default-city.jpg",
      "Chandigarh": "/default-city.jpg",
      "Solapur": "/pune.jpg",
      "Hubli-Dharwad": "/bangalore.jpg",
      "Mysore": "/bangalore.jpg",
      "Tiruchirappalli": "/chennai.jpg",
      "Bareilly": "/default-city.jpg",
      "Aligarh": "/default-city.jpg",
      "Moradabad": "/default-city.jpg",
      "Bhubaneswar": "/default-city.jpg",
      "Salem": "/chennai.jpg",
      "Warangal": "/hyderabad.jpg",
      "Guntur": "/default-city.jpg",
      "Bhiwandi": "/mumbai.jpg",
      "Saharanpur": "/delhi.jpg",
      "Gorakhpur": "/default-city.jpg",
      "Bikaner": "/jaipur.jpg",
      "Amravati": "/default-city.jpg",
      "Noida": "/delhi.jpg",
      "Jamshedpur": "/default-city.jpg",
      "Bhilai": "/default-city.jpg",
      "Cuttack": "/default-city.jpg",
      "Firozabad": "/delhi.jpg",
      "Kochi": "/default-city.jpg",
      "Nellore": "/default-city.jpg",
      "Bhavnagar": "/ahmedabad.jpg",
      "Dehradun": "/default-city.jpg",
      "Durgapur": "/kolkata.jpg",
      "Asansol": "/kolkata.jpg",
      "Rourkela": "/default-city.jpg",
      "Nanded": "/pune.jpg",
      "Kolhapur": "/pune.jpg",
      "Ajmer": "/jaipur.jpg",
      "Akola": "/default-city.jpg",
      "Gulbarga": "/bangalore.jpg",
      "Jamnagar": "/ahmedabad.jpg",
      "Ujjain": "/default-city.jpg",
      "Loni": "/delhi.jpg",
      "Siliguri": "/kolkata.jpg",
      "Jhansi": "/default-city.jpg",
      "Ulhasnagar": "/mumbai.jpg",
      "Jammu": "/default-city.jpg",
      "Sangli-Miraj": "/pune.jpg",
      "Mangalore": "/bangalore.jpg",
      "Erode": "/chennai.jpg",
      "Belgaum": "/bangalore.jpg",
      "Ambattur": "/chennai.jpg",
      "Tirunelveli": "/chennai.jpg",
      "Malegaon": "/pune.jpg",
      "Gaya": "/default-city.jpg",
      "Jalgaon": "/pune.jpg",
      "Udaipur": "/jaipur.jpg",
      "Maheshtala": "/kolkata.jpg",
      "Tirupur": "/chennai.jpg",
      "Davanagere": "/bangalore.jpg",
      "Kozhikode": "/default-city.jpg",
      "Akbarpur": "/delhi.jpg",
      "Kurnool": "/hyderabad.jpg",
      "Bokaro": "/default-city.jpg",
      "Rajpur": "/default-city.jpg",
      "Bellary": "/bangalore.jpg",
      "Patiala": "/default-city.jpg",
      "Gopalpur": "/default-city.jpg",
      "Agartala": "/default-city.jpg",
      "Bhagalpur": "/default-city.jpg",
      "Muzaffarnagar": "/delhi.jpg",
      "Bhatpara": "/kolkata.jpg",
      "Panihati": "/kolkata.jpg",
      "Latur": "/pune.jpg",
      "Dhule": "/pune.jpg",
      "Rohtak": "/delhi.jpg",
      "Korba": "/default-city.jpg",
      "Bhilwara": "/jaipur.jpg",
      "Berhampur": "/default-city.jpg",
      "Muzaffarpur": "/default-city.jpg",
      "Ahmednagar": "/pune.jpg",
      "Mathura": "/default-city.jpg",
      "Kollam": "/default-city.jpg",
      "Avadi": "/chennai.jpg",
      "Kadapa": "/hyderabad.jpg",
      "Kamarhati": "/kolkata.jpg",
      "Bilaspur": "/default-city.jpg",
      "Shahjahanpur": "/delhi.jpg",
      "Satara": "/pune.jpg",
      "Bijapur": "/bangalore.jpg",
      "Rampur": "/delhi.jpg",
      "Shivamogga": "/bangalore.jpg",
      "Chandrapur": "/pune.jpg",
      "Junagadh": "/ahmedabad.jpg",
      "Thrissur": "/default-city.jpg",
      "Alwar": "/jaipur.jpg",
      "Bardhaman": "/kolkata.jpg",
      "Kulti": "/kolkata.jpg",
      "Kakinada": "/default-city.jpg",
      "Nizamabad": "/hyderabad.jpg",
      "Parbhani": "/pune.jpg",
      "Tumkur": "/bangalore.jpg",
      "Hisar": "/delhi.jpg",
      "Ozhukarai": "/chennai.jpg",
      "Bihar Sharif": "/default-city.jpg",
      "Panipat": "/delhi.jpg",
      "Darbhanga": "/default-city.jpg",
      "Bally": "/kolkata.jpg",
      "Aizawl": "/default-city.jpg",
      "Dewas": "/default-city.jpg",
      "Ichalkaranji": "/pune.jpg",
      "Karnal": "/delhi.jpg",
      "Bathinda": "/default-city.jpg",
      "Jalna": "/pune.jpg",
      "Barasat": "/kolkata.jpg",
      "Kirari Suleman Nagar": "/delhi.jpg",
      "Purnia": "/default-city.jpg",
      "Satna": "/default-city.jpg",
      "Mau": "/default-city.jpg",
      "Sonipat": "/delhi.jpg",
      "Farrukhabad": "/delhi.jpg",
      "Sagar": "/default-city.jpg",
      "Rourkela": "/default-city.jpg",
      "Durg": "/default-city.jpg",
      "Ratlam": "/default-city.jpg",
      "Hapur": "/delhi.jpg",
      "Arrah": "/default-city.jpg",
      "Anantapur": "/hyderabad.jpg",
      "Karimnagar": "/hyderabad.jpg",
      "Etawah": "/delhi.jpg",
      "Ambernath": "/mumbai.jpg",
      "North Dumdum": "/kolkata.jpg",
      "Bharatpur": "/jaipur.jpg",
      "Begusarai": "/default-city.jpg",
      "New Delhi": "/delhi.jpg",
      "Gandhidham": "/ahmedabad.jpg",
      "Baranagar": "/kolkata.jpg",
      "Tiruvottiyur": "/chennai.jpg",
      "Puducherry": "/chennai.jpg",
      "Sikar": "/jaipur.jpg",
      "Thoothukkudi": "/chennai.jpg",
      "Rewa": "/default-city.jpg",
      "Mirzapur": "/default-city.jpg",
      "Raichur": "/bangalore.jpg",
      "Pali": "/jaipur.jpg",
      "Ramagundam": "/hyderabad.jpg",
      "Haridwar": "/default-city.jpg",
      "Vijayanagaram": "/default-city.jpg",
      "Katihar": "/default-city.jpg",
      "Nagercoil": "/chennai.jpg",
      "Sri Ganganagar": "/jaipur.jpg",
      "Karawal Nagar": "/delhi.jpg",
      "Mango": "/kolkata.jpg",
      "Thanjavur": "/chennai.jpg",
      "Bulandshahr": "/delhi.jpg",
      "Uluberia": "/kolkata.jpg",
      "Murwara": "/default-city.jpg",
      "Sambalpur": "/default-city.jpg",
      "Singrauli": "/default-city.jpg",
      "Nadiad": "/ahmedabad.jpg",
      "Secunderabad": "/hyderabad.jpg",
      "Naihati": "/kolkata.jpg",
      "Yamunanagar": "/delhi.jpg",
      "Bidhan Nagar": "/kolkata.jpg",
      "Pallavaram": "/chennai.jpg",
      "Bidar": "/bangalore.jpg",
      "Munger": "/default-city.jpg",
      "Panchkula": "/delhi.jpg",
      "Burhanpur": "/default-city.jpg",
      "Raurkela Industrial Township": "/default-city.jpg",
      "Kharagpur": "/kolkata.jpg",
      "Dindigul": "/chennai.jpg",
      "Gandhinagar": "/ahmedabad.jpg",
      "Hospet": "/bangalore.jpg",
      "Nangloi Jat": "/delhi.jpg",
      "Malda": "/kolkata.jpg",
      "Ongole": "/default-city.jpg",
      "Deoghar": "/default-city.jpg",
      "Chapra": "/default-city.jpg",
      "Haldia": "/kolkata.jpg",
      "Khandwa": "/default-city.jpg",
      "Nandyal": "/hyderabad.jpg",
      "Morena": "/default-city.jpg",
      "Amroha": "/delhi.jpg",
      "Anand": "/ahmedabad.jpg",
      "Bhind": "/default-city.jpg",
      "Bhalswa Jahangir Pur": "/delhi.jpg",
      "Madhyamgram": "/kolkata.jpg",
      "Bhiwani": "/delhi.jpg",
      "Berhampore": "/kolkata.jpg",
      "Ambala": "/delhi.jpg",
      "Mori": "/default-city.jpg",
      "Fatehpur": "/delhi.jpg",
      "Raebareli": "/default-city.jpg",
      "Khora": "/delhi.jpg",
      "Chittoor": "/hyderabad.jpg",
      "Bhusawal": "/pune.jpg",
      "Orai": "/delhi.jpg",
      "Bahraich": "/default-city.jpg",
      "Phusro": "/default-city.jpg",
      "Vellore": "/chennai.jpg",
      "Mehsana": "/ahmedabad.jpg",
      "Raipur": "/default-city.jpg",
      "Deoli": "/delhi.jpg",
      "Delhi": "/delhi.jpg",
      "Mumbai": "/mumbai.jpg",
      "Bangalore": "/bangalore.jpg",
      "Chennai": "/chennai.jpg",
      "Kolkata": "/kolkata.jpg",
      "Pune": "/pune.jpg",
      "Ahmedabad": "/ahmedabad.jpg",
      "Jaipur": "/jaipur.jpg",
      "Surat": "/surat.jpg",
      "Hyderabad": "/hyderabad.jpg",
    };
    
    // Try exact match first
    if (cityImages[city]) {
      return cityImages[city];
    }
    
    // Try case-insensitive match
    const cityLower = city.toLowerCase();
    for (const [cityName, imagePath] of Object.entries(cityImages)) {
      if (cityName.toLowerCase() === cityLower) {
        return imagePath;
      }
    }
    
    return "/default-city.jpg";
  }

  const handleLogout = async () => {
    try {
      await logoutApi(token);
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      sessionStorage.clear();
      dispatch(logout());
      navigate("/");
    }
  };

  const handleGoToLandingPage = () => {
    // Open landing page in new tab without logging out
    window.open("/", "_blank");
  };

  // Handle opt-in for dinner


  const handleOptIn = async (dinnerId, budgetCategory, dietaryCategory) => {
    // Check if user has active subscription
    if (!hasActiveSubscription) {
      // Navigate to subscription step page with dinner details
      navigate('/subscription-step', { 
        state: { 
          dinnerId, 
          budgetCategory, 
          dietaryCategory 
        } 
      });
      return;
    }

    // If user has subscription, show meal preference step
    setSelectedDinnerForBooking({ id: dinnerId, budgetCategory, dietaryCategory });
    setShowMealPreference(true);
  };

  const handleMealPreferenceSelect = (preference) => {
    setSelectedMealPreference(preference);
    setShowConfirmBooking(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDinnerForBooking || !selectedMealPreference) {
      toast.error("Please select meal preference");
      return;
    }

    setIsOptingIn(true);
    setOptingInDinnerId(selectedDinnerForBooking.id);
    
    try {
      console.log("Confirming booking with:", {
        dinnerId: selectedDinnerForBooking.id,
        budgetCategory: selectedDinnerForBooking.budgetCategory,
        dietaryCategory: selectedMealPreference
      });

      const result = await optInDinner(
        selectedDinnerForBooking.id, 
        selectedDinnerForBooking.budgetCategory, 
        mapMealPreferenceToAPI(selectedMealPreference), 
        token
      );
      
      // Handle both success cases
      if (result.message === "Already opted in") {
        toast.success("You're already booked for this dinner!");
      } else {
        toast.success("Dinner booked successfully!");
      }
      
      // Refresh user's booked dinners
      await fetchUserBookedDinners();
      
      // Show booking receipt
      const receipt = {
        dinnerId: selectedDinnerForBooking.id,
        mealPreference: selectedMealPreference,
        budgetCategory: selectedDinnerForBooking.budgetCategory,
        bookingTime: new Date().toLocaleString(),
        status: result.message === "Already opted in" ? "Already Booked" : "Booked Successfully"
      };
      setBookingReceipt(receipt);
      setShowBookingReceipt(true);
      
      // Reset booking states
      setShowMealPreference(false);
      setShowConfirmBooking(false);
      setSelectedDinnerForBooking(null);
      setSelectedMealPreference('');
      
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message);
    } finally {
      setIsOptingIn(false);
      setOptingInDinnerId(null);
    }
  };

  // Map meal preference to API format
  const mapMealPreferenceToAPI = (preference) => {
    const mapping = {
      'vegetarian': 'vegetarian',
      'non-vegetarian': 'non_vegetarian',
      'vegan': 'vegan',
      'no-preference': 'no_preference'
    };
    return mapping[preference] || 'vegetarian';
  };

  // Fetch user's booked dinners
  const fetchUserBookedDinners = async () => {
    try {
      // First get the dinner IDs from user-view API
      const userViewResponse = await fetch(
        `${API_BASE_URL}/api/v1/dinner/dinners/user-view`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (userViewResponse.ok) {
        const userViewData = await userViewResponse.json();
        console.log("User booked dinner IDs:", userViewData);
        const bookedDinners = userViewData.data || userViewData || [];
        
        // Get upcoming dinners to get restaurant details and other info
        const upcomingResponse = await fetch(
          `${API_BASE_URL}/api/v1/dinner/upcoming`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          console.log("Upcoming dinners data:", upcomingData);
          const upcomingDinners = upcomingData.data || upcomingData || [];
          
          // Combine user-view data with upcoming dinner details
          const enrichedBookings = bookedDinners.map(bookedDinner => {
            const upcomingDinner = upcomingDinners.find(upcoming => upcoming.id === bookedDinner.dinner_id);
            return {
              ...bookedDinner,
              restaurant_name: upcomingDinner?.restaurant_name || 'Restaurant Name',
              time: upcomingDinner?.time || '',
              budget_category: upcomingDinner?.budget_category || 'medium',
              dietary_category: upcomingDinner?.dietary_category || 'vegetarian',
              // Use dinner_id as booking_id since that's what we have
              booking_id: bookedDinner.dinner_id
            };
          });
          
          console.log("Enriched user bookings:", enrichedBookings);
          setUserBookedDinners(enrichedBookings);
        } else {
          console.error("Failed to fetch upcoming dinners:", upcomingResponse.status);
          // Fallback to user-view data if upcoming fails
          setUserBookedDinners(bookedDinners);
        }
      } else {
        console.error("Failed to fetch user booked dinners:", userViewResponse.status);
      }
    } catch (error) {
      console.error("Error fetching user booked dinners:", error);
    }
  };

  // Check if user is booked for a specific dinner
  const isUserBookedForDinner = (dinnerId) => {
    return userBookedDinners.some(dinner => dinner.dinner_id === dinnerId);
  };

  // Update handleViewStatus to expand/collapse inline status
  const handleViewStatus = (dinnerId) => {
    setExpandedBookingId(expandedBookingId === dinnerId ? null : dinnerId);
  };

  const handleCancelBooking = () => {
    setShowMealPreference(false);
    setShowConfirmBooking(false);
    setSelectedDinnerForBooking(null);
    setSelectedMealPreference('');
  };

  // Handle dinner management functions
  const handleManageDinner = (dinner) => {
    setSelectedDinnerForManage(dinner);
    setShowManageModal(true);
  };

  const handleConfirmPresence = async () => {
    if (!selectedDinnerForManage) return;
    
    setIsManagingDinner(true);
    try {
      // Add to confirmed dinners
      setConfirmedDinners(prev => [...prev, selectedDinnerForManage.id]);
      // Remove from pending dinners
      setPendingDinners(prev => prev.filter(id => id !== selectedDinnerForManage.id));
      
      // Add notification
      const notification = {
        id: Date.now(),
        type: 'success',
        message: `Confirmed presence for ${selectedDinnerForManage.restaurant_name} on ${formatDateFromISO(selectedDinnerForManage.date)}`,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [notification, ...prev]);
      
      toast.success('Presence confirmed successfully!');
      setShowManageModal(false);
      setSelectedDinnerForManage(null);
    } catch (error) {
      console.error('Error confirming presence:', error);
      toast.error('Failed to confirm presence');
    } finally {
      setIsManagingDinner(false);
    }
  };

  const handleDoLater = async () => {
    if (!selectedDinnerForManage) return;
    
    setIsManagingDinner(true);
    try {
      // Add to pending dinners
      setPendingDinners(prev => [...prev, selectedDinnerForManage.id]);
      
      // Add immediate notification
      const notification = {
        id: Date.now(),
        type: 'warning',
        message: `Reminder: Please confirm your presence for ${selectedDinnerForManage.restaurant_name} on ${formatDateFromISO(selectedDinnerForManage.date)}`,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [notification, ...prev]);
      
      // Add delayed reminder notification (after 2 hours)
      setTimeout(() => {
        const reminderNotification = {
          id: Date.now() + Math.random(),
          type: 'warning',
          message: `⏰ Reminder: Don't forget to confirm your presence for ${selectedDinnerForManage.restaurant_name} on ${formatDateFromISO(selectedDinnerForManage.date)}`,
          timestamp: new Date().toISOString()
        };
        setNotifications(prev => [reminderNotification, ...prev]);
      }, 2 * 60 * 60 * 1000); // 2 hours
      
      toast.success('Reminder set! You\'ll be notified to confirm your presence.');
      setShowManageModal(false);
      setSelectedDinnerForManage(null);
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast.error('Failed to set reminder');
    } finally {
      setIsManagingDinner(false);
    }
  };

  const handleCancelManage = () => {
    setShowManageModal(false);
    setSelectedDinnerForManage(null);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Check if dinner is confirmed
  const isDinnerConfirmed = (dinnerId) => {
    return confirmedDinners.includes(dinnerId);
  };

  // Check if dinner is pending confirmation
  const isDinnerPending = (dinnerId) => {
    return pendingDinners.includes(dinnerId);
  };

  // Check if dinner should be shown in bookings (only confirmed ones)
  const shouldShowInBookings = (dinnerId) => {
    return isDinnerConfirmed(dinnerId);
  };

  // Auto-reminder for pending confirmations
  React.useEffect(() => {
    if (pendingDinners.length > 0) {
      const interval = setInterval(() => {
        // Add reminder notifications for pending dinners
        pendingDinners.forEach(dinnerId => {
          const dinner = dinners.find(d => d.id === dinnerId);
          if (dinner) {
            const notification = {
              id: Date.now() + Math.random(),
              type: 'warning',
              message: `Reminder: Please confirm your presence for ${dinner.restaurant_name} on ${formatDateFromISO(dinner.date)}`,
              timestamp: new Date().toISOString()
            };
            setNotifications(prev => [notification, ...prev]);
          }
        });
      }, 4 * 60 * 60 * 1000); // Every 4 hours

      return () => clearInterval(interval);
    }
  }, [pendingDinners, dinners]);

  if (showSplash) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
            Welcome to Bichance
          </h1>
          <p className="text-purple-100">Connecting people through dinner</p>
        </motion.div>
            </div>
    );
  }

                          return (
    <>
      <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
              <div>
                  <h1 className="text-2xl font-display font-bold text-purple-800 tracking-tight">
                    Bichance
                </h1>
                  <h2 className="text-lg font-heading font-bold text-gray-900">
                    Welcome back, {profile.name || "User"}!
                  </h2>
                <p className="text-sm text-gray-600">
                  {profileLoading ? (
                    "Loading location..."
                    ) : profile.current_city && profile.current_country ? (
                      `${profile.current_city}, ${profile.current_country}`
                    ) : profile.city && profile.country ? (
                      `${profile.city}, ${profile.country}`
                  ) : (
                      "Location not set"
                  )}
                </p>
                            </div>
                      </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm mb-4 sm:mb-6">
          {[
            { id: "home", icon: faHouse, label: "Home" },
            { id: "bookings", icon: faCalendar, label: "Bookings" },
            { id: "matches", icon: faUsers, label: "Matches" },
            { id: "profile", icon: faUser, label: "Profile" },
          ].map((tab) => (
                          <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-xs sm:text-sm" />
              <span className="hidden sm:inline">{tab.label}</span>
                          </button>
                        ))}
                      </div>

        {/* Tab Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Home Tab */}
          {activeTab === "home" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Location Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 relative overflow-hidden shadow-lg min-h-[150px] sm:min-h-[200px]">
                {/* City Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${getCityImage(profile.current_city || profile.city)})` 
                  }}
                ></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl sm:text-2xl text-gray-800" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-heading font-bold text-black">
                          {profile.current_city || profile.city || "Set Your City"}
                        </h2>
                        <p className="text-sm sm:text-base text-black">
                          {profile.current_country || profile.country || "Set Your Country"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLocationModal(true)}
                      className="bg-purple-600 hover:bg-black text-white px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-md text-sm sm:text-base"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Dinners */}
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-gray-900 mb-3 sm:mb-4">
                  Upcoming Dinners
                </h2>
                {dinnersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading dinners...</p>
                  </div>
                ) : dinnersError ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error: {dinnersError}</p>
                    <p className="text-sm text-gray-500 mt-2">Dinners count: {dinners.length}</p>
                  </div>
                ) : dinners.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {dinners.slice(0, 3).map((dinner) => (
                      <div
                        key={dinner.id}
                        className={`border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow ${
                          isUserBookedForDinner(dinner.id) ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                              {dinner.restaurant_name}
                            </h3>
                            <p className="font-semibold text-gray-700 text-xs sm:text-sm">
                              {dinner.date}
                            </p>
                            <p className="font-semibold text-gray-700 text-xs sm:text-sm">
                              {formatTimeTo12Hour(dinner.time) || dinner.time}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
                              <span className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-gray-600">
                                <FontAwesomeIcon icon={faUsers} />
                                <span>{dinner.max_participants} people</span>
                              </span>
                              <span className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-gray-600">
                                <FontAwesomeIcon icon={faUtensils} />
                                <span>{dinner.cuisine_type}</span>
                              </span>
                            </div>
                          </div>
                          {isUserBookedForDinner(dinner.id) ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              {isDinnerConfirmed(dinner.id) ? (
                                <button
                                  disabled
                                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base cursor-not-allowed"
                                >
                                  Confirmed
                                </button>
                              ) : isDinnerPending(dinner.id) ? (
                                <button
                                  onClick={() => handleManageDinner(dinner)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                >
                                  Pending Confirmation
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleManageDinner(dinner)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                >
                                  Manage
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOptIn(dinner.id, "medium", "vegetarian")}
                              disabled={isOptingIn}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                            >
                              {optingInDinnerId === dinner.id && isOptingIn ? "Joining..." : "Join"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming dinners available
                    {userCity && userCountry ? (
                      <p className="text-sm mt-2">
                        No dinners found in {userCity}, {userCountry}
                      </p>
                    ) : (
                      <p className="text-sm mt-2">
                        Please set your location to see available dinners
                      </p>
                    )}
                    <p className="text-sm mt-1">Debug: Loading={dinnersLoading.toString()}, Error={dinnersError || 'None'}, Count={dinners.length}</p>
                    <p className="text-xs mt-1 text-gray-400">
                      API filters dinners by your current location and shows only dinners within 48 hours
                    </p>
                  </div>
                )}
              </div>

              {/* Go to Landing Page Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 mb-4 sm:mb-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center mb-3">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FontAwesomeIcon icon={faHouse} className="text-lg text-purple-600" />
                  </div>
                  <h3 className="text-base font-heading font-bold text-gray-900 mb-1">Explore Our Platform</h3>
                  <p className="text-gray-600 text-xs">Visit the landing page to learn more about our services</p>
                </div>
                <button
                  onClick={handleGoToLandingPage}
                  className="relative w-full px-4 py-3 rounded-full bg-purple-700 text-white font-semibold text-sm overflow-hidden group transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-400 before:to-indigo-400 before:opacity-0 group-hover:before:opacity-100 before:blur-md before:transition-opacity before:duration-500 before:ease-in-out before:z-0 after:content-[''] after:absolute after:inset-0 after:bg-purple-700 after:rounded-full after:z-10 group-hover:after:bg-transparent after:transition-colors after:duration-300"
                >
                  <div className="flex items-center justify-center space-x-2 relative z-20">
                    <FontAwesomeIcon icon={faHouse} className="text-sm" />
                    <span>Go to Landing Page</span>
                  </div>
                </button>
              </div>





              {/* Meal Preference Modal */}
              {showMealPreference && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                        Select Your Meal Preference
                      </h3>
                      <p className="text-gray-600 font-body">
                        Choose your dietary preference for this dinner
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {[
                        { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
                        { id: 'non-vegetarian', label: 'Non-Vegetarian', icon: '🍖' },
                        { id: 'vegan', label: 'Vegan', icon: '🌱' },
                        { id: 'no-preference', label: 'No Preference', icon: '🍽️' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleMealPreferenceSelect(option.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all ${
                            selectedMealPreference === option.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-medium text-gray-900">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelBooking}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Booking Modal */}
              {showConfirmBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Confirm Your Booking
                      </h3>
                      <p className="text-gray-600">
                        Are you sure you want to book this dinner?
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meal Preference:</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {selectedMealPreference.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {selectedDinnerForBooking?.budgetCategory || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelBooking}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmBooking}
                        disabled={isOptingIn}
                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isOptingIn ? "Booking..." : "Confirm Booking"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Receipt Modal */}
              {showBookingReceipt && bookingReceipt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Booking Receipt
                      </h3>
                      <p className="text-gray-600">
                        Your dinner booking details
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking ID:</span>
                          <span className="font-medium text-gray-900">
                            {bookingReceipt.dinnerId.slice(-8)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            bookingReceipt.status === "Booked Successfully" 
                              ? "text-green-600" 
                              : "text-blue-600"
                          }`}>
                            {bookingReceipt.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meal Preference:</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {bookingReceipt.mealPreference.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget Category:</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {bookingReceipt.budgetCategory}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Time:</span>
                          <span className="font-medium text-gray-900 text-sm">
                            {bookingReceipt.bookingTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowBookingReceipt(false);
                          setBookingReceipt(null);
                        }}
                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manage Dinner Modal */}
              {showManageModal && selectedDinnerForManage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Manage Your Dinner Reservation
                      </h3>
                      <p className="text-gray-600">
                        {selectedDinnerForManage.restaurant_name} on {formatDateFromISO(selectedDinnerForManage.date)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Restaurant:</span>
                          <span className="font-medium text-gray-900">
                            {selectedDinnerForManage.restaurant_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">
                            {formatDateFromISO(selectedDinnerForManage.date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium text-gray-900">
                            {formatTimeTo12Hour(selectedDinnerForManage.time) || selectedDinnerForManage.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <button
                        onClick={handleConfirmPresence}
                        disabled={isManagingDinner}
                        className="w-full p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isManagingDinner ? "Confirming..." : "✅ Confirm My Presence"}
                      </button>
                      <button
                        onClick={handleDoLater}
                        disabled={isManagingDinner}
                        className="w-full p-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isManagingDinner ? "Setting Reminder..." : "⏰ I'll Do It Later"}
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelManage}
                        disabled={isManagingDinner}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}


            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  My Bookings
                </h2>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading bookings...</p>
                  </div>
                ) : userBookedDinners.length > 0 ? (
                  <div className="space-y-4">
                    {userBookedDinners
                      .filter(booking => shouldShowInBookings(booking.dinner_id))
                      .map((booking) => (
                      <div
                        key={booking.dinner_id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {booking.restaurant_name || 'Restaurant Name'}
                            </h3>
                                                <p className="text-gray-600 text-sm">
                      {formatDateFromISO(booking.date)} • {extractTimeFromISO(booking.date)}
                    </p>
                            <div className="flex items-center space-x-2 mt-2">
                              {isDinnerConfirmed(booking.dinner_id) ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Confirmed
                                </span>
                              ) : isDinnerPending(booking.dinner_id) ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Pending Confirmation
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Booked Successfully
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {booking.dietary_category?.replace('_', ' ') || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!isDinnerConfirmed(booking.dinner_id) && (
                              <button
                                onClick={() => handleManageDinner(booking)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                              >
                                Manage
                              </button>
                            )}
                            <button
                              onClick={() => handleViewStatus(booking.dinner_id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                              {expandedBookingId === booking.dinner_id ? 'Hide Status' : 'View Status'}
                            </button>
                          </div>
                        </div>
                        {expandedBookingId === booking.dinner_id && (
                          <div className="mt-4 bg-gray-50 rounded-lg p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Booking ID:</span>
                                <span className="font-medium text-gray-900">
                                  {booking.booking_id || booking.dinner_id?.slice(-8) || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium text-green-600">
                                  Booked Successfully
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Meal Preference:</span>
                                <span className="font-medium text-gray-900 capitalize">
                                  {booking.dietary_category?.replace('_', ' ') || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Budget Category:</span>
                                <span className="font-medium text-gray-900 capitalize">
                                  {booking.budget_category || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date & Time:</span>
                                <span className="font-medium text-gray-900 text-sm">
                                  {formatDateFromISO(booking.date)} • {extractTimeFromISO(booking.date)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Restaurant:</span>
                                <span className="font-medium text-gray-900">
                                  {booking.restaurant_name || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No bookings yet
                                  </div>
                                )}
                        </div>
            </motion.div>
          )}

          {/* Matches Tab */}
          {activeTab === "matches" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  My Matches
                </h2>
                <div className="text-center py-8 text-gray-500">
                  Connect with people from your dinners
                        </div>
                        </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-sm p-6">


                {/* Profile Avatar and Name with Edit Button */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto shadow-lg">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name || "User"}</h2>
                  <p className="text-gray-600 mb-1">{profile.email || "user@email.com"}</p>
                  <p className="text-sm text-purple-600 font-medium">
                    {profile.current_city || profile.city || "Your City"}, {profile.current_country || profile.country || "Your Country"}
                  </p>
                </div>

                {/* Buttons for Edit Profile, Logout, and Notifications */}
                <div className="flex flex-col space-y-3 mt-6">
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="w-48 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md hover:from-purple-700 hover:to-indigo-800 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 mx-auto"
                  >
                    {isEditingProfile ? "Hide Profile Info" : "Edit Profile"}
                  </button>
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="w-48 py-2 px-4 rounded-lg text-purple-600 bg-white border border-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-semibold mx-auto focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                  >
                    Notifications
                  </button>
                  <button
                    onClick={() => setShowHelpModal(true)}
                    className="w-48 py-2 px-4 rounded-lg text-purple-600 bg-white border border-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-semibold mx-auto focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                  >
                    Help Center
                  </button>
                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="w-48 py-2 px-4 rounded-lg text-purple-600 bg-white border border-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-semibold mx-auto focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                  >
                    Guide
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-48 py-2 px-4 rounded-lg text-purple-600 bg-white border border-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 text-sm font-semibold mx-auto focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
                  >
                    Logout
                  </button>
                </div>

                {/* Direct Editable Profile Information */}
                {isEditingProfile && (
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                      <span>Basic Information</span>
                        <button
                          onClick={() => handleProfileSave()}
                          className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                        >
                          Save
                        </button>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editProfile.name || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{profile.name || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                        {isEditingProfile ? (
                          <input
                            type="email"
                            value={editProfile.email || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{profile.email || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Mobile</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={editProfile.mobile || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, mobile: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{profile.mobile || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={editProfile.dob || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, dob: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Identity Information */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Identity Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                        {isEditingProfile ? (
                          <select
                            value={editProfile.gender || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, gender: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="text-sm text-gray-900 capitalize">{profile.gender || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Relationship Status</label>
                        {isEditingProfile ? (
                          <select
                            value={editProfile.relationship_status || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, relationship_status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                          </select>
                        ) : (
                          <p className="text-sm text-gray-900 capitalize">{profile.relationship_status || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Children</label>
                        {isEditingProfile ? (
                          <select
                            value={editProfile.children || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, children: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select</option>
                            <option value="0">No Children</option>
                            <option value="1">1 Child</option>
                            <option value="2">2 Children</option>
                            <option value="3">3 Children</option>
                            <option value="4+">4+ Children</option>
                          </select>
                        ) : (
                          <p className="text-sm text-gray-900">{profile.children ? "Yes" : "No"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Profession</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editProfile.profession || ""}
                            onChange={(e) => setEditProfile(prev => ({ ...prev, profession: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{profile.profession || "Not set"}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personality Information */}
                  {profile.personality_answers && profile.personality_answers.length > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                        <span>Personality Information</span>
                        <button
                            onClick={() => handlePersonalitySave()}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                        >
                            Save
                        </button>
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {(isEditingProfile ? editProfile.personality_answers : profile.personality_answers).map((answer, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded border text-xs">
                            <p className="text-gray-700 mb-1">{answer.question}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Trait: {answer.trait}</span>
                              {isEditingProfile ? (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handlePersonalityAnswerChange(index, "0")}
                                    className={`px-2 py-1 text-xs rounded border ${
                                      answer.answer === "0" 
                                        ? "bg-red-500 text-white border-red-500" 
                                        : "bg-white text-gray-600 border-gray-300 hover:border-red-300"
                                    }`}
                                  >
                                    Disagree
                                  </button>
                                  <button
                                    onClick={() => handlePersonalityAnswerChange(index, "1")}
                                    className={`px-2 py-1 text-xs rounded border ${
                                      answer.answer === "1" 
                                        ? "bg-green-500 text-white border-green-500" 
                                        : "bg-white text-gray-600 border-gray-300 hover:border-green-300"
                                    }`}
                                  >
                                    Agree
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs font-medium text-purple-600">
                                  {answer.answer === "0" ? "Disagree" : "Agree"}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                        </div>
                      )}
                    </div>
                )}
                {/* Dinner Preferences */}

              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-bold mb-4">Change Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={locationInput.country}
                  onChange={(e) => setLocationInput(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={locationInput.city}
                  onChange={(e) => setLocationInput(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                        </div>
                        </div>
            <div className="flex space-x-3 mt-6">
                        <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
                        </button>
                        <button
                onClick={handleLocationSave}
                disabled={profileLoading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {profileLoading ? "Saving..." : "Save"}
                        </button>
                      </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Edit Profile</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Name
                </label>
                              <input
                                type="text"
                                value={editProfile.name || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email
                </label>
                              <input
                                type="email"
                                value={editProfile.email || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                              />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Mobile
                </label>
                              <input
                  type="tel"
                                value={editProfile.mobile || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                                </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Gender
                                </label>
                <select
                  value={editProfile.gender || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                                </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Relationship Status
                                </label>
                <select
                  value={editProfile.relationship_status || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, relationship_status: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
                                </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Children
                                    </label>
                                            <select
                  value={editProfile.children || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, children: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Select</option>
                  <option value="0">No Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3">3 Children</option>
                  <option value="4+">4+ Children</option>
                                            </select>
                                  </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Profession
                                  </label>
                <input
                  type="text"
                  value={editProfile.profession || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, profession: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                                </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editProfile.dob || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                            </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={editProfile.city || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                            </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={editProfile.country || ""}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                            </div>
                          </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                            <button
                onClick={() => setShowEditProfile(false)}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                            >
                Cancel
                            </button>
                                <button
                onClick={handleProfileSave}
                className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                                >
                Save
                                </button>
                          </div>
                        </div>
                </div>
              )}

      {/* Detailed Information Modal */}
      {showDetailedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Detailed Information</h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Basic Information</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div>
                    <label className="font-medium text-gray-700">Mobile</label>
                    <p className="text-gray-900">{profile.mobile || "Not set"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Date of Birth</label>
                    <p className="text-gray-900">{profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Personal Details</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div>
                    <label className="font-medium text-gray-700">Gender</label>
                    <p className="text-gray-900 capitalize">{profile.gender || "Not set"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Relationship</label>
                    <p className="text-gray-900 capitalize">{profile.relationship_status || "Not set"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Children</label>
                    <p className="text-gray-900">{profile.children ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Profession</label>
                    <p className="text-gray-900">{profile.profession || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Personality Answers */}
              {profile.personality_answers && profile.personality_answers.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Personality Questions</h4>
                    <button
                      onClick={() => setIsEditingPersonality(!isEditingPersonality)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {isEditingPersonality ? "Cancel" : "Edit"}
                    </button>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(isEditingPersonality ? editProfile.personality_answers : profile.personality_answers).map((answer, index) => (
                      <div key={index} className="p-2 bg-white rounded border text-xs">
                        <p className="text-gray-700 mb-1">{answer.question}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Trait: {answer.trait}</span>
                          {isEditingPersonality ? (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handlePersonalityAnswerChange(index, "0")}
                                className={`px-2 py-1 text-xs rounded border ${
                                  answer.answer === "0" 
                                    ? "bg-red-500 text-white border-red-500" 
                                    : "bg-white text-gray-600 border-gray-300 hover:border-red-300"
                                }`}
                              >
                                Disagree
                              </button>
                              <button
                                onClick={() => handlePersonalityAnswerChange(index, "1")}
                                className={`px-2 py-1 text-xs rounded border ${
                                  answer.answer === "1" 
                                    ? "bg-green-500 text-white border-green-500" 
                                    : "bg-white text-gray-600 border-gray-300 hover:border-green-300"
                                }`}
                              >
                                Agree
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-purple-600">
                              {answer.answer === "0" ? "Disagree" : "Agree"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {isEditingPersonality && (
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => setIsEditingPersonality(false)}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-700 border border-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePersonalitySave}
                        className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowDetailedInfo(false)}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Help Center</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="border-b pb-3 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{helpSteps[helpStep - 1].title}</h4>
                <p className="text-gray-600 text-xs">{helpSteps[helpStep - 1].content}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              {helpStep > 1 && (
                <button
                  onClick={() => setHelpStep(prev => prev - 1)}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>
              )}
              {helpStep < helpSteps.length && (
                <button
                  onClick={() => setHelpStep(prev => prev + 1)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  Next
                </button>
              )}
              <button
                onClick={() => { setShowHelpModal(false); setHelpStep(1); }}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Guide</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="border-b pb-3 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{guideSteps[guideStep - 1].title}</h4>
                <p className="text-gray-600 text-xs">{guideSteps[guideStep - 1].content}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              {guideStep > 1 && (
                <button
                  onClick={() => setGuideStep(prev => prev - 1)}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>
              )}
              {guideStep < guideSteps.length && (
                <button
                  onClick={() => setGuideStep(prev => prev + 1)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  Next
                </button>
              )}
              <button
                onClick={() => { setShowGuideModal(false); setGuideStep(1); }}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Delete Account</h3>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-700">Are you sure you want to delete your account?</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Delete Account</h3>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-700">Your account has been deleted successfully.</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setDeleteSuccess(false)}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

</div>
    </>
  );
}