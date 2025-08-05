import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { login as reduxLogin } from "../store/authSlice";
import { fetchWithAuth } from '../lib/fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const AuthPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before trying again.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 429) {
        // Rate limited - start 60 second countdown
        setCountdown(60);
        setError(
          "Too many requests. Please wait 60 seconds before trying again."
        );
      } else if (
        res.ok &&
        (data.success || data.message?.toLowerCase().includes("otp"))
      ) {
        setStep(2);
        setSuccess(data.message || "OTP sent to your email!");
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (
        res.ok &&
        ((data.success && data.success === true) ||
          (data.message &&
            (data.message.toLowerCase().includes("verified") ||
              data.message.toLowerCase().includes("login successful"))))
      ) {
        setSuccess(data.message || "OTP verified! Redirecting...");
        // Save tokens to localStorage
        if (data.data && data.data.access_token) {
          localStorage.setItem("access_token", data.data.access_token);
          localStorage.setItem("refresh_token", data.data.refresh_token);
          dispatch(
            reduxLogin({
              user: data.data.user || {},
              access_token: data.data.access_token,
              refresh_token: data.data.refresh_token,
              email: email,
            })
          );
        }
        console.log("Redirecting to /onboarding");
        navigate("/onboarding");
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Back Arrow */}
      <div className="absolute top-16 left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/a.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col min-h-screen md:items-center">
        {/* Bottom Section */}
        <div className="bg-purple-600/60 backdrop-blur-lg rounded-t-3xl md:rounded-b-3xl p-6 md:p-8 mt-auto mx-4 md:max-w-md md:mx-auto md:mt-52">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white text-center md:text-center mb-6 tracking-tight">
              {step === 1 ? "Sign up With Email" : "Verify OTP"}
            </h2>
        {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-heading font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-300 outline-none text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                    placeholder="Enter your email address"
              required
              disabled={countdown > 0}
            />
                </div>
                
            <SlideToSendOTP
              onSlide={handleSendOtp}
              loading={loading}
              disabled={countdown > 0 || !email || !email.includes("@")}
              countdown={countdown}
              label="Send OTP"
            />
                
            {error && (
                  <div className="text-red-300 text-center font-medium bg-red-900/20 rounded-lg p-3">
                {error}
              </div>
            )}
            {success && (
                  <div className="text-green-300 text-center font-medium bg-green-900/20 rounded-lg p-3">
                {success}
                  </div>
                )}
              </div>
            )}

        {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-heading font-semibold mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-300 outline-none text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 tracking-widest text-center"
              placeholder="Enter OTP"
              required
            />
                </div>
                
            <SlideToSendOTP
              onSlide={handleVerifyOtp}
              loading={loading}
              disabled={loading || !otp || otp.length < 4}
              countdown={0}
              label="Verify OTP"
            />
                
            {error && (
                  <div className="text-red-300 text-center font-medium bg-red-900/20 rounded-lg p-3">
                {error}
              </div>
            )}
            {success && (
                  <div className="text-green-300 text-center font-medium bg-green-900/20 rounded-lg p-3">
                {success}
              </div>
            )}
                
            <button
              type="button"
                  className="text-white/80 underline text-center w-full"
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
              </div>
            )}

            {/* Legal Text */}
            <p className="text-white/80 text-sm text-center mt-6 leading-relaxed">
              By signing up you agree to the{' '}
              <span className="underline">Terms of Service</span>,{' '}
              <span className="underline">Privacy Policy</span> and{' '}
              <span className="underline">Community Guidelines</span>.
            </p>


          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

function SlideToSendOTP({ onSlide, loading, disabled, countdown, label }) {
  const [slide, setSlide] = useState(0);
  const [sliding, setSliding] = useState(false);
  const sliderRef = useRef(null);

  // Reset slide on loading or countdown
  useEffect(() => {
    if (!loading && countdown === 0) setSlide(0);
  }, [loading, countdown]);

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  const handleMouseDown = (e) => {
    if (disabled) return;
    if (isDesktop) {
      // Instantly animate to 100% and trigger on desktop
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
      className={`relative w-full h-12 bg-purple-900 rounded-xl overflow-hidden select-none shadow-lg ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-200"
        style={{ width: `${slide}%` }}
      />
      <div
        className="absolute top-0 left-0 h-full flex items-center justify-center w-full z-10 pointer-events-none"
      >
        {loading ? (
          <span className="text-white font-bold">{label === 'Verify OTP' ? 'Verifying...' : 'Sending OTP...'}</span>
        ) : countdown > 0 ? (
          <span className="text-white font-bold">Wait {countdown}s</span>
        ) : slide > 80 ? (
          <span className="text-white font-bold">Release to {label}</span>
        ) : (
          <span className="text-white font-bold tracking-wider">SWIPE TO {label.toUpperCase()}</span>
        )}
      </div>
      <div
        className="absolute top-1 left-1 h-10 w-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow flex items-center justify-center z-20 transition-transform duration-200"
        style={{ transform: `translateX(${slide * (sliderRef.current ? sliderRef.current.offsetWidth - 48 : 0) / 100}px)` }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}

