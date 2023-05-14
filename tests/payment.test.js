import createServer from "../server";
import User from "../mongodb/models/user";
import Payment from "../mongodb/models/payment";
import Event from "../mongodb/models/event";
import Service from "../mongodb/models/service";
import Room from "../mongodb/models/room";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";

dotenv.config();

const app = createServer();

let agent;

let newPaymentService = {
  productModel: "Service",
};
let newPaymentEvent = {
  productModel: "Event",
};

let admin;
let student;
let instructor;
let service;
let event;
let room;
let paymentEvent;
let paymentService;

beforeAll(async () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  admin = await User.create({
    name: "AdminPayment",
    lastName: "AdminPayment LastName",
    email: "adminPayment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  instructor = await User.create({
    name: "InstructorPayment",
    lastName: "InstructorPayment LastName",
    email: "instructorPayment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  student = await User.create({
    name: "StudentPayment",
    lastName: "StudentPayment LastName",
    email: "studentPayment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });

  room = await Room.create({
    name: "RoomPayment",
    createdBy: admin._id,
    features: ["mirrors", "speakers"],
  });

  service = await Service.create({
    name: "ServicePayment",
    price: 120,
    sessionDuration: 1,
    frequencyPerWeek: 1,
    groupSize: 10,
    createdBy: admin._id,
    instructedBy: instructor._id,
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

  paymentService = await Payment.create({
    productModel: "Service",
    paidBy: student._id,
    product: service._id,
    createdBy: admin._id,
  });

  paymentEvent = await Payment.create({
    productModel: "Event",
    paidBy: student._id,
    product: event._id,
    createdBy: admin._id,
  });

  (newPaymentService.paidBy = student._id),
    (newPaymentService.product = service._id),
    (newPaymentService.createdBy = admin._id),
    (newPaymentEvent.paidBy = student._id),
    (newPaymentEvent.product = event._id),
    (newPaymentEvent.createdBy = admin._id);

  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/payments", () => {
  it("should create a new payment for both service and event", async () => {
    const responseService = await agent
      .post("/api/v1/payments")
      .send(newPaymentService)
      .expect(201);
    // Check the response
    expect(responseService.body._id).toBeTruthy();
    expect(responseService.body.paidBy).toBe(
      newPaymentService.paidBy.toString()
    );
    expect(responseService.body.paidAt).toBeTruthy();
    expect(responseService.body.product).toBe(
      newPaymentService.product.toString()
    );
    expect(responseService.body.productModel).toBe(
      newPaymentService.productModel
    );
    expect(responseService.body.createdBy).toBe(
      newPaymentService.createdBy.toString()
    );
    expect(responseService.body.createdAt).toBeTruthy();

    const dbPaymentService = await Payment.findOne({
      _id: responseService.body._id,
    });
    // Check the data in the database
    expect(dbPaymentService).toBeTruthy();
    expect(dbPaymentService.id.toString()).toBe(responseService.body._id);
    expect(dbPaymentService.paidBy.toString()).toBe(
      newPaymentService.paidBy.toString()
    );
    expect(dbPaymentService.paidAt).toBeTruthy();
    expect(dbPaymentService.product.toString()).toBe(
      newPaymentService.product.toString()
    );
    expect(dbPaymentService.productModel).toBe(newPaymentService.productModel);
    expect(dbPaymentService.createdBy.toString()).toBe(
      newPaymentService.createdBy.toString()
    );
    expect(dbPaymentService.createdAt).toBeTruthy();

    const responseEvent = await agent
      .post("/api/v1/payments")
      .send(newPaymentEvent)
      .expect(201);
    // Check the response
    expect(responseEvent.body._id).toBeTruthy();
    expect(responseEvent.body.paidBy).toBe(newPaymentEvent.paidBy.toString());
    expect(responseEvent.body.paidAt).toBeTruthy();
    expect(responseEvent.body.product).toBe(newPaymentEvent.product.toString());
    expect(responseEvent.body.productModel).toBe(newPaymentEvent.productModel);
    expect(responseEvent.body.createdBy).toBe(
      newPaymentEvent.createdBy.toString()
    );
    expect(responseEvent.body.createdAt).toBeTruthy();

    const dbPaymentEvent = await Payment.findOne({
      _id: responseEvent.body._id,
    });
    // Check the data in the database
    expect(dbPaymentEvent).toBeTruthy();
    expect(dbPaymentEvent.id.toString()).toBe(responseEvent.body._id);
    expect(dbPaymentEvent.paidBy.toString()).toBe(
      newPaymentEvent.paidBy.toString()
    );
    expect(dbPaymentEvent.paidAt).toBeTruthy();
    expect(dbPaymentEvent.product.toString()).toBe(
      newPaymentEvent.product.toString()
    );
    expect(dbPaymentEvent.productModel).toBe(newPaymentEvent.productModel);
    expect(dbPaymentEvent.createdBy.toString()).toBe(
      newPaymentEvent.createdBy.toString()
    );
    expect(dbPaymentEvent.createdAt).toBeTruthy();
  });
});

describe("GET /api/v1/payments", () => {
  it("should return all payments", async () => {
    const response = await agent.get("/api/v1/payments").expect(200);

    //Check the response
    expect(response.body.length).toBeGreaterThan(0);
    const responsePaymentService = response.body.find((item) => {
      return item._id === paymentService._id.toString();
    });

    expect(responsePaymentService._id).toBeTruthy();
    expect(responsePaymentService.paidBy.toString()).toBe(
      paymentService.paidBy.toString()
    );
    expect(responsePaymentService.paidAt).toBeTruthy();
    expect(responsePaymentService.product.toString()).toBe(
      paymentService.product.toString()
    );
    expect(responsePaymentService.productModel).toBe(
      paymentService.productModel
    );
    expect(responsePaymentService.createdBy.toString()).toBe(
      paymentService.createdBy.toString()
    );
    expect(responsePaymentService.createdAt).toBeTruthy();
  });
});

describe("GET /api/v1/payments/:id", () => {
  it("should return a payment", async () => {
    const response = await agent
      .get(`/api/v1/payments/${paymentService._id}`)
      .expect(200);
    //Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.paidBy).toBe(paymentService.paidBy.toString());
    expect(response.body.paidAt).toBeTruthy();
    expect(response.body.product).toBe(paymentService.product.toString());
    expect(response.body.productModel).toBe(paymentService.productModel);
    expect(response.body.createdBy).toBe(paymentService.createdBy.toString());
    expect(response.body.createdAt).toBeTruthy();
  });
});

describe("PUT /api/v1/payments/:id", () => {
  it("should update a payment", async () => {
    const response = await agent
      .put(`/api/v1/payments/${paymentService._id}`)
      .send({ groupSize: 30 })
      .expect(200);
    //Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.paidBy).toBe(paymentService.paidBy.toString());
    expect(response.body.paidAt).toBeTruthy();
    expect(response.body.product).toBe(paymentService.product.toString());
    expect(response.body.productModel).toBe(paymentService.productModel);
    expect(response.body.createdBy).toBe(paymentService.createdBy.toString());
    expect(response.body.createdAt).toBeTruthy();
  });
});

describe("DELETE /api/v1/payments/:id", () => {
  it("should delete a payment", async () => {
    const response = await agent
      .delete(`/api/v1/payments/${paymentService._id}`)
      .expect(200);

    //Check the response
    expect(response.body._id).toBeTruthy();

    expect(response.body._id).toBe(paymentService._id.toString());

    let dbPaymentService = await Payment.findOne({ _id: paymentService._id });
    expect(dbPaymentService).toBeFalsy();
  });
});
