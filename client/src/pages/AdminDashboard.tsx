import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-purple-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800">
                  Total Employees
                </h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800">
                  Total Leave Employees
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              </div>
              <div className="bg-red-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-800">
                  Pending Request
                </h3>
                <p className="text-3xl font-bold text-red-600 mt-2">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
