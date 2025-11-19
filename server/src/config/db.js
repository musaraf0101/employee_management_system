import mongoose from "mongoose";

export const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (error) {
    console.error(error.message);
  }
};
