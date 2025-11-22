import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import { DBConnection } from "./src/config/db.js";
import userRouter from "./src/routes/user.route.js";
import leaveRouter from "./src/routes/leave.route.js";
import reportRouter from "./src/routes/report.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", leaveRouter);
app.use("/api", reportRouter);

DBConnection();
app.listen(3000, () => {
  console.log("server is running");
});

export default app;
