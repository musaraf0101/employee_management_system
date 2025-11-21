import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

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
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, position } = req.body;

    const existUser = await User.findById(id);

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "user not exist",
      });
    }

    if (name) existUser.name = name;
    if (email) existUser.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      existUser.password = await bcrypt.hash(password, salt);
    }
    if (position) existUser.position = position;

    await existUser.save();

    res.status(200).json({
      success: true,
      message: "Update user data success",
      data: {
        name: existUser.name,
        email: existUser.email,
        position: existUser.position,
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
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await User.findByIdAndDelete(id);

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "user data delete success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};
