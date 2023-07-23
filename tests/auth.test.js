import request from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { authenticateToken } from "../middlewares/jwt";

dotenv.config();

const app = createServer();

describe("Auth controller", () => {
  let userLogin;
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
    
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: ["userauthlogin@test.com"] },
    });
    await mongoose.connection.close();
  });

  describe("POST /login", () => {
    test("should return 400 if email or password are missing", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Email and password are required");
    });

    test("should return a 403 status when given an invalid token", () => {
      const req = {
        headers: {
          authorization: "Bearer invalid_token",
        },
      };
      const res = {
        sendStatus: jest.fn(),
      };
      const next = jest.fn();

      jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) => {
          callback(new Error("Invalid token"));
        });

      authenticateToken(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(403);

      jwt.verify.mockRestore();
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


});
