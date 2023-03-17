import supertest from "supertest";
import createServer from "../server";
import Booking from "../mongodb/models/booking";
import User from "../mongodb/models/user";
import Room from "../mongodb/models/room";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

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
  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  admin = await User.create({
    name: "AdminBooking",
    lastName: "AdminBooking LastName",
    email: "adminbooking@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  student = await User.create({
    name: "StudentBooking",
    lastName: "StudentBooking LastName",
    email: "studentbooking@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  instructor = await User.create({
    name: "InstructorBooking",
    lastName: "InstructorBooking LastName",
    email: "instructorbooking@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  room = await Room.create({
    name: "RoomBooking",
    features: ["test feature 1", "test feature 2"],
    createdBy: admin._id,
  });

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

  newBooking.bookedBy = instructor._id;
  newBooking.student = student._id;
  newBooking.instructor = instructor._id;
  newBooking.room = room._id;
  newBooking.comments[0].by = student._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/bookings", () => {
  it("should create a new booking", async () => {
    await supertest(app)
      .post("/api/v1/bookings")
      .send(newBooking)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.startTime).toBeTruthy();
        expect(response.body.endTime).toBeTruthy();
        expect(response.body.bookedBy).toBe(newBooking.bookedBy.toString());
        expect(response.body.student).toBe(newBooking.student.toString());
        expect(response.body.instructor).toBe(newBooking.instructor.toString());
        expect(response.body.room).toBe(newBooking.room.toString());
        expect(response.body.cancelled).toBe(false);
        expect(response.body.room).toBe(newBooking.room.toString());
        expect(response.body.comments[0].by).toBe(
          newBooking.comments[0].by.toString()
        );
        expect(response.body.comments[0].date).toBeTruthy();
        expect(response.body.comments[0].content).toBe(
          newBooking.comments[0].content
        );
        expect(response.body.createdAt).toBeTruthy();

        // Check the data in the database
        const dbBooking = await Booking.findOne({ _id: response.body._id });
        expect(dbBooking._id).toBeTruthy();
        expect(dbBooking._id.toString()).toBe(response.body._id);
        expect(dbBooking.startTime).toBeTruthy();
        expect(dbBooking.endTime).toBeTruthy();
        expect(dbBooking.bookedBy.toString()).toBe(
          newBooking.bookedBy.toString()
        );
        expect(dbBooking.student.toString()).toBe(
          newBooking.student.toString()
        );
        expect(dbBooking.instructor.toString()).toBe(
          newBooking.instructor.toString()
        );
        expect(dbBooking.room.toString()).toBe(newBooking.room.toString());
        expect(dbBooking.cancelled).toBe(false);
        expect(dbBooking.comments[0].by.toString()).toBe(
          newBooking.comments[0].by.toString()
        );
        expect(dbBooking.comments[0].date).toBeTruthy();
        expect(dbBooking.comments[0].content).toBe(
          newBooking.comments[0].content
        );
        expect(dbBooking.createdAt).toBeTruthy();
      });
  });
});

describe("GET /api/v1/bookings", () => {
  it("should return all bookings", async () => {
    await supertest(app)
      .get("/api/v1/bookings")
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.length).toBeGreaterThan(0);
        const responseBooking = response.body.find(
          (item) => item.name === booking.name
        );

        expect(responseBooking._id).toBeTruthy();
        expect(responseBooking.startTime).toBeTruthy();
        expect(responseBooking.endTime).toBeTruthy();
        expect(responseBooking.bookedBy).toBe(booking.bookedBy.toString());
        expect(responseBooking.student).toBe(booking.student.toString());
        expect(responseBooking.instructor).toBe(booking.instructor.toString());
        expect(responseBooking.room).toBe(booking.room.toString());
        expect(responseBooking.cancelled).toBe(false);
        expect(responseBooking.comments[0].by).toBe(
          booking.comments[0].by.toString()
        );
        expect(responseBooking.comments[0].date).toBeTruthy();
        expect(responseBooking.comments[0].content).toBe(
          booking.comments[0].content
        );
        expect(responseBooking.createdAt).toBeTruthy();
      });
  });
});

describe("GET /api/v1/bookings/:id", () => {
  it("should return a booking", async () => {
    await supertest(app)
      .get(`/api/v1/bookings/${booking._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.startTime).toBeTruthy();
        expect(response.body.endTime).toBeTruthy();
        expect(response.body.bookedBy).toBe(booking.bookedBy.toString());
        expect(response.body.student).toBe(booking.student.toString());
        expect(response.body.instructor).toBe(booking.instructor.toString());
        expect(response.body.room).toBe(booking.room.toString());
        expect(response.body.cancelled).toBe(false);
        expect(response.body.comments[0].by).toBe(
          booking.comments[0].by.toString()
        );
        expect(response.body.comments[0].date).toBeTruthy();
        expect(response.body.comments[0].content).toBe(
          booking.comments[0].content
        );
        expect(response.body.createdAt).toBeTruthy();
      });
  });
});

describe("PUT /api/v1/bookings/:id", () => {
  it("should update a service", async () => {
    await supertest(app)
      .put(`/api/v1/bookings/${booking._id}`)
      .send({ cancelled: true })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.startTime).toBeTruthy();
        expect(response.body.endTime).toBeTruthy();
        expect(response.body.bookedBy).toBe(booking.bookedBy.toString());
        expect(response.body.student).toBe(booking.student.toString());
        expect(response.body.instructor).toBe(booking.instructor.toString());
        expect(response.body.room).toBe(booking.room.toString());
        expect(response.body.cancelled).toBe(true);
        expect(response.body.comments[0].by).toBe(
          booking.comments[0].by.toString()
        );
        expect(response.body.comments[0].date).toBeTruthy();
        expect(response.body.comments[0].content).toBe(
          booking.comments[0].content
        );
        expect(response.body.createdAt).toBeTruthy();
      });
  });
});

describe("DELETE /api/v1/bookings/:id", () => {
  it("should delete a booking", async () => {
    await supertest(app)
      .delete(`/api/v1/bookings/${booking._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();

        expect(response.body._id).toBe(booking._id.toString());
      });

    let dbBooking = await Booking.findOne({ _id: booking._id });
    expect(dbBooking).toBeFalsy();
  });
});
