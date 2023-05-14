import createServer from "../server";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import Event from "../mongodb/models/event";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication.js";

dotenv.config();

const app = createServer();

let agent;

let newEvent = {
  name: "NewEvent",
  date: new Date(),
  eventGroupSize: 2,
  categories: ["dance", "music"],
  internalPrice: 20,
  externalPrice: 30,
};
let instructor;
let admin;
let student;
let room;
let event;

beforeAll(async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  instructor = await User.create({
    name: "InstructorEvent",
    lastName: "IntructorEvent LastName",
    email: "instructorevent@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });
  admin = await User.create({
    name: "AdminEventt",
    lastName: "AdminEvent LastName",
    email: "admineventexample.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  student = await User.create({
    name: "UserEvent",
    lastName: "UserEvent LastName",
    email: "usereventexample.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  room = await Room.create({
    name: "RoomEvent",
    features: ["mirrors", "speakers"],
    createdBy: admin._id,
  });
  event = await Event.create({
    name: "TestEvent",
    date: new Date(),
    instructedBy: instructor._id,
    createdBy: admin._id,
    room: room._id,
    eventGroupSize: 3,
    isPublic: true,
    categories: ["sing", "music"],
    level: "intermediate",
    internalPrice: 20,
    externalPrice: 30,
  });
  newEvent.instructedBy = instructor._id;
  newEvent.room = room._id;
  newEvent.createdBy = admin._id;
  newEvent.internalAtendants = [student._id];
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/events", () => {
  it("should create a new event", async () => {
    const response = await agent
      .post("/api/v1/events")
      .send(newEvent)
      .expect(201);
    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.name).toBe(newEvent.name);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.createdBy).toBe(newEvent.createdBy.toString());
    expect(response.body.instructedBy).toBe(newEvent.instructedBy.toString());
    expect(response.body.room).toBe(newEvent.room.toString());
    expect(response.body.eventGroupSize).toBe(newEvent.eventGroupSize);
    expect(response.body.isPublic).toBe(false);
    expect(response.body.categories).toStrictEqual(newEvent.categories);
    expect(response.body.level).toBe("beginner");
    expect(response.body.internalPrice).toBe(newEvent.internalPrice);
    expect(response.body.externalPrice).toBe(newEvent.externalPrice);
    expect(response.body.internalAtendants).toBeInstanceOf(Array);
    expect(response.body.internalAtendants).toHaveLength(1);
    expect(response.body.internalAtendants[0]).toBe(
      newEvent.internalAtendants[0].toString()
    );
    expect(response.body.externalAtendants).toBeInstanceOf(Array);

    // Check the data in the database
    const dbEvent = await Event.findOne({ _id: response.body._id });
    expect(dbEvent).toBeTruthy();
    expect(dbEvent._id.toString()).toBe(response.body._id);
    expect(dbEvent.name).toBe(newEvent.name);
    expect(dbEvent.createdAt).toBeTruthy();
    expect(dbEvent.createdBy.toString()).toBe(newEvent.createdBy.toString());
    expect(dbEvent.instructedBy.toString()).toBe(
      newEvent.instructedBy.toString()
    );
    expect(dbEvent.room.toString()).toBe(newEvent.room.toString());
    expect(dbEvent.eventGroupSize).toBe(newEvent.eventGroupSize);
    expect(dbEvent.isPublic).toBe(false);
    expect(dbEvent.categories).toStrictEqual(newEvent.categories);
    expect(dbEvent.level).toBe("beginner");
    expect(dbEvent.internalPrice).toBe(newEvent.internalPrice);
    expect(dbEvent.externalPrice).toBe(newEvent.externalPrice);
    expect(dbEvent.internalAtendants).toBeInstanceOf(Array);
    expect(dbEvent.internalAtendants).toHaveLength(1);
    expect(dbEvent.internalAtendants[0].toString()).toBe(
      newEvent.internalAtendants[0].toString()
    );
    expect(dbEvent.externalAtendants).toBeInstanceOf(Array);
  });
});

