import createServer from "../server";
import User from "../mongodb/models/user";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { clear, close, connect } from "./config/db";
import mongoose from "mongoose";

dotenv.config();

const app = createServer();

let agent;

let newUser = {
  name: "NewUser",
  lastName: "NewUser LastName",
  email: "newuser@example.com",
  phoneNumber: "1234567890",
  avatar:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  dateOfBirth: new Date(),
  role: "admin",
  password: "test1234",
};

let user;

beforeAll(async () => {
  await connect();
  user = await User.create({
    name: "TestUser",
    lastName: "TestUser LastName",
    email: "testuser@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });
  agent = await getAuthenticatedAgent(app);
});

beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(async () => {
  await clear();
  await close();
});

describe("POST /api/v1/users", () => {
  it("should create a new user", async () => {
    const response = await agent
      .post("/api/v1/users")
      .send(newUser)
      .expect(201);

    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.lastName).toBe(newUser.lastName);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.phoneNumber).toBe(newUser.phoneNumber);
    expect(response.body.dateOfBirth).toBe(newUser.dateOfBirth.toISOString());
    expect(response.body.role).toBe(newUser.role);
    expect(response.body.subscribed.newsletter).toBe(true);
    expect(response.body.subscribed.notifications).toBe(true);
    expect(response.body.services).toBeInstanceOf(Array);
    expect(response.body.payments).toBeInstanceOf(Array);
    expect(response.body.password).toBeFalsy();

    // Check the data in the database
    const dbUser = await User.findOne({ _id: response.body._id });
    expect(dbUser).toBeTruthy();
    expect(dbUser._id.toString()).toBe(response.body._id);
    expect(dbUser.name).toBe(newUser.name);
    expect(dbUser.lastName).toBe(newUser.lastName);
    expect(dbUser.email).toBe(newUser.email);
    expect(dbUser.phoneNumber).toBe(newUser.phoneNumber);
    expect(dbUser.dateOfBirth.toISOString()).toBe(
      newUser.dateOfBirth.toISOString()
    );
    expect(dbUser.role).toBe(newUser.role);
    expect(dbUser.password).toBeTruthy();
    expect(dbUser.subscribed.newsletter).toBe(true);
    expect(dbUser.subscribed.notifications).toBe(true);
    expect(dbUser.services).toBeInstanceOf(Array);
    expect(dbUser.payments).toBeInstanceOf(Array);
  });
  test("Create user returns 409 when trying to include an email that is already registered", async () => {
    const response = await agent
      .post(`/api/v1/users`)
      .send({ ...newUser, email: "admin@myapp.com" })
      .expect(409);

    expect(response.body.message).toBe(
      "Another user is using the provided email address"
    );
  });
});
describe("GET /api/v1/users", () => {
  it("should return all users", async () => {
    const response = await agent.get("/api/v1/users").expect(200);

    // Check the response
    expect(response.body.length).toBeGreaterThan(0);
    const responseUser = response.body.find((usr) => usr.name === user.name);
    expect(responseUser._id).toBeTruthy();
    expect(responseUser._id).toBe(user._id.toString());
    expect(responseUser.name).toBe(user.name);
    expect(responseUser.lastName).toBe(user.lastName);
    expect(responseUser.email).toBe(user.email);
    expect(responseUser.phoneNumber).toBe(user.phoneNumber);
    expect(responseUser.avatar).toBe(user.avatar);
    expect(responseUser.dateOfBirth).toBe(user.dateOfBirth.toISOString());
    expect(responseUser.role).toBe(user.role);
    expect(responseUser.subscribed.newsletter).toBe(true);
    expect(responseUser.subscribed.notifications).toBe(true);
    expect(responseUser.services).toBeInstanceOf(Array);
    expect(responseUser.payments).toBeInstanceOf(Array);
  });

  it("should return a 404 status and error message when an error occurs", async () => {
    jest.spyOn(User, "find").mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await agent.get("/api/v1/users");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Database error" });
  });
});

