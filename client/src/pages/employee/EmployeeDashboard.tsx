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
  const [recentLeaves, setRecentLeaves] = useState<any[]>([]);
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
      setRecentLeaves(response.data.recentLeaves || []);
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
              <>
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

                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Recent Leave Requests
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left border-b">Type</th>
                          <th className="p-3 text-left border-b">Date</th>
                          <th className="p-3 text-left border-b">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentLeaves.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">
                              No leave requests found
                            </td>
                          </tr>
                        ) : (
                          recentLeaves.map((leave) => (
                            <tr key={leave._id} className="hover:bg-gray-50">
                              <td className="p-3 border-b">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    leave.leaveType === "full-day" || leave.leaveType === "full_day"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {leave.leaveType === "full-day" || leave.leaveType === "full_day"
                                    ? "Full Day"
                                    : "Short Leave"}
                                </span>
                              </td>
                              <td className="p-3 border-b">
                                {leave.startDate
                                  ? new Date(leave.startDate).toLocaleDateString()
                                  : "N/A"}
                                {leave.endDate && leave.leaveType !== "short" && 
                                  ` - ${new Date(leave.endDate).toLocaleDateString()}`}
                              </td>
                              <td className="p-3 border-b">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    leave.status === "Approved" || leave.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : leave.status === "Rejected" || leave.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {leave.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
