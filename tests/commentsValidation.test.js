import createServer from "../server";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import Booking from "../mongodb/models/booking";
import Comment from "../mongodb/models/comment";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { connect, clear, close } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newComment = {};

let admin;
let student;
let instructor;
let room;
let comment;
let booking;

beforeAll(async () => {
  await connect();
  agent = await getAuthenticatedAgent(app);

  admin = await User.create({
    name: "AdminBookingCommentsValidation",
    lastName: "AdminBookingCommentsValidation LastName",
    email: "adminbookingcommentsvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  await admin.save();

  student = await User.create({
    name: "StudentBookingCommentsValidation",
    lastName: "StudentBookingCommentsValidation LastName",
    email: "studentbookingcommentsvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  await student.save();

  instructor = await User.create({
    name: "InstructorBookingCommentsValidation",
    lastName: "InstructorBookingCommentsValidation LastName",
    email: "instructorbookingcommentsvalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  await instructor.save();

  room = await Room.create({
    name: "RoomBookingCommentsValidation",
    features: ["test feature 1", "test feature 2"],
    createdBy: admin._id,
  });

  await room.save();

  comment = await Comment.create({
    content: "test comment",
    by: agent.userId,
  });

  await comment.save();

  booking = await Booking.create({
    startTime: new Date(),
    endTime: new Date(),
    bookedBy: instructor._id,
    student: student._id,
    instructor: instructor._id,
    room: room._id,
    comments: [comment._id],
  });

  await booking.save();

  newComment.by = agent.userId;
  newComment.content = "test comment";
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createCommentValidation", () => {
  test("Empty required fields returns error", async () => {
    const requiredFields = [
      { name: "by", message: "The by field is required" },
      { name: "content", message: "The content field is required" },
    ];

    for (const field of requiredFields) {
      const requestBody = {
        ...newComment,
        [field.name]: field.value || "",
      };
      const response = await agent
        .post("/api/v1/bookings/" + booking._id + "/comments")
        .send(requestBody)
        .expect(400);

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "by",
        value: "Test User",
        message: "The by field should be a valid MongoDB ID",
      },
      {
        name: "content",
        value: 123123,
        message: "The content field should be a string",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newComment, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/bookings/" + booking._id + "/comments")
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    const correctFields = {
      by: newComment.by.toString(),
      content: newComment.content,
    };

    const validFields = [
      {
        name: "by",
        value: correctFields.by,
      },
      {
        name: "content",
        value: correctFields.content,
      },
    ];

    const response = await agent
      .post("/api/v1/bookings/" + booking._id + "/comments")
      .send(correctFields)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});

describe("updateCommentValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const response = await agent
      .put(`/api/v1/bookings/${booking._id}/comments/${comment._id}`)
      .send({ conent: "" })
      .expect(400);

    expect(response.body.errors[0].msg).toContain(
      "The content field is required"
    );
  });
  test("Validation works correctly for invalid event fields", async () => {
    const response = await agent
      .put(`/api/v1/bookings/${booking._id}/comments/${comment._id}`)
      .send({ content: 123456 })
      .expect(400);

    expect(response.body.errors[0].msg).toContain("Content should be a string");

    const response2 = await agent
      .put(`/api/v1/bookings/${booking._id}/comments/fakeCommentId`)
      .send({ content: "Proper conent" })
      .expect(400);

    expect(response2.body.errors[0].msg).toContain(
      "The commentId param should be a valid MongoDB ID"
    );
  });
  test("Validation works correctly for valid fields", async () => {
    const response = await agent
      .put(`/api/v1/bookings/${booking._id}/comments/${comment._id}`)
      .send({ content: "Correct content" })
      .expect(200);

    expect(response.body.content).toBe("Correct content");
    expect(response.body._id).toBeTruthy();
    expect(response.body.by).toBe(agent.userId);
  });
});
