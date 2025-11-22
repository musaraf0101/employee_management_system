import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: string | null;
  name: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    if (storedRole) {
      setUserRole(storedRole);
    }
    if (storedName) {
      setName(storedName);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const role = response.data?.data?.role;
      const userName = response.data?.data?.name || response.data?.data?.email;

      if (role === "admin" || role === "employee") {
        setUserRole(role);
        setName(userName);
        localStorage.setItem("role", role);
        localStorage.setItem("name", userName);
        navigate(
          role === "admin" ? "/admin/dashboard" : "/employee/dashboard",
          { replace: true }
        );
      } else {
        console.error(
          "No valid role found. Response structure:",
          JSON.stringify(response.data, null, 2)
        );
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
      setName(null);
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userRole,
        name,
        isAuthenticated: !!userRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
