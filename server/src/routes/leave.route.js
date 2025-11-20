import express from "express";
import {
  acceptLeaveRequest,
  addLeaveRequest,
  deleteLeaveRequest,
  rejectLeaveRequest,
  updateLeaveRequest,
} from "../controllers/leave.controller.js";
import { authorizedRoles } from "./../middleware/role.js";
import { verifyToken } from "./../middleware/verifyToken.js";

const leaveRouter = express.Router();

leaveRouter.post(
  "/leave",
  verifyToken,
  authorizedRoles("admin", "employee"),
  addLeaveRequest
);
leaveRouter.put(
  "/leave/:id",
  verifyToken,
  authorizedRoles("admin", "employee"),
  updateLeaveRequest
);
leaveRouter.delete(
  "/leave/:id",
  verifyToken,
  authorizedRoles("admin", "employee"),
  deleteLeaveRequest
);
leaveRouter.put(
  "/leave/approve/:id",
  verifyToken,
  authorizedRoles("admin"),
  acceptLeaveRequest
);
leaveRouter.put(
  "/leave/rejected/:id",
  verifyToken,
  authorizedRoles("admin"),
  rejectLeaveRequest
);

export default leaveRouter;
