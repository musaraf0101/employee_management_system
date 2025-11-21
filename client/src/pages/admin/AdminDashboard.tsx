import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaveEmployees: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/dashboard-stats",
          {
            withCredentials: true,
          }
        );
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full md:w-auto pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Admin Dashboard
            </h1>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-purple-100 p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold text-purple-800">
                    Total Employees
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-2">
                    {stats.totalEmployees}
                  </p>
                </div>
                <div className="bg-green-100 p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold text-green-800">
                    Employees on Leave Today
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                    {stats.totalLeaveEmployees}
                  </p>
                </div>
                <div className="bg-red-100 p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold text-red-800">
                    Pending Request
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">
                    {stats.pendingRequests}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
