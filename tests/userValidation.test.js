import createServer from "../server";
import User from "../mongodb/models/user";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { clear, close, connect } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newUser = {
  name: "NewUserValidation",
  lastName: "NewUserValidation LastName",
  email: "newuservalidation@example.com",
  phoneNumber: "1234567890",
  avatar:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  dateOfBirth: new Date(),
  role: "student",
  password: "test1234",
};

let user;

beforeAll(async () => {
  await connect();
  user = await User.create({
    name: "TestUserUpdate",
    lastName: "TestUserUpdate LastName",
    email: "testuserupdate@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });
  await user.save();
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createUserValidation", () => {
  test("Empty required fields returns error", async () => {
    const requiredFields = [
      { name: "name", message: "The name field is required." },
      { name: "lastName", message: "The Last Name field is required." },
      { name: "email", message: "The email field is required." },
      { name: "phoneNumber", message: "The Phone number field is required." },
      { name: "dateOfBirth", message: "The date of birth field is required." },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newUser, [field.name]: "" };
      const response = await agent
        .post("/api/v1/users")
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "name",
        value: 1234,
        message: "The name field must be a string.",
      },
      {
        name: "name",
        value: "1234",
        message: "The name field must be between 5 and 50 characters.",
      },
      {
        name: "name",
        value: "The name field must be between 5 and 50 characters.",
        message: "The name field must be between 5 and 50 characters.",
      },
      {
        name: "lastName",
        value: 1234,
        message: "The Last Name field must be a string.",
      },
      {
        name: "lastName",
        value: "w",
        message: "The Last Name field must be between 5 and 50 characters.",
      },
      {
        name: "lastName",
        value:
          "sdfdfsdfgdfgdfgdfgdfgdfgdfgdftwevrrthdyjbfxdvscavrtghyfcdfgtyhnbgvcxsadetryujhnbvcxsadertyjuhmnbv cxsdegtf",
        message: "The Last Name field must be between 5 and 50 characters.",
      },
      {
        name: "password",
        value: "short",
        message: "Password must be at least 8 characters long.",
      },
      { name: "email", value: "invalidemail", message: "Invalid email." },
      {
        name: "avatar",
        value: "invalidavatar",
        message: "Invalid avatar URL.",
      },
      {
        name: "dateOfBirth",
        value: "invaliddate",
        message: "Invalid date format.",
      },
      { name: "role", value: "invalidrole", message: "Invalid role." },
      {
        name: "subscribed.newsletter",
        value: "invalidnewsletter",
        message: "Newsletter subscription must be a boolean value.",
      },
      {
        name: "subscribed.notifications",
        value: "invalidnotifications",
        message: "Notifications subscription must be a boolean value.",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newUser, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/users")
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "email", value: newUser.email },
      { name: "avatar", value: newUser.avatar },
      { name: "dateOfBirth", value: newUser.dateOfBirth.toISOString() },
      { name: "role", value: newUser.role },
    ];
    const requestBody = newUser;
    const response = await agent
      .post("/api/v1/users")
      .send(requestBody)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name]).toBe(field.value);
    }
  });
});

describe("updateUserValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      { name: "name", message: "The name field is required." },
      { name: "lastName", message: "The Last Name field is required." },
      { name: "email", message: "The email field is required." },
      { name: "phoneNumber", message: "The phone number field is required." },
      { name: "dateOfBirth", message: "The date of birth field is required." },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newUser, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/users/${user._id}`)
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });
  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "name",
        value: 1234,
        message: "The name field must be a string.",
      },
      {
        name: "name",
        value: "1234",
        message: "The name field must be between 5 and 50 characters.",
      },
      {
        name: "name",
        value: "The name field must be between 5 and 50 characters.",
        message: "The name field must be between 5 and 50 characters.",
      },
      {
        name: "lastName",
        value: 1234,
        message: "The Last Name field must be a string.",
      },
      {
        name: "lastName",
        value: "w",
        message: "The Last Name field must be between 5 and 50 characters.",
      },
      {
        name: "lastName",
        value:
          "sdfdfsdfgdfgdfgdfgdfgdfgdfgdftwevrrthdyjbfxdvscavrtghyfcdfgtyhnbgvcxsadetryujhnbvcxsadertyjuhmnbv cxsdegtf",
        message: "The Last Name field must be between 5 and 50 characters.",
      },
      {
        name: "password",
        value: "short",
        message: "Password must be at least 8 characters long.",
      },
      { name: "email", value: "invalidemail", message: "Invalid email." },
      {
        name: "avatar",
        value: "invalidavatar",
        message: "Invalid avatar URL.",
      },
      {
        name: "dateOfBirth",
        value: "invaliddate",
        message: "Invalid date format.",
      },
      { name: "role", value: "invalidrole", message: "Invalid role." },
      {
        name: "subscribed.newsletter",
        value: "invalidnewsletter",
        message: "Newsletter subscription must be a boolean value.",
      },
      {
        name: "subscribed.notifications",
        value: "invalidnotifications",
        message: "Notifications subscription must be a boolean value.",
      },
    ];

    const body = {
      name: "TestUserUpdate",
      lastName: "TestUserUpdate LastName",
      email: "testuserupdate@example.com",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "admin",
      password: "test1234",
    };
    for (const field of invalidFields) {
      const requestBody = { ...body, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/users/${user._id}`)
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });
  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "email", value: "testuserupdatenew@example.com" },
      { name: "avatar", value: newUser.avatar },
      { name: "dateOfBirth", value: newUser.dateOfBirth.toISOString() },
      { name: "role", value: newUser.role },
      {
        name: "subscribed",
        value: {
          newsletter: false,
          notifications: false,
        },
      },
    ];
    const requestBody = {
      ...newUser,
      email: "testuserupdatenew@example.com",
      subscribed: { newsletter: false, notifications: false },
    };

    const response = await agent
      .put(`/api/v1/users/${user._id}`)
      .send(requestBody)
      .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});
