import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";

const Employee = () => {
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    position: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/employees`,
          {
            withCredentials: true,
          }
        );

        const employees = response.data.data || response.data;
        setAllEmployees(employees);
        toast.success(`Loaded ${employees.length} employees`);
      } catch (error: any) {
        console.error("Error fetching employees:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);

        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch employees";
        toast.error(errorMsg);
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

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingEmployeeId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      position: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee: any) => {
    setIsEditMode(true);
    setEditingEmployeeId(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: "",
      role: employee.role,
      position: employee.position,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      return toast.error("Name, email, and role are required");
    }

    if (!isEditMode && (!formData.password || formData.password.length < 8)) {
      return toast.error("Password must be at least 8 characters");
    }

    if (isEditMode && formData.password && formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      if (isEditMode) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          position: formData.position,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await axios.put(
          `${API_BASE_URL}/api/update-user/${editingEmployeeId}`,
          updateData,
          { withCredentials: true }
        );

        toast.success("Employee updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/add-user`, formData, {
          withCredentials: true,
        });

        toast.success("Employee added successfully!");
      }
      const updatedResponse = await axios.get(
        `${API_BASE_URL}/api/admin/employees`,
        { withCredentials: true }
      );
      setAllEmployees(updatedResponse.data.data || updatedResponse.data);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        position: "",
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingEmployeeId(null);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} employee`;
      toast.error(errorMsg);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleOpenDeleteModal = (employeeId: string, employeeName: string) => {
    setEmployeeToDelete({ id: employeeId, name: employeeName });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/user-delete/${employeeToDelete.id}`,
        {
          withCredentials: true,
        }
      );

      toast.success("Employee deleted successfully!");

      const updatedResponse = await axios.get(
        `${API_BASE_URL}/api/admin/employees`,
        { withCredentials: true }
      );
      setAllEmployees(updatedResponse.data.data || updatedResponse.data);

      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete employee";
      toast.error(errorMsg);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

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
              <button
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
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
                            <tr key={employee._id} className="hover:bg-gray-50">
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
                                <button
                                  onClick={() => handleOpenEditModal(employee)}
                                  className="text-blue-500 hover:text-blue-700 mr-2 md:mr-3 text-sm md:text-base"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleOpenDeleteModal(
                                      employee._id,
                                      employee.name
                                    )
                                  }
                                  className="text-red-500 hover:text-red-700 text-sm md:text-base"
                                >
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{employeeToDelete?.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Employee" : "Add Employee"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditingEmployeeId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {isEditMode && "(leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    isEditMode
                      ? "Enter new password (optional)"
                      : "Enter password"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter position"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditingEmployeeId(null);
                  }}
                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isEditMode ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
