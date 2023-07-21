import createServer from "../server";
import Room from "../mongodb/models/room";
import User from "../mongodb/models/user";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";

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

let newRoom = {
  name: "NewRoomValidation",
  createdAt: new Date(),
  features: ["feature1", "feature2"],
};

let room;

beforeAll(async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let user = await User.create({
    name: "TestUserUpdate",
    lastName: "TestUserUpdate LastName",
    email: "testuserupdate@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });
  room = await Room.create({
    name: "RommValidation",
    createdAt: new Date(),
    features: ["feature3", "feature4"],
    createdBy: user._id,
  });

  newRoom.createdBy = room.createdBy;

  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("createRoomValidation", () => {
  test("Empty required fields returns error", async () => {
    const requiredFields = [
      { name: "name", message: "Name is required" },
      { name: "createdBy", message: "Created By is required" },
      { name: "features", message: "Features must be an array" },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newRoom, [field.name]: "" };
      const response = await agent
        .post("/api/v1/rooms")
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
        name: "features",
        value: "string",
        message: "Features must be an array",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newRoom, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/rooms")
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "name", value: newRoom.name },
      { name: "createdBy", value: newRoom.createdBy.toString() },
      { name: "features", value: newRoom.features },
    ];
    const requestBody = newRoom;
    const response = await agent
      .post("/api/v1/rooms")
      .send(requestBody)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name]).toStrictEqual(field.value);
    }
  });
});

describe("updateRoomValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      { name: "name", message: "Name is required" },
      { name: "createdBy", message: "Created By is required" },
      { name: "features", message: "Features must be an array" },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newRoom, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/rooms/${room._id}`)
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
        name: "features",
        value: "string",
        message: "Features must be an array",
      },
    ];

    const body = {
      name: "RoomUpdateValidation",
      features: ["feature1", "feature2"],
      createdBy: room.createdBy,
    };
    for (const field of invalidFields) {
      const requestBody = { ...body, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/rooms/${room._id}`)
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });
  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "name", value: newRoom.name },
      { name: "createdBy", value: newRoom.createdBy.toString() },
      { name: "features", value: newRoom.features },
    ];
    const requestBody = {
      ...newRoom,
      name: "RoomUpdate",
      features: ["featureA", "featureB"],
    };

    const response = await agent
      .put(`/api/v1/rooms/${room._id}`)
      .send(requestBody)
      .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });

  test("Update room returns 409 when trying to update name with already registered name ", async () => {
    const response = await agent
      .put(`/api/v1/rooms/${room._id}`)
      .send({ ...newRoom, name: room.name })
      .expect(409);

    expect(response.body.message).toBe("Room's name already exists");
  });
});
