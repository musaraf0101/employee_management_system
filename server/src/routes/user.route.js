import express from "express";
import {
  addUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/role.js";
import {
  addUserSchema,
  updateUserSchema,
} from "../validation/userValidation.js";
import { validate } from "./../middleware/valitator.js";

const userRouter = express.Router();

userRouter.post(
  "/add-user",
  authorizedRoles("admin"),
  validate(addUserSchema),
  verifyToken,
  addUser
);
userRouter.put(
  "/update-user/:id",
  authorizedRoles("admin", "employee"),
  validate(updateUserSchema),
  verifyToken,
  updateUser
);
userRouter.delete(
  "/user-delete/:id",
  verifyToken,
  authorizedRoles("admin", "employee"),
  deleteUser
);
export default userRouter;
