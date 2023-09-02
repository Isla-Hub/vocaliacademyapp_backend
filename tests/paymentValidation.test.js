import createServer from "../server";
import User from "../mongodb/models/user";
import Service from "../mongodb/models/service";
import Payment from "../mongodb/models/payment";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { clear, close, connect } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newPayment = {
  productModel: "Service",
};

let service;
let student;
let instructor;
let payment;

beforeAll(async () => {
  await connect();

  student = await User.create({
    name: "StudentPayment",
    lastName: "StudentPayment LastName",
    email: "studentPayment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "student",
    password: "test1234",
  });
  await student.save();

  instructor = await User.create({
    name: "InstructorPayment",
    lastName: "InstructorPayment LastName",
    email: "instructorPayment@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });
  await instructor.save();

  service = await Service.create({
    name: "NewService",
    price: 120,
    sessionDuration: 1,
    frequencyPerWeek: 1,
    groupSize: 10,
    instructedBy: instructor._id,
    createdBy: instructor._id,
  });
  await service.save();

  payment = await Payment.create({
    paidBy: student._id,
    product: service._id,
    productModel: "Service",
    createdBy: student._id,
  });

  await payment.save();

  newPayment.paidBy = student._id;
  newPayment.product = service._id;
  newPayment.createdBy = student._id;

  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createPaymentValidation", () => {
  test("Empty required fields returns error", async () => {
    const requiredFields = [
      { name: "paidBy", message: "The paidBy field is required." },
      { name: "product", message: "The product field is required." },
      { name: "productModel", message: "The productModel field is required." },
      { name: "createdBy", message: "The createdBy field is required." },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newPayment, [field.name]: field.value || "" };
      const response = await agent
        .post("/api/v1/payments")
        .send(requestBody)
        .expect(400);

      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "paidBy",
        value: "Marta",
        message: "The paidBy field must be a valid MongoDB ObjectId.",
      },
      {
        name: "product",
        value: "notCorrectFiled",
        message: "The product field must be a valid MongoDB ObjectId.",
      },
      {
        name: "productModel",
        value: "AnError",
        message: 'The productModel field must be "Service" or "Event".',
      },
      {
        name: "createdBy",
        value: "Carlos Estela",
        message: "The createdBy field must be a valid MongoDB ObjectId.",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newPayment, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/payments")
        .send(requestBody)
        .expect(400);
      const errorMessages = response.body.errors.map((error) => error.msg);

      expect(errorMessages).toContain(field.message);
    }
  });
});
