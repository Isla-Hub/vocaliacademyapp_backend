import createServer from "../server";
import User from "../mongodb/models/user";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import {
  getAuthenticatedAgent,
  getAuthenticatedStudentUser,
} from "./utils/authentication";

dotenv.config();

const app = createServer();

let userWithValidRole;

let userWithInvalidRole;

let user;

beforeAll(async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  user = await User.create({
    name: "TestUser",
    lastName: "TestUser LastName",
    email: "testuser@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  userWithValidRole = await getAuthenticatedAgent(app);

  userWithInvalidRole = await getAuthenticatedStudentUser(app);
});

beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/v1/users", () => {
  it("should return all users", async () => {
    const response = await userWithValidRole.get("/api/v1/users").expect(200);

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

  it("should return a 401 status if the user rol is not allowed", async () => {
    const response = await userWithInvalidRole.get("/api/v1/users").expect(401);
  });
});
