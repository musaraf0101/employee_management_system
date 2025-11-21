import { useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import LeaveModal from "../../components/LeaveModal";

const EmployeeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-4 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-md cursor-pointer hover:from-blue-500 hover:to-blue-700 transition"
              >
                New Request
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800">
                  My Request
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800">
                  This Month Leave Count
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LeaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EmployeeDashboard;
