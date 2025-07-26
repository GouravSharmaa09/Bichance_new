import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ExclusiveOnboarding } from "../components.js";
import { useSelector } from "react-redux";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { profile, signUp } = useAuth();
  const reduxUser = useSelector((state) => state.auth.user);
  const access_token = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        "https://bichance-production-a30f.up.railway.app/api/v1/users/me",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        if (
          userData &&
          Object.keys(userData.data.personality_scores).length > 0
        ) {
          navigate("/dashboard");
        }
        // Do something with userData, e.g., dispatch to Redux
      }
    };
    fetchUser();
  }, [access_token]);

  const handleOnboardingComplete = async (formData) => {
    // signUp ko call karo, login state set karo, aur dashboard pe redirect karo
    const result = await signUp(formData.email, formData.password, formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      // Optionally show error
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF7ED] fade-in-up overflow-x-hidden">
      {/* <h1 className="text-3xl font-bold text-red-600 text-center my-8"> */}
        
      {/* </h1> */}
      <ExclusiveOnboarding
        onComplete={handleOnboardingComplete}
        onBack={() => navigate("/auth")}
      />
    </div>
  );
};

export default OnboardingPage;
