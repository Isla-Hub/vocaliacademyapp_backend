import { createAdmin } from "./createAdmin.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB Connected");

    await createAdmin();

    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
