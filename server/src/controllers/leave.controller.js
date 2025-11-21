import Leave from "../models/Leave.model.js";

export const getEmployeeStats = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }

    const myRequests = await Leave.countDocuments({ userId });

    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const monthLeaveCount = await Leave.countDocuments({
      userId,
      startDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      success: true,
      myRequests,
      monthLeaveCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("userId", "name email position");
    
    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

// employee
export const addLeaveRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { leaveType, startDate, endDate, startTime, endTime, reason } =
      req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }

    const newLeave = await Leave.create({
      leaveType,
      startDate,
      endDate,
      startTime,
      endTime,
      reason,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "leave create success",
      data: {
        leaveType: newLeave.leaveType,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        startTime: newLeave.startTime,
        endTime: newLeave.endTime,
        reason: newLeave.reason,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};
export const updateLeaveRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const LeaveId = req.params.id;
    const { leaveType, startDate, endDate, startTime, endTime, reason } =
      req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }
    const leave = await Leave.findOne({ _id: LeaveId, userId });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "leave data not found",
      });
    }

    if (leaveType !== undefined) leave.leaveType = leaveType;
    if (startDate !== undefined) leave.startDate = startDate;
    if (endDate !== undefined) leave.endDate = endDate;
    if (startTime !== undefined) leave.startTime = startTime;
    if (endTime !== undefined) leave.endTime = endTime;
    if (reason !== undefined) leave.reason = reason;

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Update success",
      data: {
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        startTime: leave.startTime,
        endTime: leave.endTime,
        reason: leave.reason,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};
export const deleteLeaveRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const leaveId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }

    const leave = await Leave.findOneAndDelete({ _id: leaveId, userId });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "leave data not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "leave data delete success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};
// admin
export const acceptLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "leave not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "leave approved",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};
export const rejectLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "leave not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "leave rejected",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};
