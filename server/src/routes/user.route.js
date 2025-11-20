import express from "express";
import { addUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/role.js";

const userRouter = express.Router();

userRouter.post("/add-user", authorizedRoles("admin"), verifyToken, addUser);

export default userRouter;
