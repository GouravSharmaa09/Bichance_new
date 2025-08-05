import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useEffect, useState } from "react";
import { checkOnboardingCompletion } from "../utils/onboardingUtils";

export const OnboardingFlowRoute = ({ children }) => {
  const { loading } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const hasCompleted = await checkOnboardingCompletion();
        setHasCompletedOnboarding(hasCompleted);
      } catch (error) {
        // If there's an error, assume not completed
        setHasCompletedOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated]);

  if (loading || checkingOnboarding) return <LoadingScreen />;
  
  // If not authenticated, redirect to auth
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  // If user has completed onboarding, redirect to dashboard
  if (hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user hasn't completed onboarding, show the onboarding component
  return children;
}; 