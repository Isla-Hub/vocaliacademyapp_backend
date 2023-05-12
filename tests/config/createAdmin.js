import User from "../../mongodb/models/user.js";

async function createAdmin() {
  try {
    const existingUser = await User.findOne({
      role: "admin",
      email: "admin@myapp.com",
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const adminUser = new User({
      name: "Admin",
      lastName: "User",
      email: "admin@myapp.com",
      phoneNumber: "123456789",
      dateOfBirth: new Date(),
      role: "admin",
      password: "$2a$10$xuekeeNKlq6UKNBfiWK7betM.13MOs9NPwujDOaOOAkASdW2b/6J6",
    });

    const savedUser = await adminUser.save();
    console.log("Admin user created");
  } catch (err) {
    console.log("Error: " + err);
  }
}

export { createAdmin };
