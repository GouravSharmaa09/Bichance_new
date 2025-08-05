import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useEffect, useState } from "react";
import { checkOnboardingCompletion } from "../utils/onboardingUtils";

export const DashboardRoute = ({ children }) => {
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
        console.log('DashboardRoute - Onboarding completion status:', hasCompleted);
        setHasCompletedOnboarding(hasCompleted);
      } catch (error) {
        // If there's an error, assume not completed
        console.log('DashboardRoute - Error checking onboarding:', error);
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
  
  // If user hasn't completed onboarding, redirect to onboarding
  if (!hasCompletedOnboarding) {
    console.log('DashboardRoute - Redirecting to onboarding, completion status:', hasCompletedOnboarding);
    return <Navigate to="/onboarding" replace />;
  }

  // If user has completed onboarding, show the dashboard
  return children;
}; 