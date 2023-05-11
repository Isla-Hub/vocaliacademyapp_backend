import mongoose from "mongoose";
import { createAdminUserConnectDB } from "./createAdminUserConnectDB.js";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB Connected");
      // Ejecutar el middleware createAdminUserMiddleware
      const db = mongoose.connection;
      createAdminUserConnectDB(() => {
        console.log("Admin user created");
      });
    })
    .catch((err) => console.error(err));
};

export default connectDB;
