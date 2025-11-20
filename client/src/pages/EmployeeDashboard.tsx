import { useAuth } from "../context/AuthContext";

const EmployeeDashboard = () => {
  const { logout, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Welcome, Employee</p>
            <p className="text-sm text-gray-500">Role: {userRole}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800">My Tasks</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800">Completed</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
