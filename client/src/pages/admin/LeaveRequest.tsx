import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";

const LeaveRequest = () => {
  const [allLeaveRequests, setAllLeaveRequests] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [startTimeFilter, setStartTimeFilter] = useState("");
  const [endTimeFilter, setEndTimeFilter] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/leave-requests`,
          {
            withCredentials: true,
          }
        );
        const leaveRequests = response.data.data || response.data;
        setAllLeaveRequests(leaveRequests);
      } catch (error: any) {
        console.error("Error fetching leave requests:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch leave requests";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/employees`, {
        withCredentials: true,
      });
      setAllEmployees(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDownloadReport = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/report/leave-monthly`,
        {
          params: {
            userId: selectedEmployee,
            month: selectedMonth,
            year: selectedYear,
          },
          responseType: "blob",
          withCredentials: true,
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const employee = allEmployees.find((emp) => emp._id === selectedEmployee);
      link.setAttribute(
        "download",
        `leave-report-${
          employee?.name || "employee"
        }-${selectedMonth}-${selectedYear}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Report downloaded successfully!");
      setIsReportModalOpen(false);
      setSelectedEmployee("");
      setEmployeeSearchQuery("");
      setShowEmployeeDropdown(false);
    } catch (error: any) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };
  const filteredRequests = allLeaveRequests
    .filter((request) => {
      const matchLeaveType =
        leaveTypeFilter === "" ||
        request.leaveType === leaveTypeFilter ||
        (leaveTypeFilter === "full-day" && request.leaveType === "full_day") ||
        (leaveTypeFilter === "full_day" && request.leaveType === "full-day");
      const employeeName = request.userId?.name || request.employeeName || "";
      const matchSearch =
        searchQuery === "" ||
        employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason?.toLowerCase().includes(searchQuery.toLowerCase());
      let matchDateRange = true;
      if (
        (request.leaveType === "full-day" ||
          request.leaveType === "full_day") &&
        (startDateFilter || endDateFilter)
      ) {
        const reqStartDate = request.startDate
          ? new Date(request.startDate).toISOString().split("T")[0]
          : null;
        const reqEndDate = request.endDate
          ? new Date(request.endDate).toISOString().split("T")[0]
          : null;

        if (startDateFilter && reqStartDate && reqStartDate < startDateFilter)
          matchDateRange = false;
        if (endDateFilter && reqEndDate && reqEndDate > endDateFilter)
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
    })
    .sort((a, b) => {
      const statusOrder = {
        Pending: 0,
        pending: 0,
        Approved: 1,
        approved: 1,
        Rejected: 2,
        rejected: 2,
      };
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      const dateA = new Date(a.createdAt || a._id).getTime();
      const dateB = new Date(b.createdAt || b._id).getTime();
      return dateB - dateA;
    });

  const clearFilters = () => {
    setLeaveTypeFilter("");
    setSearchQuery("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStartTimeFilter("");
    setEndTimeFilter("");
  };

  const handleApprove = async (requestId: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/leave-requests/${requestId}/approve`,
        {},
        { withCredentials: true }
      );

      setAllLeaveRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "Approved" } : req
        )
      );

      toast.success("Leave request approved successfully!");
    } catch (error: any) {
      console.error("Error approving leave request:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to approve leave request";
      toast.error(errorMsg);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/leave-requests/${requestId}/reject`,
        {},
        { withCredentials: true }
      );

      setAllLeaveRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: "Rejected" } : req
        )
      );

      toast.success("Leave request rejected successfully!");
    } catch (error: any) {
      console.error("Error rejecting leave request:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to reject leave request";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full md:w-auto pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Leave Requests
              </h1>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full sm:w-auto py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Download Monthly Report
              </button>
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
                            Name
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
                            <tr key={request._id} className="hover:bg-gray-50">
                              <td className="p-2 md:p-3 border-b text-sm md:text-base">
                                {request.userId?.name ||
                                  request.employeeName ||
                                  "N/A"}
                              </td>
                              <td className="p-2 md:p-3 border-b text-sm md:text-base">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm ${
                                    request.leaveType === "full-day" ||
                                    request.leaveType === "full_day"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {request.leaveType === "full-day" ||
                                  request.leaveType === "full_day"
                                    ? "Full Day"
                                    : "Short Leave"}
                                </span>
                              </td>
                              <td className="p-2 md:p-3 border-b text-sm md:text-base">
                                {request.reason}
                              </td>
                              <td className="p-2 md:p-3 border-b text-sm md:text-base">
                                {request.leaveType === "full-day" ||
                                request.leaveType === "full_day"
                                  ? `${
                                      request.startDate
                                        ? new Date(
                                            request.startDate
                                          ).toLocaleDateString()
                                        : "N/A"
                                    } to ${
                                      request.endDate
                                        ? new Date(
                                            request.endDate
                                          ).toLocaleDateString()
                                        : "N/A"
                                    }`
                                  : `${
                                      request.startDate
                                        ? new Date(
                                            request.startDate
                                          ).toLocaleDateString()
                                        : "N/A"
                                    } (${request.startTime || "N/A"} - ${
                                      request.endTime || "N/A"
                                    })`}
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
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(request._id)}
                                    disabled={
                                      request.status !== "Pending" &&
                                      request.status !== "pending"
                                    }
                                    className={`px-3 py-1 rounded ${
                                      request.status === "Pending" ||
                                      request.status === "pending"
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(request._id)}
                                    disabled={
                                      request.status !== "Pending" &&
                                      request.status !== "pending"
                                    }
                                    className={`px-3 py-1 rounded ${
                                      request.status === "Pending" ||
                                      request.status === "pending"
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    Reject
                                  </button>
                                </div>
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

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Download Monthly Leave Report
              </h2>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Employee
                </label>
                <input
                  type="text"
                  value={
                    selectedEmployee
                      ? allEmployees.find((emp) => emp._id === selectedEmployee)
                          ?.name || ""
                      : employeeSearchQuery
                  }
                  onChange={(e) => {
                    setEmployeeSearchQuery(e.target.value);
                    setSelectedEmployee("");
                    setShowEmployeeDropdown(true);
                  }}
                  onFocus={() => setShowEmployeeDropdown(true)}
                  placeholder="Search employee by name..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showEmployeeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {allEmployees
                      .filter((emp) =>
                        emp.name
                          .toLowerCase()
                          .includes(employeeSearchQuery.toLowerCase())
                      )
                      .map((emp) => (
                        <div
                          key={emp._id}
                          onClick={() => {
                            setSelectedEmployee(emp._id);
                            setEmployeeSearchQuery(emp.name);
                            setShowEmployeeDropdown(false);
                          }}
                          className="p-2 hover:bg-blue-50 cursor-pointer"
                        >
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-sm text-gray-600">
                            {emp.position} - {emp.email}
                          </div>
                        </div>
                      ))}
                    {allEmployees.filter((emp) =>
                      emp.name
                        .toLowerCase()
                        .includes(employeeSearchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="p-2 text-gray-500 text-center">
                        No employees found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsReportModalOpen(false);
                    setSelectedEmployee("");
                    setEmployeeSearchQuery("");
                    setShowEmployeeDropdown(false);
                  }}
                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
