import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  HiChartPie,
  HiUsers,
  HiDocumentText,
  HiCog,
  HiLogout,
} from "react-icons/hi";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-purple-200 ${
                isActive("/admin/dashboard") ? "bg-purple-100" : ""
              }`}
            >
              <HiChartPie className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/employees"
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                isActive("/admin/employees") ? "bg-purple-100" : ""
              }`}
            >
              <HiUsers className="w-5 h-5" />
              <span>Employees</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/leave-requests"
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                isActive("/admin/leave-requests") ? "bg-purple-100" : ""
              }`}
            >
              <HiDocumentText className="w-5 h-5" />
              <span>Leave Requests</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                isActive("/admin/settings") ? "bg-purple-100" : ""
              }`}
            >
              <HiCog className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
        <div className="mt-8 pt-8 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-600 rounded-lg hover:bg-red-50"
          >
            <HiLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
