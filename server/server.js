import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.route.js";
import { DBConnection } from "./src/config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);

DBConnection();
app.listen(3000, () => {
  console.log("server is running");
});

export default app;
