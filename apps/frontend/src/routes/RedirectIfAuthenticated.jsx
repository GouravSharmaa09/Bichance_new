import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useEffect, useState } from "react";
import { checkOnboardingCompletion } from "../utils/onboardingUtils";

export const RedirectIfAuthenticated = ({ children }) => {
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
  if (isAuthenticated) {
    // If user has completed journey/onboarding, redirect to dashboard
    if (hasCompletedJourney) {
      return <Navigate to="/dashboard" replace />;
    }
    // If user hasn't completed onboarding, redirect to onboarding
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};
