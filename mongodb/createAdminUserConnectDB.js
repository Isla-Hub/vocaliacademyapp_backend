import User from "./models/user.js";

function createAdminUserConnectDB() {
  User.findOne({ role: "admin", email: "admin@myapp.com" }, (err, user) => {
    if (err) {
      return console.log("Error: " + err);
    }

    if (user) {
      return console.log("Admin user already exists");
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

    adminUser.save((err, user) => {
      if (err) {
        return console.log("Error: " + err);
      }

      console.log(`Admin user created`);
    });
  });
}

export { createAdminUserConnectDB };
