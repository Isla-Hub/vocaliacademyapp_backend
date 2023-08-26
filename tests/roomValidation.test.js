import createServer from "../server.js";
import User from "../mongodb/models/user.js";
import Room from "../mongodb/models/room.js";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication.js";
import { connect, clear, close } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newRoom = {
  name: "NewRoomValidation",
  features: ["Feature 1", "Feature 2", "Feature 3"],
};

let admin;
let room;

beforeAll(async () => {
  await connect();

  admin = await User.create({
    name: "AdminRoomValidation",
    lastName: "AdminRoomValidationLastName",
    email: "adminroomvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  await admin.save();

  room = await Room.create({
    name: "TestRoomValdiation",
    createdBy: admin._id,
    features: ["Feature 1", "Feature 2", "Feature 3"],
  });
  await room.save();

  newRoom.createdBy = admin._id;

  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createRoomValidation", () => {
  test("Empty required fields return error", async () => {
    const requiredFields = [
      { name: "name", message: "The name field is required." },
      { name: "createdBy", message: "The createdBy field is required." },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newRoom, [field.name]: "" };
      const response = await agent
        .post("/api/v1/rooms")
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "name",
        value: "A name that is super long and the length is greater than 50",
        message: "The name field must be at most 50 characters long.",
      },
      {
        name: "createdBy",
        value: "1234",
        message: "The createdBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "features",
        value: "Feature 1",
        message: "The features field must be an array.",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newRoom, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/rooms")
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    const validFields = [
      { name: "name", value: newRoom.name },
      { name: "createdBy", value: newRoom.createdBy },
      { name: "features", value: newRoom.features },
    ];

    const requestBody = newRoom;
    const response = await agent
      .post("/api/v1/rooms")
      .send(requestBody)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});

describe("updateRoomValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      { name: "", message: "The name field cannot be empty." },
      {
        name: "",
        message: "The createdBy field cannot be empty.",
      },
      {
        name: "",
        message: "The createdAt field cannot be empty.",
      },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newRoom, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/rooms/${room._id}`)
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });
  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "name",
        value: "A name that is super long and the length is greater than 50",
        message: "The name field must be at most 50 characters long.",
      },
      {
        name: "createdBy",
        value: "1234",
        message: "The createdBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "features",
        value: "Feature 1",
        message: "The features field must be an array.",
      },
    ];

    const body = {
      name: "TestRoomValdiation",
      createdBy: admin._id,
      features: ["Feature 1", "Feature 2", "Feature 3"],
    };
    for (const field of invalidFields) {
      const requestBody = { ...body, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/rooms/${room._id}`)
        .send(requestBody)
        .expect(400);
      expect(response.body.errors.some((error) => error.msg === field.message));

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "name", value: "Test Room" },
      { name: "createdBy", value: admin._id.toString() },
      { name: "features", value: ["Feature 1", "Feature 2", "Feature 3"] },
    ];
    let requestBody = {};

    for (let field of validFields) {
      requestBody[field.name] = field.value;
    }

    const response = await agent
      .put(`/api/v1/rooms/${room._id}`)
      .send(requestBody);
    // .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});
