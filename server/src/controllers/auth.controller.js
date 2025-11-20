import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import User from "../models/User.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await User.findOne({ email: email }).select("+password");

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(checkUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login success",
      data: {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
        position: checkUser.position,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logout success",
  });
};
