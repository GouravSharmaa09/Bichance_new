import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../components/common/LoadingScreen";

export const AdminRoute = ({ children }) => {
  // Check for admin token in localStorage
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!adminToken || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const userData = JSON.parse(adminUser);
    if (userData.role !== "admin") {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
