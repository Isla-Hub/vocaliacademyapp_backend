import User from "../../mongodb/models/user.js";

async function createAdmin() {
  try {
    const adminUser = new User({
      name: "Admin",
      lastName: "User",
      email: "admin@myapp.com",
      phoneNumber: "123456789",
      dateOfBirth: new Date(),
      role: "admin",
      password: "$2a$10$xuekeeNKlq6UKNBfiWK7betM.13MOs9NPwujDOaOOAkASdW2b/6J6",
    });

    await adminUser.save();
    console.log("Admin user created");
  } catch (err) {
    console.log("Error: " + err);
  }
}

export { createAdmin };