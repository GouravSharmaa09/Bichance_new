import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { LoadingScreen } from "../components/common/LoadingScreen";

export const PrivateRoute = ({ children }) => {
  const { loading } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
};
