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

  beforeAll(async () => {
    await connect();
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
    await userLogin.save();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await clear();
    await close();
  });

  describe("Auth rate-limiter", () => {
    test("should return 429 after 20 requests within rate limit window", async () => {
      jest.setTimeout(50000);
      for (let i = 0; i < 21; i++) {
        const res = await request(app)
          .post("/api/v1/auth/login")
          .send({ email: userLogin.email, password: "password123" })
        if (i < 20) {
          expect(res.statusCode).toEqual(200);
        } else {
          expect(res.statusCode).toEqual(429);
          expect(res.body.message).toEqual(
            "Too many requests from this IP, please try again later"
          );
        }
      }
    });
  });
});
