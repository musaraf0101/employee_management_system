import express from "express";
import { generateMonthlyLeaveReport } from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizedRoles } from "../middleware/role.js";

const reportRouter = express.Router();

reportRouter.get(
  "/report/leave-monthly",
  verifyToken,
  authorizedRoles("admin"),
  generateMonthlyLeaveReport
);

export default reportRouter;
