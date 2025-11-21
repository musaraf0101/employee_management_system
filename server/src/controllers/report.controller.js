import PDFDocument from "pdfkit";
import Leave from "../models/Leave.model.js";
import User from "../models/User.model.js";

export const generateMonthlyLeaveReport = async (req, res) => {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "userId, month, and year are required",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const leaves = await Leave.find({
      userId: userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=leave-report-${user.name}-${month}-${year}.pdf`
    );
    doc.pipe(res);
    doc.fontSize(20).text("Leave Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Employee Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Position: ${user.position}`);
    doc.text(
      `Report Period: ${new Date(
        year,
        month - 1,
        1
      ).toLocaleDateString()} - ${new Date(
        year,
        month,
        0
      ).toLocaleDateString()}`
    );
    doc.moveDown();
    const totalLeaves = leaves.length;
    const approvedLeaves = leaves.filter((l) => l.status === "approved").length;
    const rejectedLeaves = leaves.filter((l) => l.status === "rejected").length;
    const pendingLeaves = leaves.filter((l) => l.status === "pending").length;

    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12);
    doc.text(`Total Leave Requests: ${totalLeaves}`);
    doc.text(`Approved: ${approvedLeaves}`);
    doc.text(`Rejected: ${rejectedLeaves}`);
    doc.text(`Pending: ${pendingLeaves}`);
    doc.moveDown();
    if (leaves.length > 0) {
      doc.fontSize(14).text("Leave Details", { underline: true });
      doc.moveDown(0.5);

      leaves.forEach((leave, index) => {
        doc.fontSize(11);
        doc.text(`${index + 1}. Leave Type: ${leave.leaveType}`);

        if (leave.leaveType === "full-day") {
          doc.text(
            `   Date: ${new Date(
              leave.startDate
            ).toLocaleDateString()} to ${new Date(
              leave.endDate
            ).toLocaleDateString()}`
          );
        } else {
          doc.text(`   Time: ${leave.startTime} to ${leave.endTime}`);
        }

        doc.text(`   Reason: ${leave.reason}`);
        doc.text(`   Status: ${leave.status.toUpperCase()}`);
        doc.text(
          `   Applied on: ${new Date(leave.createdAt).toLocaleDateString()}`
        );
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(12).text("No leave records found for this period.");
    }

    // Footer
    doc
      .fontSize(10)
      .text(
        `Generated on: ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 50,
        { align: "center" }
      );
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};
