import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userShema);

export default User;
