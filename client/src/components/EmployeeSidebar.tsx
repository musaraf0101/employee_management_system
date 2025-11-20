import { useAuth } from "../context/AuthContext";
import { HiChartPie, HiCog, HiLogout } from "react-icons/hi";

const EmployeeSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Employee Dashboard</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 bg-blue-100 rounded-lg hover:bg-blue-200"
            >
              <HiChartPie className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <HiCog className="w-5 h-5" />
              <span>Settings</span>
            </a>
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

export default EmployeeSidebar;
