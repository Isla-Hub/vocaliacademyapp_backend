import User from "../../mongodb/models/user.js";

async function createStudent() {
  try {
    const studentUser = new User({
      name: "Student",
      lastName: "User",
      email: "student@myapp.com",
      phoneNumber: "123456789",
      dateOfBirth: new Date(),
      role: "student",
      password: "$2a$10$xuekeeNKlq6UKNBfiWK7betM.13MOs9NPwujDOaOOAkASdW2b/6J6",
    });

    await studentUser.save();
    console.log("Student user created");
  } catch (err) {
    console.log("Error: " + err);
  }
}

export { createStudent };
