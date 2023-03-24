import request from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import Service from "../mongodb/models/service";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getAuthenticatedAgent } from "./utils/authentication.js";

dotenv.config();

const app = createServer();

let agent;

let newService = {
  name: "NewService",
  price: 120,
  sessionDuration: 1,
  frequencyPerWeek: 1,
  groupSize: 10,
};

let admin;
let instructor;
let service;

beforeAll(async () => {
  mongoose.set("strictQuery", true);

  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  admin = await User.create({
    name: "AdminService",
    lastName: "AdminService LastName",
    email: "adminservice@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  instructor = await User.create({
    name: "InstructorService",
    lastName: "InstructorService LastName",
    email: "instructorservice@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "instructor",
    password: "test1234",
  });

  service = await Service.create({
    name: "TestService",
    createdBy: admin._id,
    price: 120,
    sessionDuration: 1,
    frequencyPerWeek: 1,
    instructedBy: instructor._id,
    groupSize: 10,
  });
  newService.createdBy = admin._id;
  newService.instructedBy = instructor._id;
  agent = await getAuthenticatedAgent(app);
});

afterAll(async () => {
  newService = await Service.findOne({ name: newService.name });
  await Service.deleteMany({ _id: { $in: [(service._id, newService?._id)] } });
  await User.deleteMany({ _id: { $in: [admin._id, instructor._id] } });
  await mongoose.connection.close();
});

describe("POST /api/v1/services", () => {
  it("should create a new service", async () => {
    const response = await agent
      .post("/api/v1/services")
      .send(newService)
      .expect(201);
    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body.name).toBe(newService.name);
    expect(response.body.createdBy).toBe(newService.createdBy.toString());
    expect(response.body.price).toBe(newService.price);
    expect(response.body.sessionDuration).toBe(newService.sessionDuration);
    expect(response.body.frequencyPerWeek).toBe(newService.frequencyPerWeek);
    expect(response.body.instructedBy).toBe(newService.instructedBy.toString());
    expect(response.body.groupSize).toBe(newService.groupSize);
    expect(response.body.createdAt).toBeTruthy();

    // Check the data in the database
    const dbService = await Service.findOne({ _id: response.body._id });
    expect(dbService).toBeTruthy();
    expect(dbService._id.toString()).toBe(response.body._id);
    expect(dbService.name).toBe(newService.name);
    expect(dbService.createdBy.toString()).toBe(
      newService.createdBy.toString()
    );
    expect(dbService.price).toBe(newService.price);
    expect(dbService.sessionDuration).toBe(newService.sessionDuration);
    expect(dbService.frequencyPerWeek).toBe(newService.frequencyPerWeek);
    expect(dbService.instructedBy.toString()).toBe(
      newService.instructedBy.toString()
    );
    expect(dbService.groupSize).toBe(newService.groupSize);
    expect(dbService.createdAt).toBeTruthy();
  });
});

describe("GET /api/v1/services", () => {
  it("should return all services", async () => {
    const response = await agent.get("/api/v1/services").expect(200);
    // Check the response
    expect(response.body.length).toBeGreaterThan(0);
    const responseService = response.body.find(
      (item) => item.name === service.name
    );

    expect(responseService._id).toBeTruthy();
    expect(responseService._id).toBe(service._id.toString());
    expect(responseService.name).toBe(service.name);
    expect(responseService.createdBy).toBe(service.createdBy.toString());
    expect(responseService.price).toBe(service.price);
    expect(responseService.sessionDuration).toBe(service.sessionDuration);
    expect(responseService.frequencyPerWeek).toBe(service.frequencyPerWeek);
    expect(responseService.instructedBy).toBe(service.instructedBy.toString());
    expect(responseService.groupSize).toBe(service.groupSize);
    expect(responseService.createdAt).toBe(service.createdAt.toISOString());
  });
});

describe("GET /api/v1/services/:id", () => {
  it("should return a service", async () => {
    const response = await agent
      .get(`/api/v1/services/${service._id}`)
      .expect(200);
    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body._id).toBe(service._id.toString());
    expect(response.body.name).toBe(service.name);
    expect(response.body.createdBy).toBe(service.createdBy.toString());
    expect(response.body.price).toBe(service.price);
    expect(response.body.sessionDuration).toBe(service.sessionDuration);
    expect(response.body.frequencyPerWeek).toBe(service.frequencyPerWeek);
    expect(response.body.instructedBy).toBe(service.instructedBy.toString());
    expect(response.body.groupSize).toBe(service.groupSize);
    expect(response.body.createdAt).toBe(service.createdAt.toISOString());
  });
});

describe("PUT /api/v1/services/:id", () => {
  it("should update a service", async () => {
    const response = await agent
      .put(`/api/v1/services/${service._id}`)
      .send({ price: 200 })
      .expect(200);
    // Check the response
    expect(response.body._id).toBeTruthy();
    expect(response.body._id).toBe(service._id.toString());
    expect(response.body.name).toBe(service.name);
    expect(response.body.createdAt).toBe(service.createdAt.toISOString());
    expect(response.body.createdBy).toBe(service.createdBy.toString());
    expect(response.body.price).toEqual(200);
    expect(response.body.sessionDuration).toBe(service.sessionDuration);
    expect(response.body.frequencyPerWeek).toBe(service.frequencyPerWeek);
    expect(response.body.instructedBy).toBe(service.instructedBy.toString());
    expect(response.body.groupSize).toBe(service.groupSize);
    expect(response.body.createdAt).toBe(service.createdAt.toISOString());
  });
});

describe("DELETE /api/v1/services/:id", () => {
  it("should delete a service", async () => {
    const response = await agent
      .delete(`/api/v1/services/${service._id}`)
      .expect(200);
    // Check the response
    expect(response.body._id).toBeTruthy();

    expect(response.body._id).toBe(service._id.toString());

    let dbService = await Service.findOne({ _id: service._id });
    expect(dbService).toBeFalsy();
  });
});
