import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const LeaveRequest = () => {
  const [allLeaveRequests, setAllLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [startTimeFilter, setStartTimeFilter] = useState("");
  const [endTimeFilter, setEndTimeFilter] = useState("");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/leave-requests",
          {
            withCredentials: true,
          }
        );
        setAllLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);
  const filteredRequests = allLeaveRequests.filter((request) => {
    const matchLeaveType =
      leaveTypeFilter === "" || request.leaveType === leaveTypeFilter;
    const matchSearch =
      searchQuery === "" ||
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    let matchDateRange = true;
    if (
      request.leaveType === "full-day" &&
      (startDateFilter || endDateFilter)
    ) {
      if (
        startDateFilter &&
        request.startDate &&
        request.startDate < startDateFilter
      )
        matchDateRange = false;
      if (endDateFilter && request.endDate && request.endDate > endDateFilter)
        matchDateRange = false;
    }
    let matchTimeRange = true;
    if (request.leaveType === "short" && (startTimeFilter || endTimeFilter)) {
      if (
        startTimeFilter &&
        request.startTime &&
        request.startTime < startTimeFilter
      )
        matchTimeRange = false;
      if (endTimeFilter && request.endTime && request.endTime > endTimeFilter)
        matchTimeRange = false;
    }

    return matchLeaveType && matchSearch && matchDateRange && matchTimeRange;
  });

  const clearFilters = () => {
    setLeaveTypeFilter("");
    setSearchQuery("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStartTimeFilter("");
    setEndTimeFilter("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full md:w-auto pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Leave Requests
              </h1>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by employee name or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={leaveTypeFilter}
                    onChange={(e) => {
                      setLeaveTypeFilter(e.target.value);
                      setStartDateFilter("");
                      setEndDateFilter("");
                      setStartTimeFilter("");
                      setEndTimeFilter("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Leave Types</option>
                    <option value="full-day">Full Day</option>
                    <option value="short">Short Leave</option>
                  </select>
                </div>
              </div>
              {leaveTypeFilter === "full-day" && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date (From)
                    </label>
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (To)
                    </label>
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              {leaveTypeFilter === "short" && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time (From)
                    </label>
                    <input
                      type="time"
                      value={startTimeFilter}
                      onChange={(e) => setStartTimeFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time (To)
                    </label>
                    <input
                      type="time"
                      value={endTimeFilter}
                      onChange={(e) => setEndTimeFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              {(leaveTypeFilter ||
                searchQuery ||
                startDateFilter ||
                endDateFilter ||
                startTimeFilter ||
                endTimeFilter) && (
                <div>
                  <button
                    onClick={clearFilters}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">Loading leave requests...</div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        ID
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Employee
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Type
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Reason
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Date/Time
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Status
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-4 text-center text-gray-500"
                        >
                          No leave requests found
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {request.id}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {request.employeeName}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                request.leaveType === "full-day"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {request.leaveType === "full-day"
                                ? "Full Day"
                                : "Short Leave"}
                            </span>
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {request.reason}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {request.leaveType === "full-day"
                              ? `${request.startDate} to ${request.endDate}`
                              : `${request.date} (${request.startTime} - ${request.endTime})`}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                request.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {request.status === "Pending" && (
                              <>
                                <button className="text-green-500 hover:text-green-700 mr-2 md:mr-3 text-sm md:text-base">
                                  Approve
                                </button>
                                <button className="text-red-500 hover:text-red-700 text-sm md:text-base">
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
