import { createAdmin } from "./createAdmin.js";
import { createStudent } from "./createStudent.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import resetCollections from "./resetCollections.js";

dotenv.config();

export default async () => {
  console.log("Setting up testing environment...");
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB Connected");
    await resetCollections();
    await createAdmin();
    await createStudent();

    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
  console.log("Testing environment setup complete.");
};
