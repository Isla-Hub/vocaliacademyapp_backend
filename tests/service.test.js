import supertest from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import Service from "../mongodb/models/service";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

let newService = {
  //cratedAt ->  look at the document "mongodb/models/service.js"
  name: "NewService",
  price: 120,
  sessionDuration: 1,
  frequencyPerWeek: 1,
  groupSize: 10,
};

let user;
let service;

beforeAll(async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  user = await User.create({
    name: "User1",
    lastName: "User1lastName",
    email: "user1@example.com",
    phoneNumber: "1234567890",
    dateOfBirth: new Date(),
    role: "admin",
    password: "test1234",
  });

  service = await Service.create({
    name: "TestService",
    createdBy: user._id,
    price: 120,
    sessionDuration: 1,
    frequencyPerWeek: 1,
    instructedBy: user._id,
    groupSize: 10,
  });
});

afterAll(async () => {
  await User.deleteMany({ email: "user1@example.com" });
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
        expect(response.body.createdBy).toBe(newService.createdBy.toString());
        expect(response.body.price).toBe(newService.price);
        expect(response.body.sessionDuration).toBe(newService.sessionDuration);
        expect(response.body.frequencyPerWeek).toBe(
          newService.frequencyPerWeek
        );
        expect(response.body.instructedBy).toBe(newService.instructedBy);
        expect(response.body.groupSize).toBe(newService.groupSize);
        expect(response.body.createdAt).toBeTruthy();

        // Check the data in the database
        const dbService = await Service.findOne({ _id: response.body._id });
        expect(dbService).toBeTruthy();
        expect(dbService._id.toString()).toBe(response.body._id);
        expect(dbService.name).toBe(newService.name);
        expect(dbService.createdBy).toBe(newService.createdBy);
        expect(dbService.price).toBe(newService.price);
        expect(dbService.sessionDuration).toBe(newService.sessionDuration);
        expect(dbService.frequencyPerWeek).toBe(newService.frequencyPerWeek);
        expect(dbService.instructedBy).toBe(newService.instructedBy);
        expect(dbService.groupSize).toBe(newService.groupSize);
        expect(dbService.createdAt).toBeTruthy();
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
        expect(response.body.length).toBeGreaterThan(0);
        const responseService = response.body.find(
          (item) => item.name === service.name
        );

        expect(responseService.body[0]._id).toBeTruthy();
        expect(responseService._id).toBe(service._id.toString());
        expect(responseService.body[0].name).toBe(service.name);
        expect(responseService.body[0].createdBy).toBe(
          service.createdBy.toString()
        );
        expect(responseService.body[0].price).toBe(service.price);
        expect(responseService.body[0].sessionDuration).toBe(
          service.sessionDuration
        );
        expect(responseService.body[0].frequencyPerWeek).toBe(
          service.frequencyPerWeek
        );
        expect(responseService.body[0].instructedBy).toBe(
          service.instructedBy.toString()
        );
        expect(responseService.body[0].groupSize).toBe(service.groupSize);
        expect(responseService.createdAt).toBe(service.createdAt.toISOString());
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
        expect(response.body._id).toBe(service._id.toString());
        expect(response.body.name).toBe(service.name);
        expect(response.body.createdBy).toBe(service.createdBy.toString());
        expect(response.body.price).toBe(service.price);
        expect(response.body.sessionDuration).toBe(service.sessionDuration);
        expect(response.body.frequencyPerWeek).toBe(service.frequencyPerWeek);
        expect(response.body.instructedBy).toBe(
          service.instructedBy.toString()
        );
        expect(response.body.groupSize).toBe(service.groupSize);
        expect(response.body.createdAt).toBe(service.createdAt.toISOString());
      });
  });
});

describe("PUT /api/v1/services/:id", () => {
  it("should update a service", async () => {
    await supertest(app)
      .put(`/api/v1/services/${service._id}`)
      .send({ price: 200 })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body._id).toBe(service._id.toString());
        expect(response.body.name).toBe(service.name);
        expect(response.body.createdBy).toBe(service.createdBy.toString());
        expect(response.body.price).toBe(service.price);
        expect(response.body.sessionDuration).toBe(service.sessionDuration);
        expect(response.body.frequencyPerWeek).toBe(service.frequencyPerWeek);
        expect(response.body.instructedBy).toBe(
          service.instructedBy.toString()
        );
        expect(response.body.groupSize).toBe(service.groupSize);
        expect(response.body.createdAt).toBe(service.createdAt.toISOString());
        expect(response.body.price).toEqual(200);
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

        expect(response.body._id).toBe(service._id.toString());
      });

    let dbService = await Service.findOne({ _id: service._id });
    expect(dbService).toBeFalsy();
  });
});
