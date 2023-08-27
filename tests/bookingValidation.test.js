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
  startTime: "Wed Jan 27 2021 10:00:00 GMT+1000 (AEST)",
  endTime: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
  comments: [
    {
      content: "I will not be able to attend ",
    },
  ],
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
    startTime: "Wed Jan 27 2021 10:00:00 GMT+1000 (AEST)",
    endTime: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
    bookedBy: instructor._id,
    student: student._id,
    instructor: instructor._id,
    room: room._id,
    comments: [
      {
        by: student._id,
        content: "I will not be able to attend ",
      },
    ],
  });

  await booking.save();

  newBooking.bookedBy = instructor._id;
  newBooking.student = student._id;
  newBooking.instructor = instructor._id;
  newBooking.room = room._id;
  newBooking.comments[0].by = student._id;

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
      { name: "cancelled", message: "The cancelled field cannot be empty." },
      {
        name: "comments",
        value: [
          {
            by: "",
            date: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
            content: "This comments is a test",
          },
        ],
        message: "The by field is required for each element of comments.",
      },
      {
        name: "comments",
        value: [
          {
            by: "64eb5d8a67ff3b98f2ab47a0",
            date: "",
            content: "This comments is a test",
          },
        ],
        message: "The date field cannot be empty for each element of comments.",
      },
      {
        name: "comments",
        value: [
          {
            by: "64eb5d8a67ff3b98f2ab47a0",
            date: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
            content: "",
          },
        ],
        message: "The content field is required for each element of comments.",
      },
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
      },
      {
        name: "comments",
        value: "invalid comment",
        message: "The comments field must be an array.",
      },
      {
        name: "comments",
        value: [
          {
            by: 585,
            date: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
            content: "This comments is a test",
          },
        ],
        message: "The by field must be a string.",
      },
      {
        name: "comments",
        value: [
          {
            by: "64eb5d8a67ff3b98f2ab47a0",
            date: "6585",
            content: "This comments is a test",
          },
        ],
        message: "The date field must be a valid ISO8601 date.",
      },
      {
        name: "comments",
        value: [
          {
            by: "64eb5d8a67ff3b98f2ab47a0",
            date: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
            content: 5,
          },
        ],
        message: "The content field must be a string.",
      },
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
      startTime: newBooking.date,
      endTime: newBooking.date,
      bookedBy: mongoose.Types.ObjectId(),
      student: mongoose.Types.ObjectId(),
      instructor: mongoose.Types.ObjectId(),
      room: mongoose.Types.ObjectId(),
      cancelled: false,
      comments: [
        {
          by: mongoose.Types.ObjectId(),
          date: newBooking.date,
          content: "This comments is a test",
        },
      ],
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
      },
      {
        name: "comments",
        value: correctFields.comments,
      },
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
      },
      {
        name: "comments",
        message: "The comments field cannot be empty.",
      },
      {
        name: "comments[0].by",
        message: "The by field cannot be empty for each element of comments.",
      },
      {
        name: "comments[0].date",
        message: "The date field cannot be empty for each element of comments.",
      },
      {
        name: "comments[0].content",
        message:
          "The content field cannot be empty for each element of comments.",
      },
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
        message: "The startTime field must be a valid ISO8601 date.",
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
      },
      {
        name: "comments",
        value: "invalid comment",
        message: "The comments field must be an array.",
      },
      {
        name: "comments",
        value: [
          {
            by: 585,
            date: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
            content: "This comments is a test",
          },
        ],
        message: "The by field must be a string.",
      },
      {
        name: "comments",
        value: [
          {
            by: "64eb5d8a67ff3b98f2ab47a0",
            date: 88888,
            content: "This comments is a test",
          },
        ],
        message: "The date field must be a valid ISO8601 date.",
      },
      {
        name: "comments",
        value: [
          {
            by: "64eb5d8a67ff3b98f2ab47a0",
            date: "Wed Jan 27 2021 11:00:00 GMT+1000 (AEST)",
            content: 88888,
          },
        ],
        message: "The content field must be a string.",
      },
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
      { name: "startTime", value: newBooking.date },
      { name: "endTime", value: newBooking.date },
      { name: "bookedBy", value: mongoose.Types.ObjectId() },
      { name: "student", value: mongoose.Types.ObjectId() },
      { name: "instructor", value: mongoose.Types.ObjectId() },
      { name: "room", value: mongoose.Types.ObjectId() },
      { name: "cancelled", value: false },
      {
        name: "comments",
        value: [
          {
            by: mongoose.Types.ObjectId(),
            date: newBooking.date,
            content: "This comments is a test",
          },
        ],
      },
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
