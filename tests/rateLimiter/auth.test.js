import request from "supertest";
import createServer from "../../server";
import User from "../../mongodb/models/user";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { connect, clear, close } from "../config/db";

dotenv.config();

const app = createServer();

describe("Auth limiter", () => {
  let userLogin;
  let hashedPassword;

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
  });

  afterAll(async () => {
    await clear();
    await close();
  });

  test("should return 429 after 20 requests within rate limit window", async () => {
    for (let i = 0; i < 21; i++) {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: userLogin.email, password: "password123" });
      if (i < 20) {
        expect(res.statusCode).toEqual(200);
      } else {
        expect(res.statusCode).toEqual(429);
        expect(res.text).toEqual(
          "You have reached the login attempts limit. Please try again later"
        );
      }
    }
  });
});
