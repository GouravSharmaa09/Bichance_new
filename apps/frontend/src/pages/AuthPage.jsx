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
              token: data.data.access_token,
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
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 w-full bg-[#FEF7ED]" style={{ backgroundImage: 'url(/auth.avif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <motion.div
        className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-none p-6 sm:p-8 w-full max-w-md"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-center mb-4">
          <img src="/l1.png" alt="Logo" className="h-24 w-auto" />
        </div>
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Sign Up with Email
        </h2>
        {step === 1 && (
          <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4">
            <label className="font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-300 outline-none text-lg"
              placeholder="Enter your Gmail address"
              required
              disabled={countdown > 0}
            />
            {/* Slide to Send OTP Button */}
            <SlideToSendOTP
              onSlide={handleSendOtp}
              loading={loading}
              disabled={countdown > 0 || !email || !email.includes("@")}
              countdown={countdown}
              label="Send OTP"
            />
            {error && (
              <div className="text-red-600 text-center font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-center font-semibold">
                {success}
              </div>
            )}
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <label className="font-semibold text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-300 outline-none text-lg tracking-widest text-center"
              placeholder="Enter OTP"
              required
            />
            <SlideToSendOTP
              onSlide={handleVerifyOtp}
              loading={loading}
              disabled={loading || !otp || otp.length < 4}
              countdown={0}
              label="Verify OTP"
            />
            {error && (
              <div className="text-red-600 text-center font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-center font-semibold">
                {success}
              </div>
            )}
            <button
              type="button"
              className="text-red-500 underline mt-2"
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
          </form>
        )}
      </motion.div>
      <button
        className="mt-6 w-full max-w-[140px] mx-auto py-3 rounded-full text-white font-bold text-lg shadow-lg transition-all bg-gradient-to-r from-red-500 to-red-700 hover:bg-black hover:from-black hover:to-black hover:text-white"
        style={{
          border: 'none',
          borderRadius: '9999px',
        }}
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
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
        className="absolute top-1 left-1 h-10 w-10 bg-gradient-to-r from-red-500 to-red-700 rounded-full shadow flex items-center justify-center z-20 transition-transform duration-200"
        style={{ transform: `translateX(${slide * (sliderRef.current ? sliderRef.current.offsetWidth - 48 : 0) / 100}px)` }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}
