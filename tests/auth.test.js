import request from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

describe("Auth controller", () => {
  let userLogin;
  let userRegister;
  let hashedPassword;

  beforeAll(async () => {
    mongoose.set("strictQuery", true);

    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    hashedPassword = await bcrypt.hash("password123", 10);
    userLogin = await User.create({
      email: "userauthlogin@test.com",
      password: hashedPassword,
      role: "user",
      name: "UserAuthLogin",
      lastName: "UserAuthLogin LastName",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "student",
    });
    userRegister = {
      email: "userauthregister@test.com",
      password: "password123",
      role: "user",
      name: "UserAuthRegister",
      lastName: "UserAuthRegister LastName",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "student",
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: ["userauthlogin@test.com", "userauthregister@test.com"] },
    });
    await mongoose.connection.close();
  });

  describe("POST /login", () => {
    test("should return 400 if email or password are missing", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Email and password are required");
    });

    test("should return 401 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "invalid@test.com", password: "password123" });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid email or password");
    });

    test("should return 400 if password is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: userLogin.email, password: "invalidpassword" });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Invalid password");
    });

    test("should return 200 with a valid email and password and include correct information in the JWT ", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: userLogin.email, password: "password123" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();

      const decodedToken = jwt.decode(res.body.token);
      expect(decodedToken.userId).toEqual(userLogin._id.toString());
      expect(decodedToken.role).toEqual(userLogin.role);
    });

    test("should return 500 if an error occurs", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database error"));
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: userLogin.email, password: "password123" });
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual("Server error");
    });
  });

  describe("Protected routes", () => {
    test("should return a 401 error without authentication", async () => {
      let response = await request(app).get("/api/v1/users");
      expect(response.statusCode).toEqual(401);

      response = await request(app).get("/api/v1/bookings");
      expect(response.statusCode).toEqual(401);

      response = await request(app).get("/api/v1/events");
      expect(response.statusCode).toEqual(401);

      response = await request(app).get("/api/v1/rooms");
      expect(response.statusCode).toEqual(401);

      response = await request(app).get("/api/v1/services");
      expect(response.statusCode).toEqual(401);
    });
  });

  describe("POST /register", () => {
    test("should return 201 if user is registered successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userRegister);

      // Check the response
      expect(response.statusCode).toEqual(201);
      expect(response.body._id).toBeTruthy();
      expect(response.body.name).toBe(userRegister.name);
      expect(response.body.lastName).toBe(userRegister.lastName);
      expect(response.body.email).toBe(userRegister.email);
      expect(response.body.phoneNumber).toBe(userRegister.phoneNumber);
      expect(response.body.dateOfBirth).toBe(
        userRegister.dateOfBirth.toISOString()
      );
      expect(response.body.role).toBe(userRegister.role);
      expect(response.body.subscribed.newsletter).toBe(true);
      expect(response.body.subscribed.notifications).toBe(true);
      expect(response.body.services).toBeInstanceOf(Array);
      expect(response.body.payments).toBeInstanceOf(Array);
      expect(response.body.password).toBeFalsy();

      // Check the data in the database
      const dbUser = await User.findOne({ _id: response.body._id });
      expect(dbUser).toBeTruthy();
      expect(dbUser._id.toString()).toBe(response.body._id);
      expect(dbUser.name).toBe(userRegister.name);
      expect(dbUser.lastName).toBe(userRegister.lastName);
      expect(dbUser.email).toBe(userRegister.email);
      expect(dbUser.phoneNumber).toBe(userRegister.phoneNumber);
      expect(dbUser.dateOfBirth.toISOString()).toBe(
        userRegister.dateOfBirth.toISOString()
      );
      expect(dbUser.role).toBe(userRegister.role);
      expect(dbUser.password).toBeTruthy();
      expect(dbUser.subscribed.newsletter).toBe(true);
      expect(dbUser.subscribed.notifications).toBe(true);
      expect(dbUser.services).toBeInstanceOf(Array);
      expect(dbUser.payments).toBeInstanceOf(Array);
    });

    test("should return 409 if user already exists", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        email: "userauthlogin@test.com",
        password: "password123",
        role: "user",
        name: "UserAuthLogin",
        lastName: "UserAuthLogin LastName",
        phoneNumber: "1234567890",
        dateOfBirth: new Date(),
        role: "student",
      });

      expect(response.statusCode).toEqual(409);
    });

    test("should return 500 if server error occurs", async () => {
      jest.spyOn(User, "create").mockRejectedValue(new Error("Server error"));

      const res = await request(app).post("/api/v1/auth/register").send({
        email: "userauthlogin@test.com",
        password: "password123",
        role: "user",
        name: "UserAuthLogin",
        lastName: "UserAuthLogin LastName",
        phoneNumber: "1234567890",
        dateOfBirth: new Date(),
        role: "student",
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual("Server error");
    });

    test("should return 400 if email or password are missing", async () => {
      let response = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...userRegister, password: null });

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Missing password or email");

      response = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...userRegister, email: null });

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Missing password or email");
    });
  });
});
