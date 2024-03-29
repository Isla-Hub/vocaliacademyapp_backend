import createServer from "../server";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import Booking from "../mongodb/models/booking";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { connect, clear, close } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newBooking = {
  startTime: new Date(),
  endTime: new Date(),
};

let admin;
let student;
let instructor;
let room;
let booking;

beforeAll(async () => {
  await connect();

  admin = await User.create({
    name: "AdminBookingValidation",
    lastName: "AdminBooking LastName",
    email: "adminbooking@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  await admin.save();

  student = await User.create({
    name: "StudentBookingValidation",
    lastName: "StudentBooking LastName",
    email: "studentbooking@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  await student.save();

  instructor = await User.create({
    name: "InstructorBookingValidation",
    lastName: "InstructorBooking LastName",
    email: "instructorbooking@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  await instructor.save();

  room = await Room.create({
    name: "RoomBookingValidation",
    features: ["test feature 1", "test feature 2"],
    createdBy: admin._id,
  });

  await room.save();

  booking = await Booking.create({
    startTime: new Date(),
    endTime: new Date(),
    bookedBy: instructor._id,
    student: student._id,
    instructor: instructor._id,
    room: room._id,
  });

  await booking.save();

  newBooking.bookedBy = instructor._id;
  newBooking.student = student._id;
  newBooking.instructor = instructor._id;
  newBooking.room = room._id;
  
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createBookingValidation", () => {
  test("Empty required fields returns error", async () => {
    const requiredFields = [
      { name: "startTime", message: "The startTime field is required." },
      { name: "endTime", message: "The endTime field is required." },
      { name: "bookedBy", message: "The bookedBy field is required." },
      { name: "student", message: "The student field is required." },
      { name: "instructor", message: "The instructor field is required." },
      { name: "room", message: "The room field is required." },
      {
        name: "cancelled",
        message: "The cancelled field must be a boolean value.",
      }
    ];

    for (const field of requiredFields) {
      const requestBody = {
        ...newBooking,
        [field.name]: field.value || "",
      };
      const response = await agent
        .post("/api/v1/bookings")
        .send(requestBody)
        .expect(400);

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "startTime",
        value: -5,
        message: "The startTime field must be a valid ISO8601 date.",
      },
      {
        name: "endTime",
        value: "10/05/2023",
        message: "The endTime field must be a valid ISO8601 date.",
      },
      {
        name: "bookedBy",
        value: "10/05/2023",
        message: "The bookedBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "student",
        value: 32,
        message: "The student field must be a valid MongoDB ObjectId.",
      },
      {
        name: "instructor",
        value: 32,
        message: "The instructor field must be a valid MongoDB ObjectId.",
      },
      {
        name: "room",
        value: "roomtest",
        message: "The room field must be a valid MongoDB ObjectId.",
      },
      {
        name: "cancelled",
        value: "sí",
        message: "The cancelled field must be a boolean value.",
      }
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newBooking, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/bookings")
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    const correctFields = {
      startTime: newBooking.startTime.toISOString(),
      endTime: newBooking.endTime.toISOString(),
      bookedBy: mongoose.Types.ObjectId(),
      student: mongoose.Types.ObjectId(),
      instructor: mongoose.Types.ObjectId(),
      room: mongoose.Types.ObjectId(),
      cancelled: true
    };

    const validFields = [
      {
        name: "startTime",
        value: correctFields.startTime,
      },
      {
        name: "endTime",
        value: correctFields.endTime,
      },
      {
        name: "bookedBy",
        value: correctFields.bookedBy,
      },
      {
        name: "student",
        value: correctFields.student,
      },
      {
        name: "instructor",
        value: correctFields.instructor,
      },
      {
        name: "room",
        value: correctFields.room,
      },
      {
        name: "cancelled",
        value: correctFields.cancelled,
      }
    ];

    const response = await agent
      .post("/api/v1/bookings")
      .send(correctFields)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});

describe("updateBookingValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      {
        name: "createdAt",
        message: "The createdAt field cannot be empty.",
      },
      {
        name: "startTime",
        message: "The startTime field cannot be empty.",
      },
      {
        name: "endTime",
        message: "The endTime field cannot be empty.",
      },
      {
        name: "bookedBy",
        message: "The bookedBy field cannot be empty.",
      },
      {
        name: "student",
        message: "The student field cannot be empty.",
      },
      {
        name: "instructor",
        message: "The instructor field cannot be empty.",
      },
      {
        name: "room",
        message: "The room field cannot be empty.",
      },
      {
        name: "cancelled",
        message: "The cancelled field cannot be empty.",
      }
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newBooking, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/bookings/${booking._id}`)
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
        value: -10,
        message: "The createdAt field must be a valid ISO8601 date.",
      },
      {
        name: "startTime",
        value: -5,
        message: "The startTime field must be a valid ISO8601 date.",
      },
      {
        name: "endTime",
        value: "10/05/2023",
        message: "The endTime field must be a valid ISO8601 date.",
      },
      {
        name: "bookedBy",
        value: "student",
        message: "The bookedBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "student",
        value: "student",
        message: "The student field must be a valid MongoDB ObjectId.",
      },
      {
        name: "instructor",
        value: "instructor",
        message: "The instructor field must be a valid MongoDB ObjectId.",
      },
      {
        name: "room",
        value: "roomtest",
        message: "The room field must be a valid MongoDB ObjectId.",
      },
      {
        name: "cancelled",
        value: "sí",
        message: "The cancelled field must be a boolean value.",
      }
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newBooking, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/bookings/${booking._id}`)
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });
  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "createdAt", value: "2023-07-23T14:00:00.000Z" },
      { name: "startTime", value: "2023-07-23T14:00:00.000Z" },
      { name: "endTime", value: "2023-07-23T14:05:00.000Z" },
      { name: "bookedBy", value: newBooking.bookedBy.toString() },
      { name: "student", value: newBooking.student.toString() },
      { name: "instructor", value: newBooking.instructor.toString() },
      { name: "room", value: newBooking.room.toString() },
      { name: "cancelled", value: false },
    ];
    let requestBody = {};

    for (let field of validFields) {
      requestBody[field.name] = field.value;
    }

    const response = await agent
      .put(`/api/v1/bookings/${booking._id}`)
      .send(requestBody)
      .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});
