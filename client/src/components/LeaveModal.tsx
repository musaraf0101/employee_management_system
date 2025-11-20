import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaveModal = ({ isOpen, onClose }: ModalProps) => {
  const [leaveType, setLeaveType] = useState("full_day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const leaveData =
      leaveType === "full_day"
        ? { leaveType, startDate, endDate, reason }
        : { leaveType, startTime, endTime, reason };

    console.log("Leave Request:", leaveData);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Leave Request</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="short">Short Leave</option>
            <option value="full_day">Full Day Leave</option>
          </select>
          {leaveType === "full_day" ? (
            <div className="flex gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}
          <textarea
            placeholder="Reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            required
          />
          <button
            type="submit"
            className="py-3 px-4 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-md cursor-pointer hover:from-blue-500 hover:to-blue-700 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;
