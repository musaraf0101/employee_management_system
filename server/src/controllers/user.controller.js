import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const findUser = async (req, res) => {};
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role, position } = req.body;

    const checkUser = await User.findOne({ email: email });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
      position,
    });

    res.status(201).json({
      success: true,
      message: "User create success",
      data: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position,
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
export const updateUser = async (req, res) => {};
export const deleteUser = async (req, res) => {};
