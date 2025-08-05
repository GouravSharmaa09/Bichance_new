import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useEffect, useState } from "react";
import { checkOnboardingCompletion } from "../utils/onboardingUtils";

export const OnboardingRoute = ({ children }) => {
  const { loading } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [checkingJourney, setCheckingJourney] = useState(true);
  const [hasCompletedJourney, setHasCompletedJourney] = useState(false);

  useEffect(() => {
    const checkJourneyStatus = async () => {
      if (!isAuthenticated) {
        setCheckingJourney(false);
        return;
      }

      try {
        const hasCompleted = await checkOnboardingCompletion();
        setHasCompletedJourney(hasCompleted);
      } catch (error) {
        // If there's an error, assume not completed
        setHasCompletedJourney(false);
      } finally {
        setCheckingJourney(false);
      }
    };

    checkJourneyStatus();
  }, [isAuthenticated]);

  if (loading || checkingJourney) return <LoadingScreen />;
  
  // If not authenticated, redirect to auth
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  // If user has completed journey/onboarding, redirect to dashboard
  if (hasCompletedJourney) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user hasn't completed onboarding, show the onboarding component
  return children;
}; 