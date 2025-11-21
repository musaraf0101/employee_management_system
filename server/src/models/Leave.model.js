import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["short", "full_day"],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Pending", "approved", "rejected", "pending"],
      default: "Pending",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

leaveSchema.index({ userId: 1 });

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
