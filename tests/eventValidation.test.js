import createServer from "../server";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import Event from "../mongodb/models/event";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { connect, clear, close } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newEvent = {
  name: "NewEventValidation",
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
  await connect();
  instructor = await User.create({
    name: "InstructorEventValidation",
    lastName: "IntructorEventValidation LastName",
    email: "instructoreventvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });
  await instructor.save();
  admin = await User.create({
    name: "AdminEventValidation",
    lastName: "AdminEventValidation LastName",
    email: "admineventvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });
  await admin.save();
  student = await User.create({
    name: "UserEventValidation",
    lastName: "UserEventValidation LastName",
    email: "usereventvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });
  await student.save();
  room = await Room.create({
    name: "RoomEventValidation",
    features: ["mirrors", "speakers"],
    createdBy: admin._id,
  });
  await room.save();
  event = await Event.create({
    name: "TestEventValidation",
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
  await event.save();
  newEvent.instructedBy = instructor._id;
  newEvent.room = room._id;
  newEvent.createdBy = admin._id;
  newEvent.internalAtendants = [student._id];
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createEventValidation", () => {
  test("Empty required fields returns error", async () => {
    const requiredFields = [
      { name: "createdBy", message: "The createdBy field is required." },
      { name: "name", message: "The name field is required." },
      { name: "date", message: "The date field is required." },
      { name: "instructedBy", message: "The instructedBy field is required." },
      { name: "room", message: "The room field is required." },
      {
        name: "eventGroupSize",
        message: "The eventGroupSize field is required.",
      },
      { name: "categories", message: "The categories field is required." },
      {
        name: "internalPrice",
        message: "The internalPrice field is required.",
      },
      {
        name: "externalPrice",
        message: "The externalPrice field is required.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "+1234567890",
          },
        ],
        message:
          "The name field is required for each element of externalAtendants.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: "",
            email: "john.doe@example.com",
            phoneNumber: "+1234567890",
          },
        ],
        message:
          "The lastName field is required for each element of externalAtendants.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: "Doe",
            email: "",
            phoneNumber: "+1234567890",
          },
        ],
        message:
          "The email field is required for each element of externalAtendants.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "",
          },
        ],
        message:
          "The phoneNumber field is required for each element of externalAtendants.",
      },
    ];

    for (const field of requiredFields) {
      const requestBody = {
        ...newEvent,
        [field.name]: field.value || "",
      };
      const response = await agent
        .post("/api/v1/events")
        .send(requestBody)
        .expect(400);

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "internalPrice",
        value: -10,
        message: "The internalPrice field must be a positive number.",
      },
      {
        name: "externalPrice",
        value: -5,
        message: "The externalPrice field must be a positive number.",
      },
      {
        name: "internalAtendants",
        value: "invalid_array",
        message: "The internalAtendants field must be an array.",
      },
      {
        name: "internalAtendants",
        value: ["invalid_id_1", "invalid_id_2"],
        message:
          "Each element of internalAtendants must be a valid MongoDB ObjectId.",
      },
      {
        name: "externalAtendants",
        value: "invalid_array",
        message: "The externalAtendants field must be an array.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: 1,
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "+1234567890",
          },
        ],
        message: "The name field must be a string.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: 1,
            email: "john.doe@example.com",
            phoneNumber: "+1234567890",
          },
        ],
        message: "The lastName field must be a string.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: "Doe",
            email: "john.doe.com",
            phoneNumber: "+1234567890",
          },
        ],
        message:
          "The email field must be a valid email address for each element of externalAtendants.",
      },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: 12312312,
          },
        ],
        message: "The phoneNumber field must be a string.",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newEvent, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/events")
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    const correctFields = {
      createdBy: mongoose.Types.ObjectId(),
      name: "Event Name",
      date: newEvent.date.toISOString(),
      instructedBy: mongoose.Types.ObjectId(),
      room: mongoose.Types.ObjectId(),
      eventGroupSize: 10,
      totalAttended: 5,
      isPublic: true,
      categories: ["Category 1", "Category 2"],
      level: "beginner",
      internalPrice: 100.5,
      externalPrice: 75.0,
      internalAtendants: [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()],
      externalAtendants: [
        {
          name: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "+1234567890",
        },
      ],
    };

    const validFields = [
      { name: "createdBy", value: correctFields.createdBy },
      { name: "name", value: correctFields.name },
      { name: "date", value: correctFields.date },
      { name: "instructedBy", value: correctFields.instructedBy },
      { name: "room", value: correctFields.room },
      { name: "eventGroupSize", value: correctFields.eventGroupSize },
      { name: "totalAttended", value: correctFields.totalAttended },
      { name: "isPublic", value: correctFields.isPublic },
      { name: "categories", value: correctFields.categories },
      { name: "level", value: correctFields.level },
      { name: "internalPrice", value: correctFields.internalPrice },
      { name: "externalPrice", value: correctFields.externalPrice },
      { name: "internalAtendants", value: correctFields.internalAtendants },
      { name: "externalAtendants", value: correctFields.externalAtendants },
    ];

    const response = await agent
      .post("/api/v1/events")
      .send(correctFields)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});

