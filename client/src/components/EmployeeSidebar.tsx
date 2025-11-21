import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { HiChartPie, HiCog, HiLogout, HiMenu, HiX } from "react-icons/hi";

const EmployeeSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Employee Panel</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700"
        >
          {isOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>
      </div>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
      <aside
        className={`fixed md:static w-64 bg-white shadow-md min-h-screen z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Employee Panel</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/employee/dashboard"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-200 ${
                  isActive("/employee/dashboard") ? "bg-blue-100" : ""
                }`}
              >
                <HiChartPie className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/employee/update"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 ${
                  isActive("/employee/update") ? "bg-blue-100" : ""
                }`}
              >
                <HiCog className="w-5 h-5" />
                <span>Update profile</span>
              </Link>
            </li>
          </ul>
          <div className="mt-8 pt-8 border-t">
            <button
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="flex items-center gap-3 px-4 py-2 w-full text-red-600 rounded-lg hover:bg-red-50"
            >
              <HiLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default EmployeeSidebar;
