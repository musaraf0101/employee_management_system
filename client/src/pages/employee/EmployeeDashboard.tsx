import { useState, useEffect } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import LeaveModal from "../../components/LeaveModal";
import axios from "axios";

const EmployeeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    myRequests: 0,
    monthLeaveCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/employee/stats", {
        withCredentials: true,
      });
      setStats({
        myRequests: response.data.myRequests,
        monthLeaveCount: response.data.monthLeaveCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <EmployeeSidebar />
      <div className="flex-1 p-4 md:p-8 w-full md:w-auto pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto py-3 px-4 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-md cursor-pointer hover:from-blue-500 hover:to-blue-700 transition"
              >
                New Request
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
                <div className="bg-blue-100 p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold text-blue-800">
                    My Requests
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">
                    {stats.myRequests}
                  </p>
                </div>
                <div className="bg-green-100 p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold text-green-800">
                    This Month Leave Count
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                    {stats.monthLeaveCount}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <LeaveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
};

export default EmployeeDashboard;
