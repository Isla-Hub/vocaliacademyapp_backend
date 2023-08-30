import jwt from "jsonwebtoken";
import request from "supertest";
import createServer from "../server";
import * as dotenv from "dotenv";

dotenv.config();

const app = createServer();

describe("authenticateToken middleware", () => {
  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/v1/users");
    expect(response.status).toBe(401);
  });

  it("should return 401 with expired token", async () => {
    const token = "expired-token";
    jwt.verify = jest.fn((_token, _secret, callback) => {
      const error = new Error("TokenExpiredError");
      error.name = "TokenExpiredError";
      callback(error);
    });

    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.expireTime).toBe(true);
    expect(response.body.message).toBe("JWT has expired. Please login again.");
  });

  it("should return 422 with JWT verification issue", async () => {
    const token = "invalid-token";
    jwt.verify = jest.fn((_token, _secret, callback) => {
      callback(new Error("Verification failed"));
    });

    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("JWT Verification Issue.");
  });
});
