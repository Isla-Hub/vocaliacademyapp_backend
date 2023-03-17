import request from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

describe("Login controller", () => {
  let user;

  beforeAll(async () => {
    mongoose.set("strictQuery", true);

    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const hashedPassword = await bcrypt.hash("password123", 10);
    user = await User.create({
      email: "userauth@test.com",
      password: hashedPassword,
      role: "user",
      name: "UserAuth",
      lastName: "UserAuth LastName",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "student",
    });
  });

  afterAll(async () => {
    await User.findByIdAndDelete(user._id);
    await mongoose.connection.close();
  });

  describe("POST /login", () => {
    test("should return 400 if email or password are missing", async () => {
      const res = await request(app).post("/api/v1/auth").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Email and password are required");
    });

    test("should return 401 if email is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth")
        .send({ email: "invalid@test.com", password: "password123" });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid email or password");
    });

    test("should return 400 if password is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth")
        .send({ email: user.email, password: "invalidpassword" });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Invalid password");
    });

    test("should return 200 with a valid email and password and include correct information in the JWT ", async () => {
      const res = await request(app)
        .post("/api/v1/auth")
        .send({ email: user.email, password: "password123" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();

      const decodedToken = jwt.decode(res.body.token);
      expect(decodedToken.userId).toEqual(user._id.toString());
      expect(decodedToken.role).toEqual(user.role);
    });

    test("should return 500 if an error occurs", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database error"));
      const res = await request(app)
        .post("/api/v1/auth")
        .send({ email: user.email, password: "password123" });
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
