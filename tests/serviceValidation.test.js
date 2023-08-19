import createServer from "../server";

import User from "../mongodb/models/user";
import Service from "../mongodb/models/service";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication";
import { clear, close, connect } from "./config/db";

dotenv.config();

const app = createServer();

let agent;

let newService = {
  name: "NewServiceValidation",
  price: 120,
  sessionDuration: 1,
  frequencyPerWeek: 1,
  groupSize: 10,
};

let admin;
let instructor;
let service;

beforeAll(async () => {
  await connect();

  admin = await User.create({
    name: "AdminServiceValidation",
    lastName: "AdminServiceValidationLastName",
    email: "adminservicevalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  await admin.save();

  instructor = await User.create({
    name: "InstructorServiceValidation",
    lastName: "InstructorServiceValidation LastName",
    email: "instructorservicevalidation@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  await instructor.save();

  service = await Service.create({
    name: "TestServiceValdiation",
    createdBy: admin._id,
    price: 120,
    sessionDuration: 1,
    frequencyPerWeek: 1,
    instructedBy: instructor._id,
    groupSize: 10,
  });

  await service.save();
  newService.createdBy = admin._id;
  newService.instructedBy = instructor._id;
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  await clear();
  await close();
});

describe("createServiceValidation", () => {
  test("Empty required fields return error", async () => {
    const requiredFields = [
      { name: "name", message: "Name is required." },
      { name: "createdBy", message: "CreatedBy is required." },
      { name: "price", message: "Price is required." },
      { name: "sessionDuration", message: "SessionDuration is required." },
      { name: "frequencyPerWeek", message: "FrequencyPerWeek is required." },
      { name: "instructedBy", message: "InstructedBy is required." },
      { name: "groupSize", message: "GroupSize is required." },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newService, [field.name]: "" };
      const response = await agent
        .post("/api/v1/services")
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });

  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "name",
        value: "A name that is super long and the length is greater than 50",
        message: "Name must be at most 50 characters long.",
      },
      {
        name: "createdBy",
        value: "1234",
        message: "CreatedBy must be a valid MongoDB ObjectId.",
      },
      {
        name: "price",
        value: -10,
        message: "Price must be a positive number.",
      },
      {
        name: "sessionDuration",
        value: 0,
        message: "SessionDuration must be a positive integer.",
      },
      {
        name: "frequencyPerWeek",
        value: 0,
        message: "FrequencyPerWeek must be a positive integer.",
      },
      {
        name: "instructedBy",
        value: "5678",
        message: "InstructedBy must be a valid MongoDB ObjectId.",
      },
      {
        name: "groupSize",
        value: 0,
        message: "GroupSize must be a positive integer.",
      },
    ];

    for (const field of invalidFields) {
      const requestBody = { ...newService, [field.name]: field.value };
      const response = await agent
        .post("/api/v1/services")
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    const validFields = [
      { name: "name", value: newService.name },
      { name: "createdBy", value: newService.createdBy },
      { name: "price", value: newService.price },
      { name: "sessionDuration", value: newService.sessionDuration },
      { name: "frequencyPerWeek", value: newService.frequencyPerWeek },
      { name: "instructedBy", value: newService.instructedBy },
      { name: "groupSize", value: newService.groupSize },
    ];

    const requestBody = newService;
    const response = await agent
      .post("/api/v1/services")
      .send(requestBody)
      .expect(201);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});

describe("updateServiceValidation", () => {
  test("Empty string for optional fields returns error", async () => {
    const requiredFields = [
      { name: "name", message: "Name cannot be empty." },
      { name: "createdBy", message: "CreatedBy cannot be empty." },
      { name: "price", message: "Price cannot be empty." },
      { name: "sessionDuration", message: "SessionDuration cannot be empty." },
      {
        name: "frequencyPerWeek",
        message: "FrequencyPerWeek cannot be empty.",
      },
      { name: "instructedBy", message: "InstructedBy cannot be empty." },
      { name: "groupSize", message: "GroupSize cannot be empty." },
    ];

    for (const field of requiredFields) {
      const requestBody = { ...newService, [field.name]: "" };
      const response = await agent
        .put(`/api/v1/services/${service._id}`)
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });
  test("Validation works correctly for invalid fields", async () => {
    const invalidFields = [
      {
        name: "name",
        value: "A name that is super long and the length is greater than 50",
        message: "Name must be at most 50 characters long.",
      },
      {
        name: "createdBy",
        value: "1234",
        message: "CreatedBy must be a valid MongoDB ObjectId.",
      },
      {
        name: "price",
        value: -10,
        message: "Price must be a positive number.",
      },
      {
        name: "sessionDuration",
        value: 0,
        message: "SessionDuration must be a positive integer.",
      },
      {
        name: "frequencyPerWeek",
        value: 0,
        message: "FrequencyPerWeek must be a positive integer.",
      },
      {
        name: "instructedBy",
        value: "5678",
        message: "InstructedBy must be a valid MongoDB ObjectId.",
      },
      {
        name: "groupSize",
        value: 0,
        message: "GroupSize must be a positive integer.",
      },
    ];

    const body = {
      name: "TestServiceValdiation",
      createdBy: admin._id,
      price: 120,
      sessionDuration: 1,
      frequencyPerWeek: 1,
      instructedBy: instructor._id,
      groupSize: 10,
    };
    for (const field of invalidFields) {
      const requestBody = { ...body, [field.name]: field.value };
      const response = await agent
        .put(`/api/v1/services/${service._id}`)
        .send(requestBody)
        .expect(400);
      expect(
        response.body.errors.some((error) => error.msg === field.message)
      ).toBe(true);
    }
  });

  test("Validation works correctly for valid fields", async () => {
    let validFields = [
      { name: "name", value: "NewServiceValidation" },
      { name: "createdBy", value: "6123456789abcdef01234567" },
      { name: "price", value: 120 },
      { name: "sessionDuration", value: 1 },
      { name: "frequencyPerWeek", value: 1 },
      { name: "instructedBy", value: "6789abcdef01234567890123" },
      { name: "groupSize", value: 10 },
    ];
    const requestBody = {
      ...newService,
      createdBy: "6123456789abcdef01234567",
      instructedBy: "6789abcdef01234567890123",
    };

    const response = await agent
      .put(`/api/v1/services/${service._id}`)
      .send(requestBody)
      .expect(200);

    for (const field of validFields) {
      expect(response.body[field.name].toString()).toBe(field.value.toString());
    }
  });
});