describe("GET /api/v1/events", () => {
  it("should return all events", async () => {
    const response = await agent.get("/api/v1/events").expect(200);
    // Check the response
    expect(response.body.length).toBeGreaterThan(0);
    const responseEvent = response.body.find(
      (item) => item.name === event.name
    );

    expect(responseEvent._id).toBe(event._id.toString());
    expect(responseEvent.name).toBe(event.name);
    expect(responseEvent.createdAt).toBeTruthy();
    expect(responseEvent.createdBy).toBe(event.createdBy.toString());
    expect(responseEvent.instructedBy).toBe(event.instructedBy.toString());
    expect(responseEvent.room).toBe(event.room.toString());
    expect(responseEvent.eventGroupSize).toBe(event.eventGroupSize);
    expect(responseEvent.isPublic).toBe(event.isPublic);
    expect(responseEvent.categories).toStrictEqual(event.categories);
    expect(responseEvent.level).toBe(event.level);
    expect(responseEvent.internalPrice).toBe(event.internalPrice);
    expect(responseEvent.externalPrice).toBe(event.externalPrice);
    expect(responseEvent.internalAtendants).toBeInstanceOf(Array);
    expect(responseEvent.externalAtendants).toBeInstanceOf(Array);
  });
});

describe("GET /api/v1/events/:id", () => {
  it("should return a event", async () => {
    const response = await agent.get(`/api/v1/events/${event._id}`).expect(200);
    // Check the response

    expect(response.body._id).toBe(event._id.toString());
    expect(response.body.name).toBe(event.name);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.createdBy).toBe(event.createdBy.toString());
    expect(response.body.instructedBy).toBe(event.instructedBy.toString());
    expect(response.body.room).toBe(event.room.toString());
    expect(response.body.eventGroupSize).toBe(event.eventGroupSize);
    expect(response.body.isPublic).toBe(event.isPublic);
    expect(response.body.categories).toStrictEqual(event.categories);
    expect(response.body.level).toBe(event.level);
    expect(response.body.internalPrice).toBe(event.internalPrice);
    expect(response.body.externalPrice).toBe(event.externalPrice);
    expect(response.body.internalAtendants).toBeInstanceOf(Array);
    expect(response.body.externalAtendants).toBeInstanceOf(Array);
  });
});

describe("PUT /api/v1/events/:id", () => {
  it("should update a event", async () => {
    const response = await agent
      .put(`/api/v1/events/${event._id}`)
      .send({
        externalAtendants: [
          {
            name: "Lolita",
            lastName: "Lolita LastName",
            email: "lolita@me.com",
            phoneNumber: "123123123",
          },
        ],
      })
      .expect(200);
    // Check the response

    expect(response.body._id).toBe(event._id.toString());
    expect(response.body.name).toBe(event.name);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.createdBy).toBe(event.createdBy.toString());
    expect(response.body.instructedBy).toBe(event.instructedBy.toString());
    expect(response.body.room).toBe(event.room.toString());
    expect(response.body.eventGroupSize).toBe(event.eventGroupSize);
    expect(response.body.isPublic).toBe(event.isPublic);
    expect(response.body.categories).toStrictEqual(event.categories);
    expect(response.body.level).toBe(event.level);
    expect(response.body.internalPrice).toBe(event.internalPrice);
    expect(response.body.externalPrice).toBe(event.externalPrice);
    expect(response.body.internalAtendants).toBeInstanceOf(Array);
    expect(response.body.externalAtendants).toBeInstanceOf(Array);
    expect(response.body.externalAtendants[0]._id).toBeTruthy();
    expect(response.body.externalAtendants[0].name).toBe("Lolita");
    expect(response.body.externalAtendants[0].lastName).toBe("Lolita LastName");
    expect(response.body.externalAtendants[0].email).toBe("lolita@me.com");
    expect(response.body.externalAtendants[0].phoneNumber).toBe("123123123");
  });
});

describe("DELETE /api/v1/events/:id", () => {
  it("should delete a event", async () => {
    const response = await agent
      .delete(`/api/v1/events/${event._id}`)
      .expect(200);
    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body._id).toBe(event._id.toString());

    let dbEvent = await Event.findOne({ _id: event._id });
    expect(dbEvent).toBeFalsy();
  });
});
