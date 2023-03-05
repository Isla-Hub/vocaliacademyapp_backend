import supertest from "supertest";
import createServer from "../server";
import User from "../mongodb/models/user";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

let newUser = {
  name: "NewUser",
  lastName: "NewUserLastName",
  email: "newuser@example.com",
  phoneNumber: "1234567890",
  avatar:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  birthday: new Date(),
  role: "student",
  password: "test1234",
};

let user;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  user = await User.create({
    name: "TestUser",
    lastName: "TestUserLastName",
    email: "testuser@example.com",
    phoneNumber: "1234567890",
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    birthday: new Date(),
    role: "admin",
    password: "test1234",
  });
});

afterAll(async () => {
  await User.deleteMany({ email: "testuser@example.com" });
  await User.deleteMany({ email: "newuser@example.com" });
  await mongoose.connection.close();
});

describe("POST /api/v1/users", () => {
  it("should create a new user", async () => {
    await supertest(app)
      .post("/api/v1/users")
      .send(newUser)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.lastName).toBe(newUser.lastName);
        expect(response.body.email).toBe(newUser.email);
        expect(response.body.phoneNumber).toBe(newUser.phoneNumber);
        expect(response.body.avatar).toBe(newUser.avatar);
        expect(response.body.birthday).toBe(newUser.birthday.toISOString());
        expect(response.body.role).toBe(newUser.role);
        expect(response.body.password).toBe(newUser.password);
        expect(response.body.subscribed.newsletter).toBe(true);
        expect(response.body.subscribed.notifications).toBe(true);
        expect(response.body.services).toBeInstanceOf(Array);
        expect(response.body.payments).toBeInstanceOf(Array);

        // Check the data in the database
        const user = await User.findOne({ _id: response.body._id });
        expect(user).toBeTruthy();
        expect(user.name).toBe(newUser.name);
        expect(user.lastName).toBe(newUser.lastName);
        expect(user.email).toBe(newUser.email);
        expect(user.phoneNumber).toBe(newUser.phoneNumber);
        expect(user.avatar).toBe(newUser.avatar);
        expect(user.birthday.toISOString()).toBe(
          newUser.birthday.toISOString()
        );
        expect(user.role).toBe(newUser.role);
        expect(user.password).toBe(newUser.password);
        expect(user.subscribed.newsletter).toBe(true);
        expect(user.subscribed.notifications).toBe(true);
        expect(user.services).toBeInstanceOf(Array);
        expect(user.payments).toBeInstanceOf(Array);
      });
  });
});

describe("GET /api/v1/users", () => {
  it("should return all users", async () => {
    await supertest(app)
      .get("/api/v1/users")
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body[0]._id).toBeTruthy();
        expect(response.body[0].name).toBe(user.name);
        expect(response.body[0].lastName).toBe(user.lastName);
        expect(response.body[0].email).toBe(user.email);
        expect(response.body[0].phoneNumber).toBe(user.phoneNumber);
        expect(response.body[0].avatar).toBe(user.avatar);
        expect(response.body[0].birthday).toBe(user.birthday.toISOString());
        expect(response.body[0].role).toBe(user.role);
        expect(response.body[0].password).toBe(user.password);
        expect(response.body[0].subscribed.newsletter).toBe(true);
        expect(response.body[0].subscribed.notifications).toBe(true);
        expect(response.body[0].services).toBeInstanceOf(Array);
        expect(response.body[0].payments).toBeInstanceOf(Array);
      });
  });
});

describe("GET /api/v1/users/:id", () => {
  it("should return a user", async () => {
    await supertest(app)
      .get(`/api/v1/users/${user._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(user.name);
        expect(response.body.lastName).toBe(user.lastName);
        expect(response.body.email).toBe(user.email);
        expect(response.body.phoneNumber).toBe(user.phoneNumber);
        expect(response.body.avatar).toBe(user.avatar);
        expect(response.body.birthday).toBe(user.birthday.toISOString());
        expect(response.body.role).toBe(user.role);
        expect(response.body.password).toBe(user.password);
        expect(response.body.subscribed.newsletter).toBe(true);
        expect(response.body.subscribed.notifications).toBe(true);
        expect(response.body.services).toBeInstanceOf(Array);
        expect(response.body.payments).toBeInstanceOf(Array);
      });
  });
});

describe("PUT /api/v1/users/:id", () => {
  it("should update a user", async () => {
    await supertest(app)
      .put(`/api/v1/users/${user._id}`)
      .send({
        name: "NewName",
      })
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe("NewName");
        expect(response.body.lastName).toBe(user.lastName);
        expect(response.body.email).toBe(user.email);
        expect(response.body.phoneNumber).toBe(user.phoneNumber);
        expect(response.body.avatar).toBe(user.avatar);
        expect(response.body.birthday).toBe(user.birthday.toISOString());
        expect(response.body.role).toBe(user.role);
        expect(response.body.password).toBe(user.password);
        expect(response.body.subscribed.newsletter).toBe(true);
        expect(response.body.subscribed.notifications).toBe(true);
        expect(response.body.services).toBeInstanceOf(Array);
        expect(response.body.payments).toBeInstanceOf(Array);
      });
  });
});

describe("DELETE /api/v1/users/:id", () => {
  it("should delete a user", async () => {
    await supertest(app)
      .delete(`/api/v1/users/${user._id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
      });

    user = await User.findOne({ _id: user._id });
    expect(user).toBeFalsy();
  });
});