describe("updateEventValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      {
        name: "createdAt",
        message: "The createdAt field cannot be empty.",
      },
      {
        name: "createdBy",
        message: "The createdBy field cannot be empty.",
      },
      { name: "name", message: "The name field cannot be empty." },
      { name: "date", message: "The date field cannot be empty." },
      {
        name: "instructedBy",
        message: "The instructedBy field cannot be empty.",
      },
      {
        name: "room",
        message: "The room field cannot be empty.",
      },
      {
        name: "eventGroupSize",
        message: "The eventGroupSize field cannot be empty.",
      },
      {
        name: "totalAttended",
        message: "The totalAttended field cannot be empty.",
      },
      {
        name: "isPublic",
        message: "The isPublic field cannot be empty.",
      },
      {
        name: "categories",
        message: "The categories field cannot be empty.",
      },
      {
        name: "level",
        message: "The level field cannot be empty.",
      },
      {
        name: "internalPrice",
        message: "The internalPrice field cannot be empty.",
      },
      {
        name: "externalPrice",
        message: "The externalPrice field cannot be empty.",
      },
      {
        name: "internalAtendants",
        message: "The internalAtendants field must be an array.",
      },
      {
        name: "externalAtendants",
        message: "The externalAtendants field must be an array.",
      },
      {
        name: "externalAtendants[0].name",
        message:
          "The name field is required for each element of externalAtendants.",
      },
      {
        name: "externalAtendants[0].lastName",
        message:
          "The lastName field is required for each element of externalAtendants.",
      },
      {
        name: "externalAtendants[0].email",
        message:
          "The email field is required for each element of externalAtendants.",
      },
      {
        name: "externalAtendants[0].phoneNumber",
        message:
          "The phoneNumber field is required for each element of externalAtendants.",
      },
    ];

    const body = {
      ...newEvent,
      externalAtendants: [
        {
          name: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "1234567890",
        },
      ],
    };

    for (const field of requiredFields) {
      const requestBody = { ...body, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/events/${event._id}`)
        .send(requestBody)
        .expect(400);

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });
  test("Validation works correctly for invalid event fields", async () => {
    const invalidFields = [
      {
        name: "createdAt",
        value: "invalid-date",
        message: "The createdAt field must be a valid ISO8601 date.",
      },
      {
        name: "createdBy",
        value: "1234",
        message: "The createdBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "name",
        value: 12345,
        message: "The name field must be a string.",
      },
      {
        name: "date",
        value: "invalid-date",
        message: "The date field must be a valid ISO8601 date.",
      },
      {
        name: "instructedBy",
        value: "5678",
        message: "The instructedBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "room",
        value: "invalid-id",
        message: "The room field must be a valid MongoDB ObjectId.",
      },
      {
        name: "eventGroupSize",
        value: -5,
        message: "The eventGroupSize field must be a positive integer.",
      },
      {
        name: "totalAttended",
        value: "not-a-number",
        message: "The totalAttended field must be a positive integer.",
      },
      {
        name: "isPublic",
        value: "not-a-boolean",
        message: "The isPublic field must be a boolean value.",
      },
      {
        name: "categories",
        value: "not-an-array",
        message:
          "The categories field must be an array with at least one element.",
      },
      {
        name: "level",
        value: "invalid-level",
        message:
          "The level field must have one of the following values: beginner, intermediate, advanced.",
      },
      {
        name: "internalPrice",
        value: -10,
        message: "The internalPrice field must be a positive number.",
      },
      {
        name: "externalPrice",
        value: "not-a-number",
        message: "The externalPrice field must be a positive number.",
      },
      {
        name: "internalAtendants",
        value: "not-an-array",
        message: "The internalAtendants field must be an array.",
      },
      {
        name: "externalAtendants",
        value: "not-an-array",
        message: "The externalAtendants field must be an array.",
      },
      {
        name: "externalAtendants[0].name",
        value: 12345,
        message: "The name field must be a string.",
      },
      {
        name: "externalAtendants[0].lastName",
        value: 12345,
        message: "The lastName field must be a string.",
      },
      {
        name: "externalAtendants[0].email",
        value: "not-valid-email",
        message:
          "The email field must be a valid email address for each element of externalAtendants.",
      },
      {
        name: "externalAtendants[0].phoneNumber",
        value: 12345,
        message: "The phoneNumber field must be a string.",
      },
    ];

    const requestEvent = {
      _id: event._id,
      createdAt: "2023-07-23T14:00:00Z",
      createdBy: admin._id,
      name: "Test Event",
      date: "2023-08-01T15:00:00Z",
      instructedBy: instructor._id,
      room: room._id,
      eventGroupSize: 20,
      totalAttended: 15,
      isPublic: true,
      categories: ["workshop", "fitness"],
      level: "beginner",
      internalPrice: 50.0,
      externalPrice: 100.0,
      internalAtendants: [student._id],
      externalAtendants: [
        {
          name: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "1234567890",
        },
      ],
    };

    for (const field of invalidFields) {
      const requestBody = { ...requestEvent, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/events/${event._id}`)
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });
  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "createdAt", value: "2023-07-23T14:00:00.000Z" },
      { name: "createdBy", value: admin._id.toString() },
      { name: "name", value: "Test Event" },
      { name: "date", value: "2023-08-01T15:00:00.000Z" },
      { name: "instructedBy", value: instructor._id.toString() },
      { name: "room", value: room._id },
      { name: "eventGroupSize", value: 20 },
      { name: "totalAttended", value: 15 },
      { name: "isPublic", value: true },
      { name: "categories", value: ["workshop", "fitness"] },
      { name: "level", value: "beginner" },
      { name: "internalPrice", value: 50.0 },
      { name: "externalPrice", value: 100.0 },
      { name: "internalAtendants", value: [student._id.toString()] },
      {
        name: "externalAtendants",
        value: [
          {
            name: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
          },
        ],
      },
    ];
    let requestBody = {};

    for (let field of validFields) {
      requestBody[field.name] = field.value;
    }

    const response = await agent
      .put(`/api/v1/events/${event._id}`)
      .send(requestBody);
    // .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});
