import mongoose from "mongoose";
import User from "./models/user.js";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

  async function createAdmin() {
    try {
      if (await User.findOne({ correo: "admin@myapp.com" })) return;
      const adminUser = new User({
        name: "Admin",
        lastName: "User",
        email: "admin@myapp.com",
        phoneNumber: "123456789",
        dateOfBirth: new Date(),
        role: "admin",
        password:
          "$2a$10$xuekeeNKlq6UKNBfiWK7betM.13MOs9NPwujDOaOOAkASdW2b/6J6",
      });

      await adminUser.save();
      console.log("Admin user created");
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  createAdmin();
};

export default connectDB;
