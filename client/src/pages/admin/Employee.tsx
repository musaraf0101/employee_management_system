import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const Employee = () => {
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/employees",
          {
            withCredentials: true,
          }
        );
        setAllEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
    <div className="flex min-h-screen bg-gray-100 w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full md:w-auto pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                All Employees
              </h1>
              <button className="w-full sm:w-auto py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Add Employee
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                    className="w-full sm:w-auto py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">Loading employees...</div>
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
                        Name
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Email
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Position
                      </th>
                      <th className="p-2 md:p-3 text-left border-b text-sm md:text-base">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500"
                        >
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {employee.id}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {employee.name}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {employee.email}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            {employee.position}
                          </td>
                          <td className="p-2 md:p-3 border-b text-sm md:text-base">
                            <button className="text-blue-500 hover:text-blue-700 mr-2 md:mr-3 text-sm md:text-base">
                              Edit
                            </button>
                            <button className="text-red-500 hover:text-red-700 text-sm md:text-base">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
