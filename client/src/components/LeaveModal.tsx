import { useState } from "react";
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LeaveModal = ({ isOpen, onClose, onSuccess }: ModalProps) => {
  const [leaveType, setLeaveType] = useState("full_day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate short leave times
    if (leaveType === "short") {
      if (startTime && endTime && startTime >= endTime) {
        setError("End time must be after start time");
        setLoading(false);
        return;
      }
    }

    // Validate full day dates
    if (leaveType === "full_day") {
      if (startDate && endDate && startDate > endDate) {
        setError("End date must be after or equal to start date");
        setLoading(false);
        return;
      }
    }

    try {
      const leaveData =
        leaveType === "full_day"
          ? { leaveType, startDate, endDate, reason }
          : { leaveType, startDate: new Date().toISOString().split('T')[0], startTime, endTime, reason };

      await axios.post("http://localhost:3000/api/leave", leaveData, {
        withCredentials: true,
      });

      setLeaveType("full_day");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
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
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (error && error.includes("date")) setError("");
                    }}
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (error && error.includes("date")) setError("");
                    }}
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              {startDate && endDate && startDate > endDate && (
                <p className="text-red-500 text-sm">End date must be after or equal to start date</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      if (error && error.includes("time")) setError("");
                    }}
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      if (error && error.includes("time")) setError("");
                    }}
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              {startTime && endTime && startTime >= endTime && (
                <p className="text-red-500 text-sm">End time must be after start time</p>
              )}
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
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-4 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-md cursor-pointer hover:from-blue-500 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;
