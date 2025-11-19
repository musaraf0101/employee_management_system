import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { validate } from "./../middleware/valitator.js";
import { loginSchema } from "./../validation/authValidation.js";
import { loginLimit } from "../middleware/rateLimit.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = express.Router();

authRouter.post("/login", loginLimit, validate(loginSchema), login);
authRouter.post("/logout", verifyToken, logout);

export default authRouter;
