import supertest from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

const newRoom = {
  name: "Room 1",
  features: ["Feature 1", "Feature 2", "Feature 3"],
};

let user;
let room;

beforeAll(async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  user = await User.create({
    name: "User1",
    lastName: "User1lastName",
    email: "user1@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });
  room = await Room.create({
    name: "TestRoom",
    features: ["test feature 1", "test feature 2"],
    createdBy: user._id,
  });
  newRoom.createdBy = user._id;
});

afterAll(async () => {
  await User.deleteMany({ email: "user1@example.com" });
  await Room.deleteMany({ name: { $in: [room.name, newRoom.name] } });
  await mongoose.connection.close();
});

describe("POST /api/v1/rooms", () => {
  it("should create a new room", async () => {
    await supertest(app)
      .post("/api/v1/rooms")
      .send(newRoom)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(newRoom.name);
        expect(response.body.createdAt).toBeTruthy();
        expect(response.body.createdBy).toBe(newRoom.createdBy.toString());
        expect(response.body.features).toBeInstanceOf(Array);
        expect(response.body.features.length).toBe(newRoom.features.length);
        expect(response.body.features).toEqual(newRoom.features);

        // Check the data in the database
        const dbRoom = await Room.findOne({ _id: response.body._id });
        expect(dbRoom).toBeTruthy();
        expect(dbRoom._id.toString()).toBe(response.body._id);
        expect(dbRoom.name).toBe(newRoom.name);
        expect(dbRoom.createdAt).toBeTruthy();
        expect(dbRoom.createdBy.toString()).toBe(newRoom.createdBy.toString());
        expect(dbRoom.features).toBeInstanceOf(Array);
        expect(dbRoom.features.length).toBe(newRoom.features.length);
        expect(dbRoom.features).toEqual(newRoom.features);
      });
  });
});

describe("GET /api/v1/rooms", () => {
  it("should return all rooms", async () => {
    await supertest(app)
      .get("/api/v1/rooms")
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.length).toBeGreaterThan(0);
        const responseRoom = response.body.find(
          (item) => item.name === room.name
        );
        expect(responseRoom._id).toBeTruthy();
        expect(responseRoom._id).toBe(room._id.toString());
        expect(responseRoom.name).toBe(room.name);
        expect(responseRoom.createdAt).toBe(room.createdAt.toISOString());
        expect(responseRoom.createdBy).toBe(room.createdBy.toString());
        expect(responseRoom.features).toBeInstanceOf(Array);
        expect(responseRoom.features.length).toBe(room.features.length);
        expect(responseRoom.features).toEqual(room.features);
      });
  });
});

describe("GET /api/v1/rooms/:id", () => {
  it("should return a room", async () => {
    await supertest(app)
      .get(`/api/v1/rooms/${room._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response

        expect(response.body._id).toBeTruthy();
        expect(response.body._id).toBe(room._id.toString());
        expect(response.body.name).toBe(room.name);
        expect(response.body.createdAt).toBe(room.createdAt.toISOString());
        expect(response.body.createdBy).toBe(room.createdBy.toString());
        expect(response.body.features).toBeInstanceOf(Array);
        expect(response.body.features.length).toBe(room.features.length);
        expect(response.body.features).toEqual(room.features);
      });
  });
});

describe("PUT /api/v1/rooms/:id", () => {
  it("should update a room", async () => {
    await supertest(app)
      .put(`/api/v1/rooms/${room._id}`)
      .send({ features: ["Updated feature 1", "Updated feature 2"] })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body._id).toBe(room._id.toString());
        expect(response.body.name).toBe(room.name);
        expect(response.body.createdAt).toBe(room.createdAt.toISOString());
        expect(response.body.createdBy).toBe(room.createdBy.toString());
        expect(response.body.features).toBeInstanceOf(Array);
        expect(response.body.features.length).toBe(room.features.length);
        expect(response.body.features).toEqual([
          "Updated feature 1",
          "Updated feature 2",
        ]);
      });
  });
});

describe("DELETE /api/v1/rooms/:id", () => {
  it("should delete a room", async () => {
    await supertest(app)
      .delete(`/api/v1/rooms/${room._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body._id).toBe(room._id.toString());
      });

    let dbRoom = await Room.findOne({ _id: room._id });
    expect(dbRoom).toBeFalsy();
  });
});
