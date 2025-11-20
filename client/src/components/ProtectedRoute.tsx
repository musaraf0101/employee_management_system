import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: "admin" | "employee";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { userRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !userRole) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== allowedRole) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
