import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async (req, res) => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("mongodb connection error", error);
  }
};
