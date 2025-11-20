import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  axios.defaults.withCredentials = true;

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        { email, password }
      );

      const role = response.data?.data?.role;
      if (role === "admin" || role === "employee") {
        setUserRole(role);
        navigate(role === "admin" ? "/admin/dashboard" : "/employee/dashboard", { replace: true });
      } else {
        console.error("No valid role found. Response structure:", JSON.stringify(response.data, null, 2));
        throw new Error("Invalid role in response");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/logout");
      setUserRole(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, userRole, isAuthenticated: !!userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