describe("GET /api/v1/users/:id", () => {
  it("should return a user", async () => {
    const response = await agent.get(`/api/v1/users/${user._id}`).expect(200);

    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body._id).toBe(user._id.toString());
    expect(response.body.name).toBe(user.name);
    expect(response.body.lastName).toBe(user.lastName);
    expect(response.body.email).toBe(user.email);
    expect(response.body.phoneNumber).toBe(user.phoneNumber);
    expect(response.body.avatar).toBe(user.avatar);
    expect(response.body.dateOfBirth).toBe(user.dateOfBirth.toISOString());
    expect(response.body.role).toBe(user.role);
    expect(response.body.subscribed.newsletter).toBe(true);
    expect(response.body.subscribed.notifications).toBe(true);
    expect(response.body.services).toBeInstanceOf(Array);
    expect(response.body.payments).toBeInstanceOf(Array);
  });

  it("should return a 400 status and error message when given an invalid user ID", async () => {
    const response = await agent.get("/api/v1/users/invalid");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid user ID" });
  });

  it("should return a 404 status and error message when user is not found", async () => {
    jest.spyOn(User, "findById").mockReturnValue(null);

    const response = await agent.get(`/api/v1/users/${user._id}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should return a 500 status and error message when an error occurs", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await agent.get(`/api/v1/users/${user._id}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Database error" });
  });
});

describe("PUT /api/v1/users/:id", () => {
  it("should update a user", async () => {
    const response = await agent
      .put(`/api/v1/users/${user._id}`)
      .send({
        name: "NewName",
      })
      .expect(200);

    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body._id).toBe(user._id.toString());
    expect(response.body.name).toBe("NewName");
    expect(response.body.lastName).toBe(user.lastName);
    expect(response.body.email).toBe(user.email);
    expect(response.body.phoneNumber).toBe(user.phoneNumber);
    expect(response.body.avatar).toBe(user.avatar);
    expect(response.body.dateOfBirth).toBe(user.dateOfBirth.toISOString());
    expect(response.body.role).toBe(user.role);
    expect(response.body.subscribed.newsletter).toBe(true);
    expect(response.body.subscribed.notifications).toBe(true);
    expect(response.body.services).toBeInstanceOf(Array);
    expect(response.body.payments).toBeInstanceOf(Array);
  });
  test("Update user returns 409 when trying to update email with already registered email ", async () => {
    const response = await agent
      .put(`/api/v1/users/${user._id}`)
      .send({ ...newUser, email: "admin@myapp.com" })
      .expect(409);

    expect(response.body.message).toBe(
      "Another user is using the provided email address"
    );
  });
  it("should return a 400 status and error message when given an invalid user ID", async () => {
    const response = await agent
      .put("/api/v1/users/invalid")
      .send({ name: "John Doe" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid user ID" });
  });
  it("should return a 404 status and error message when user is not found", async () => {
    const userId = new mongoose.Types.ObjectId();

    const response = await agent
      .put(`/api/v1/users/${userId}`)
      .send({ name: "John Doe" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should return a 500 status and error message when an error occurs", async () => {
    jest.spyOn(User, "findByIdAndUpdate").mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await agent
      .put(`/api/v1/users/${user._id}`)
      .send({ name: "John Doe" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Database error" });
  });
});

describe("DELETE /api/v1/users/:id", () => {
  it("should delete a user", async () => {
    const response = await agent
      .delete(`/api/v1/users/${user._id}`)
      .expect(200);

    expect(response.body._id).toBeTruthy();
    expect(response.body._id).toBe(user._id.toString());

    const dbUser = await User.findOne({ _id: user._id });
    expect(dbUser).toBeFalsy();
  });

  it("should return a 400 status and error message when given an invalid user ID", async () => {
    const response = await agent.delete("/api/v1/users/invalid");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid user ID" });
  });
  it("should return a 404 status and error message when user is not found", async () => {
    const userId = new mongoose.Types.ObjectId();

    const response = await agent.delete(`/api/v1/users/${userId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should return a 500 status and error message when an error occurs", async () => {
    const userId = new mongoose.Types.ObjectId();
    jest.spyOn(User, "findById").mockReturnValue({ _id: userId });
    jest.spyOn(User, "findByIdAndDelete").mockImplementation(() => {
      throw new Error("Database error");
    });

    const response = await agent.delete(`/api/v1/users/${userId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Database error" });
  });
});
