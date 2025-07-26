import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { LoadingScreen } from "../components/common/LoadingScreen";

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};
