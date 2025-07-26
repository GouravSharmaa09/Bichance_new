import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { LoadingScreen } from "../components/common/LoadingScreen";

export const RedirectIfAuthenticated = ({ children }) => {
  const { loading } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/onboarding" replace />;

  return children;
};
