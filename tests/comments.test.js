import createServer from "../server";
import User from "../mongodb/models/user";
import Booking from "../mongodb/models/booking";
import Comment from "../mongodb/models/comment";
import Room from "../mongodb/models/room";
import { connect, clear, close } from "./config/db";
import * as dotenv from "dotenv";
import {
  getAuthenticatedAgent,
  getAuthenticatedStudentUser,
} from "./utils/authentication.js";

dotenv.config();

const app = createServer();

let agent;

let admin;
let student;
let instructor;
let room;
let booking;
let comment1;
let comment2;

beforeAll(async () => {
  await connect();
  agent = await getAuthenticatedAgent(app);

  admin = await User.create({
    name: "AdminBookingComment",
    lastName: "AdminBookingComment LastName",
    email: "adminbookingcomment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  await admin.save();

  student = await User.create({
    name: "StudentBookingComment",
    lastName: "StudentBookingComment LastName",
    email: "studentbookingcomment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  await student.save();

  instructor = await User.create({
    name: "InstructorBookingComment",
    lastName: "InstructorBookingComment LastName",
    email: "instructorbookingcomment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  await instructor.save();

  room = await Room.create({
    name: "RoomBookingComment",
    features: ["test feature 1", "test feature 2"],
    createdBy: admin._id,
  });

  await room.save();

  comment1 = await Comment.create({
    by: agent.userId,
    content: "I will not be able to attend ",
  });

  await comment1.save();

  comment2 = await Comment.create({
    by: agent.userId,
    content: "This is super cool!",
  });

  await comment2.save();
});

beforeEach(async () => {
  booking = await Booking.create({
    startTime: new Date(),
    endTime: new Date(),
    bookedBy: instructor._id,
    student: student._id,
    instructor: instructor._id,
    room: room._id,
    comments: [comment1._id, comment2._id],
  });

  await booking.save();
});

afterAll(async () => {
  await clear();
  await close();
});

describe("POST /api/v1/bookings/:id/comments", () => {
  it("should create a comment", async () => {
    const response = await agent
      .post(`/api/v1/bookings/${booking._id}/comments`)
      .send({ content: "Comment content", by: agent.userId })
      .expect(201);

    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.content).toBe("Comment content");
    expect(response.body.by).toBe(agent.userId);
    expect(response.body.createdAt).toBeTruthy();
    expect(response.body.updatedAt).toBeTruthy();
  });
});

describe("PUT /api/v1/bookings/:id/comments/:commentId", () => {
  it("should update a comment", async () => {
    const updatedCommentContent = "Updated comment content";
    const response = await agent
      .put(`/api/v1/bookings/${booking._id}/comments/${booking.comments[0]}`)
      .send({ content: updatedCommentContent })
      .expect(200);

    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.content).toBe(updatedCommentContent);

    // Check the data in the database
    const dbComment = await Comment.findOne({ _id: response.body._id });
    expect(dbComment.content).toBe(updatedCommentContent);
  });

  it("should return 401 for unauthorized user", async () => {
    // Assuming you have a different user who didn't create the comment
    const differentAgent = await getAuthenticatedStudentUser(app);
    const response = await differentAgent
      .put(`/api/v1/bookings/${booking._id}/comments/${booking.comments[0]}`)
      .send({ content: "Another content" })
      .expect(401);

    // Check the response
    expect(response.body.message).toBe("Unauthorized");

    // Check the data in the database
    const dbComment = await Comment.findOne({ _id: response.body._id });
    expect(dbComment).toBeNull();
  });
});

describe("DELETE /api/v1/bookings/:id/comments/:commentId", () => {
  it("Admin should delete a comment", async () => {
    const response = await agent
      .delete(`/api/v1/bookings/${booking._id}/comments/${booking.comments[1]}`)
      .expect(200);

    // Check the response
    expect(response.body._id).toBeTruthy();

    // Check the data in the database
    const dbComment = await Comment.findOne({ _id: response.body._id });
    expect(dbComment).toBeNull();

    const updatedBooking = await Booking.findOne({ _id: booking._id });
    expect(updatedBooking.comments.includes(response.body._id)).toBe(false);
    expect(updatedBooking.comments.includes(booking.comments[0]._id)).toBe(
      true
    );
    expect(updatedBooking.comments.length).toBe(1);
  });

  it("should return 401 for unauthorized user", async () => {
    // Assuming you have a different user who is not an admin
    const differentAgent = await getAuthenticatedStudentUser(app);
    const response = await differentAgent
      .delete(`/api/v1/bookings/${booking._id}/comments/${booking.comments[0]}`)
      .expect(401);

    // Check the response
    expect(response.body.message).toBe(
      "User has no permission to perform this action."
    );

    // Check the data in the database
    const dbComment = await Comment.findOne({ _id: response.body._id });
    expect(dbComment).toBeNull();
    const dbCommentStillInDb = await Comment.findOne({
      _id: booking.comments[0],
    });
    expect(dbCommentStillInDb).not.toBeNull();
  });
});

describe("DELETE /api/v1/bookings/:id/comments", () => {
  it("should delete all comments", async () => {
    const response = await agent
      .delete(`/api/v1/bookings/${booking._id}/comments`)
      .expect(200);

    // Check the response
    expect(response.body.message).toBe("All comments deleted from booking.");

    // Check the data in the database
    const dbBooking = await Booking.findOne({ _id: booking._id });
    expect(dbBooking.comments.length).toBe(0);
    expect(dbBooking.comments).toEqual([]);
    const dbComment = await Comment.findOne({ _id: comment1._id });
    expect(dbComment).toBeNull();
    const dbComment2 = await Comment.findOne({ _id: comment2._id });
    expect(dbComment2).toBeNull();
  });
});
