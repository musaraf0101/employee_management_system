import express from "express";
import {
  addUser,
  deleteUser,
  updateUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/role.js";
import {
  addUserSchema,
  updateUserSchema,
} from "../validation/userValidation.js";
import { validate } from "./../middleware/valitator.js";

const userRouter = express.Router();

userRouter.get(
  "/admin/employees",
  verifyToken,
  authorizedRoles("admin"),
  getAllUsers
);

userRouter.post(
  "/add-user",
  verifyToken,
  authorizedRoles("admin"),
  validate(addUserSchema),
  addUser
);
userRouter.put(
  "/update-user/:id",
  verifyToken,
  authorizedRoles("admin", "employee"),
  validate(updateUserSchema),
  updateUser
);
userRouter.delete(
  "/user-delete/:id",
  verifyToken,
  authorizedRoles("admin", "employee"),
  deleteUser
);
export default userRouter;
