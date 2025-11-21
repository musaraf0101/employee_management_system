import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const LeaveRequest = () => {
  // Sample leave request data - replace with API call
  const allLeaveRequests = [
    { id: 1, employeeName: "John Doe", leaveType: "full-day", reason: "Sick", startDate: "2024-01-15", endDate: "2024-01-17", status: "Pending" },
    { id: 2, employeeName: "Jane Smith", leaveType: "short", reason: "Doctor Appointment", startTime: "10:00", endTime: "12:00", date: "2024-01-20", status: "Approved" },
    { id: 3, employeeName: "Mike Johnson", leaveType: "full-day", reason: "Vacation", startDate: "2024-02-01", endDate: "2024-02-05", status: "Pending" },
    { id: 4, employeeName: "Sarah Williams", leaveType: "short", reason: "Personal", startTime: "14:00", endTime: "16:00", date: "2024-01-18", status: "Rejected" },
    { id: 5, employeeName: "Tom Brown", leaveType: "full-day", reason: "Family Emergency", startDate: "2024-01-25", endDate: "2024-01-26", status: "Approved" },
  ];

  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [startTimeFilter, setStartTimeFilter] = useState("");
  const [endTimeFilter, setEndTimeFilter] = useState("");

  // Filter leave requests
  const filteredRequests = allLeaveRequests.filter(request => {
    const matchLeaveType = leaveTypeFilter === "" || request.leaveType === leaveTypeFilter;
    const matchSearch = searchQuery === "" || 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filter for full-day leave
    let matchDateRange = true;
    if (request.leaveType === "full-day" && (startDateFilter || endDateFilter)) {
      if (startDateFilter && request.startDate && request.startDate < startDateFilter) matchDateRange = false;
      if (endDateFilter && request.endDate && request.endDate > endDateFilter) matchDateRange = false;
    }

    // Time range filter for short leave
    let matchTimeRange = true;
    if (request.leaveType === "short" && (startTimeFilter || endTimeFilter)) {
      if (startTimeFilter && request.startTime && request.startTime < startTimeFilter) matchTimeRange = false;
      if (endTimeFilter && request.endTime && request.endTime > endTimeFilter) matchTimeRange = false;
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
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Leave Requests</h1>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by employee name or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Section */}
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
                      // Clear date/time filters when switching
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

              {/* Full Day Date Range Filter */}
              {leaveTypeFilter === "full-day" && (
                <div className="flex gap-4">
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

              {/* Short Leave Time Range Filter */}
              {leaveTypeFilter === "short" && (
                <div className="flex gap-4">
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

              {/* Clear Filters Button */}
              {(leaveTypeFilter || searchQuery || startDateFilter || endDateFilter || startTimeFilter || endTimeFilter) && (
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border-b">ID</th>
                    <th className="p-3 text-left border-b">Employee Name</th>
                    <th className="p-3 text-left border-b">Leave Type</th>
                    <th className="p-3 text-left border-b">Reason</th>
                    <th className="p-3 text-left border-b">Date/Time</th>
                    <th className="p-3 text-left border-b">Status</th>
                    <th className="p-3 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{request.id}</td>
                        <td className="p-3 border-b">{request.employeeName}</td>
                        <td className="p-3 border-b">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            request.leaveType === "full-day" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {request.leaveType === "full-day" ? "Full Day" : "Short Leave"}
                          </span>
                        </td>
                        <td className="p-3 border-b">{request.reason}</td>
                        <td className="p-3 border-b">
                          {request.leaveType === "full-day" 
                            ? `${request.startDate} to ${request.endDate}`
                            : `${request.date} (${request.startTime} - ${request.endTime})`
                          }
                        </td>
                        <td className="p-3 border-b">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            request.status === "Approved" 
                              ? "bg-green-100 text-green-800" 
                              : request.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="p-3 border-b">
                          {request.status === "Pending" && (
                            <>
                              <button className="text-green-500 hover:text-green-700 mr-3">
                                Approve
                              </button>
                              <button className="text-red-500 hover:text-red-700">
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
      </div>
    </div>
  );
};

export default LeaveRequest;
