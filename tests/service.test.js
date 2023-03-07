import supertest from "supertest";
import createServer from "../server";
import Service from "../mongodb/models/service";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

let newService = {
  //cratedAt ->  look at the document "mongodb/models/service.js"

  name: "NewService",
  createdBy: "admin",
  price: 120,
  sessionDuration: 1,
  frequencyPerWeek: 1,
  instructedBy: "instructor",
  groupSize: 10,
};

let service;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  service = await Service.create({
    name: "TestService",
    createdBy: "admin",
    price: 120,
    sessionDuration: 1,
    frequencyPerWeek: 1,
    instructedBy: "instructor",
    groupSize: 10,
  });
});

afterAll(async () => {
  await Service.deleteMany({ name: "NewService" });
  await Service.deleteMany({ name: "TestService" });
  await mongoose.connection.close();
});

describe("POST /api/v1/services", () => {
  it("should create a new service", async () => {
    await supertest(app)
      .post("/api/v1/services")
      .send(newService)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(newService.name);
        expect(response.body.createdBy).toBe(newService.createdBy);
        expect(response.body.price).toBe(newService.price);
        expect(response.body.sessionDuration).toBe(newService.sessionDuration);
        expect(response.body.frequencyPerWeek).toBe(
          newService.frequencyPerWeek
        );
        expect(response.body.instructedBy).toBe(newService.instructedBy);
        expect(response.body.groupSize).toBe(newService.groupSize);

        // Check the data in the database
        const service = await Service.findOne({ _id: response.body._id });
        expect(service).toBeTruthy();
        expect(service.name).toBe(newService.name);
        expect(service.createdBy).toBe(newService.createdBy);
        expect(service.price).toBe(newService.price);
        expect(service.sessionDuration).toBe(newService.sessionDuration);
        expect(service.frequencyPerWeek).toBe(newService.frequencyPerWeek);
        expect(service.instructedBy).toBe(newService.instructedBy);
        expect(service.groupSize).toBe(newService.groupSize);
      });
  });
});

describe("GET /api/v1/services", () => {
  it("should return all services", async () => {
    await supertest(app)
      .get("/api/v1/services")
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body[0]._id).toBeTruthy();
        expect(response.body[0].name).toBe(service.name);
        expect(response.body[0].createdBy).toBe(service.createdBy);
        expect(response.body[0].price).toBe(service.price);
        expect(response.body[0].sessionDuration).toBe(service.sessionDuration);
        expect(response.body[0].frequencyPerWeek).toBe(
          service.frequencyPerWeek
        );
        expect(response.body[0].instructedBy).toBe(service.instructedBy);
        expect(response.body[0].groupSize).toBe(service.groupSize);
      });
  });
});

describe("GET /api/v1/services/:id", () => {
  it("should return a service", async () => {
    await supertest(app)
      .get(`/api/v1/services/${service._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(service.name);
        expect(response.body.createdBy).toBe(service.createdBy);
        expect(response.body.price).toBe(service.price);
        expect(response.body.sessionDuration).toBe(service.sessionDuration);
        expect(response.body.frequencyPerWeek).toBe(service.frequencyPerWeek);
        expect(response.body.instructedBy).toBe(service.instructedBy);
        expect(response.body.groupSize).toBe(service.groupSize);
      });
  });
});

describe("PUT /api/v1/services/:id", () => {
  it("should update a service", async () => {
    await supertest(app)
      .put(`/api/v1/services/${service._id}`)
      .send(newService)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(newService.name);
        expect(response.body.createdBy).toBe(newService.createdBy);
        expect(response.body.price).toBe(newService.price);
        expect(response.body.sessionDuration).toBe(newService.sessionDuration);
        expect(response.body.frequencyPerWeek).toBe(
          newService.frequencyPerWeek
        );
        expect(response.body.instructedBy).toBe(newService.instructedBy);
        expect(response.body.groupSize).toBe(newService.groupSize);
      });
  });
});

describe("DELETE /api/v1/services/:id", () => {
  it("should delete a service", async () => {
    await supertest(app)
      .delete(`/api/v1/services/${service._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
      });

    service = await Service.findOne({ _id: service._id });
    expect(service).toBeFalsy();
  });
});
