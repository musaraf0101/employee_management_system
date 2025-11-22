import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const validateForm = (): boolean => {
    if (!email.trim() || !password) {
      toast.error("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-2-indigo-500 w-full"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-2-indigo-500 w-full"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <hr />
        <p className="flex justify-center text-sm hover:text-blue-400 cursor-pointer">
          Forgotten password?
        </p>
      </form>
    </div>
  );
};

export default Login;
