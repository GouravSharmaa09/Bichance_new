import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://bichance-production-a30f.up.railway.app";

export default function SubscriptionStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Get dinner details from navigation state
  const { dinnerId, budgetCategory, dietaryCategory } = location.state || {};

  // Subscription plans data
  const subscriptionPlans = [
    {
      id: "1m",
      name: "1 Month",
      price: 1099,
      price_id: "price_1RisNDSGp7YEjcqZBloeFYAC",
      description: "Perfect for trying out Bichance",
      features: [
        "Join unlimited dinners",
        "Meet new people every week",
        "Curated dining experiences",
        "Priority booking access"
      ]
    },
    {
      id: "3m",
      name: "3 Months",
      price: 2999,
      price_id: "price_1RisNXSGp7YEjcqZHzL4zJCP",
      description: "Best value for regular users",
      savings: "Save ₹298",
      features: [
        "Everything in 1 Month plan",
        "Better matching algorithm",
        "Exclusive member events",
        "Priority customer support"
      ]
    },
    {
      id: "12m",
      name: "12 Months",
      price: 10550,
      price_id: "price_1RisO2SGp7YEjcqZDDccoJsl",
      description: "Ultimate value for committed users",
      savings: "Save ₹2,638",
      features: [
        "Everything in 3 Months plan",
        "VIP dinner experiences",
        "Personal concierge service",
        "Early access to new features"
      ]
    }
  ];

  // Check if user already has active subscription
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          headers: {
            accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.data || data;
          
          if (userData.subscription_status === "active") {
            setHasActiveSubscription(true);
            toast.success("You already have an active subscription!");
            // If user has subscription and came from dinner selection, book the dinner directly
            if (dinnerId) {
              await bookDinnerDirectly();
            } else {
              navigate('/dashboard');
            }
          }
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
      }
    };

    checkSubscriptionStatus();
  }, [token, dinnerId, navigate]);

  const bookDinnerDirectly = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/dinner/opt-in`, {
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
      });

      if (response.ok) {
        toast.success("Successfully booked dinner!");
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Failed to book dinner");
      }
    } catch (error) {
      toast.error("Failed to book dinner");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscriptionCheckout = async () => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }

    try {
      setIsProcessing(true);
      console.log(`Starting ${selectedPlan.name} subscription checkout...`);
      
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/subscription/create-checkout-session`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
                     body: JSON.stringify({ 
             price_id: selectedPlan.price_id,
             // Force development mode for now to fix redirect issue
             is_development: true
           }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      console.log("Checkout session response:", data);

             if (data && (data.checkout_url || data.session_url)) {
         const checkoutUrl = data.checkout_url || data.session_url;
         console.log("Redirecting to checkout URL:", checkoutUrl);
         window.location.href = checkoutUrl;
       } else {
         toast.error("No checkout URL returned from server");
       }
      
    } catch (error) {
      console.error("Subscription checkout error:", error);
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <img src="/l1.png" alt="Logo" className="h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a plan to start joining amazing dinners and meet new people. 
            {dinnerId && " After subscribing, you'll be automatically booked for your selected dinner!"}
          </p>
        </motion.div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedPlan(plan)}
              className={`bg-white rounded-2xl p-6 cursor-pointer transition-all hover:shadow-xl ${
                selectedPlan?.id === plan.id
                  ? "ring-4 ring-purple-500 shadow-xl"
                  : "shadow-lg hover:shadow-xl"
              }`}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  ₹{plan.price}
                </div>
                {plan.savings && (
                  <div className="text-sm text-green-600 font-semibold mb-3 bg-green-100 px-3 py-1 rounded-full inline-block">
                    {plan.savings}
                  </div>
                )}
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  {plan.id === "1m" && "Billed monthly"}
                  {plan.id === "3m" && "Billed every 3 months"}
                  {plan.id === "12m" && "Billed annually"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubscriptionCheckout}
            disabled={!selectedPlan || isProcessing}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Book My Plan"}
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>Secure payment powered by Stripe</p>
          <p>Cancel anytime • No hidden fees</p>
                     <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
             <p className="text-yellow-800 font-medium">Development Mode</p>
             <p className="text-yellow-700 text-xs">
               Backend will redirect to localhost:3000 for testing
             </p>
           </div>
        </motion.div>
      </div>
    </div>
  );
} 