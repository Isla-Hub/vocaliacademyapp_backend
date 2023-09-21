import request from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { connect, clear, close } from "./config/db";

dotenv.config();

const app = createServer();

describe("Auth controller", () => {
  let userLogin;
  let hashedPassword;
  let userWithExpiredToken;

  let refreshToken;

  beforeAll(async () => {
    await connect();
    hashedPassword = await bcrypt.hash("password123", 10);
    userLogin = await User.create({
      email: "userauthlogin@test.com",
      password: hashedPassword,
      name: "UserAuthLogin",
      lastName: "UserAuthLogin LastName",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "student",
    });
    await userLogin.save();

    userWithExpiredToken = await User.create({
      email: "userauthexpired@test.com",
      password: hashedPassword,
      name: "UserAuthExpired",
      lastName: "UserAuthExpired LastName",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "student",
    });
    await userWithExpiredToken.save();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await clear();
    await close();
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
      expect(res.body.expiresIn).toBeDefined();
      expect(res.body.userId).toEqual(userLogin._id.toString());
      expect(res.body.refreshToken).toBeDefined();

      const decodedToken = jwt.decode(res.body.token);
      expect(decodedToken.userId).toEqual(userLogin._id.toString());
      expect(decodedToken.role).toEqual(userLogin.role);

      refreshToken = res.body.refreshToken;
    });
    test("should return 401 if user account is deactivated", async () => {
      await User.updateOne({ _id: userLogin._id }, { isActive: false });
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: userLogin.email, password: "password123" });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("User account is deactivated");

      await User.updateOne({ _id: userLogin._id }, { isActive: true });
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

  describe("POST /refreshToken", () => {
    test("should return a 401 error if refresh token is invalid", async () => {
      const res = await request(app).post("/api/v1/auth/refreshToken").send({});
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid refresh token");
    });

    test("should return 500 if an error occurs", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database error"));
      const res = await request(app)
        .post("/api/v1/auth/refreshToken")
        .send({ refreshToken });
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual("Server error");
    });

    test("should return 401 if user account is deactivated", async () => {
      await User.updateOne({ _id: userLogin._id }, { isActive: false });
      const res = await request(app)
        .post("/api/v1/auth/refreshToken")
        .send({ refreshToken });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid user information");
      await User.updateOne({ _id: userLogin._id }, { isActive: true });
    });

    test("should return 401 if user role is invalid", async () => {
      await User.updateOne({ _id: userLogin._id }, { role: "instructor" });
      const res = await request(app)
        .post("/api/v1/auth/refreshToken")
        .send({ refreshToken });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid user information");
      await User.updateOne({ _id: userLogin._id }, { role: "student" });
    });

    test("should return 200 if user exists in DB, user is active, user role is valid and refresh token is correct", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refreshToken")
        .send({ refreshToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.expiresIn).toBeDefined();
      expect(res.body.userId).toEqual(userLogin._id.toString());
      expect(res.body.refreshToken).toBeDefined();

      const decodedToken = jwt.decode(res.body.token);
      expect(decodedToken.userId).toEqual(userLogin._id.toString());
      expect(decodedToken.role).toEqual(userLogin.role);

      refreshToken = res.body.refreshToken;
    });

    test("should return 401 if user not found", async () => {
      await User.findByIdAndDelete(userLogin._id);
      const res = await request(app)
        .post("/api/v1/auth/refreshToken")
        .send({ refreshToken });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid user information");
    });
  });
});
