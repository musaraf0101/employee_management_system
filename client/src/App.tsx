import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import UpdateProfile from "./pages/employee/UpdateProfile";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Employee from "./pages/admin/Employee";
import LeaveRequest from "./pages/admin/LeaveRequest";

const App = () => {
  return (
    <AuthProvider>
      <div className="bg-black">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRole="admin">
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leave-requests"
            element={
              <ProtectedRoute allowedRole="admin">
                <LeaveRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/update/:id?"
            element={
              <ProtectedRoute allowedRole="employee">
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};
export default App;
