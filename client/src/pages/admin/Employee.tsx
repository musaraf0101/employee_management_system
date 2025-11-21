import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const Employee = () => {
  const allEmployees = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      position: "Developer",
      role: "employee",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      position: "Designer",
      role: "employee",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      position: "Manager",
      role: "admin",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      position: "Developer",
      role: "employee",
    },
    {
      id: 5,
      name: "Tom Brown",
      email: "tom@example.com",
      position: "Team Lead",
      role: "admin",
    },
  ];

  const [filterPosition, setFilterPosition] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const positions = [...new Set(allEmployees.map((emp) => emp.position))];
  const roles = [...new Set(allEmployees.map((emp) => emp.role))];

  const filteredEmployees = allEmployees.filter((employee) => {
    const matchPosition =
      filterPosition === "" || employee.position === filterPosition;
    const matchRole = filterRole === "" || employee.role === filterRole;
    const matchSearch =
      searchQuery === "" ||
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPosition && matchRole && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                All Employees
              </h1>
              <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Add Employee
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Position
                </label>
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Positions</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {(filterPosition || filterRole || searchQuery) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterPosition("");
                      setFilterRole("");
                      setSearchQuery("");
                    }}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border-b">ID</th>
                    <th className="p-3 text-left border-b">Name</th>
                    <th className="p-3 text-left border-b">Email</th>
                    <th className="p-3 text-left border-b">Position</th>
                    <th className="p-3 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{employee.id}</td>
                        <td className="p-3 border-b">{employee.name}</td>
                        <td className="p-3 border-b">{employee.email}</td>
                        <td className="p-3 border-b">{employee.position}</td>
                        <td className="p-3 border-b">
                          <button className="text-blue-500 hover:text-blue-700 mr-3">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            Delete
                          </button>
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

export default Employee;
