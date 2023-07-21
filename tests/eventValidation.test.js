import createServer from "../server";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import Event from "../mongodb/models/event";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";

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
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  instructor = await User.create({
    name: "InstructorEventValidation",
    lastName: "IntructorEventValidation LastName",
    email: "instructoreventvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });
  admin = await User.create({
    name: "AdminEventValidation",
    lastName: "AdminEventValidation LastName",
    email: "admineventvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  student = await User.create({
    name: "UserEventValidation",
    lastName: "UserEventValidation LastName",
    email: "usereventvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  room = await Room.create({
    name: "RoomEventValidation",
    features: ["mirrors", "speakers"],
    createdBy: admin._id,
  });
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
  newEvent.instructedBy = instructor._id;
  newEvent.room = room._id;
  newEvent.createdBy = admin._id;
  newEvent.internalAtendants = [student._id];
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await mongoose.connection.close();
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

describe("updateUserValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      {
        name: "createdAt",
        message: "The createdAt field must be a valid ISO8601 date.",
      },
      {
        name: "createdBy",
        message: "The createdBy field must be a valid MongoDB ObjectId.",
      },
      { name: "name", message: "The name field is required." },
      { name: "date", message: "The date field must be a valid ISO8601 date." },
      {
        name: "instructedBy",
        message: "The instructedBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "room",
        message: "The room field must be a valid MongoDB ObjectId.",
      },
      {
        name: "eventGroupSize",
        message: "The eventGroupSize field must be a positive integer.",
      },
      {
        name: "totalAttended",
        message: "The totalAttended field must be a positive integer.",
      },
      {
        name: "isPublic",
        message: "The isPublic field must be a boolean value.",
      },
      {
        name: "categories",
        message:
          "The categories field must be an array with at least one element.",
      },
      {
        name: "level",
        message:
          "The level field must have one of the following values: beginner, intermediate, advanced.",
      },
      {
        name: "internalPrice",
        message: "The internalPrice field must be a positive number.",
      },
      {
        name: "externalPrice",
        message: "The externalPrice field must be a positive number.",
      },
      {
        name: "internalAtendants",
        message: "The internalAtendants field must be an array.",
      },
      {
        name: "externalAtendants",
        message: "The externalAtendants field must be an array.",
      },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newEvent, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/events/${event._id}`)
        .send(requestBody)
        .expect(400);

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });
  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "password",
        value: "short",
        message: "Password must be at least 8 characters long",
      },
      { name: "email", value: "invalidemail", message: "Invalid email" },
      { name: "avatar", value: "invalidavatar", message: "Invalid avatar URL" },
      {
        name: "dateOfBirth",
        value: "invaliddate",
        message: "Invalid date format",
      },
      { name: "role", value: "invalidrole", message: "Invalid role" },
      {
        name: "subscribed.newsletter",
        value: "invalidnewsletter",
        message: "Newsletter subscription must be a boolean value",
      },
      {
        name: "subscribed.notifications",
        value: "invalidnotifications",
        message: "Notifications subscription must be a boolean value",
      },
    ];

    const body = {
      name: "TestUserUpdate",
      lastName: "TestUserUpdate LastName",
      email: "testuserupdate@example.com",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      role: "admin",
      password: "test1234",
    };
    for (const field of invalidFields) {
      const requestBody = { ...body, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/users/${user._id}`)
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });
  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "email", value: "testuserupdatenew@example.com" },
      { name: "avatar", value: newUser.avatar },
      { name: "dateOfBirth", value: newUser.dateOfBirth.toISOString() },
      { name: "role", value: newUser.role },
      {
        name: "subscribed",
        value: {
          newsletter: false,
          notifications: false,
        },
      },
    ];
    const requestBody = {
      ...newUser,
      email: "testuserupdatenew@example.com",
      subscribed: { newsletter: false, notifications: false },
    };

    const response = await agent
      .put(`/api/v1/users/${user._id}`)
      .send(requestBody)
      .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});
