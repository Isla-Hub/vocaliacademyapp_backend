import createServer from "../../server";
import * as dotenv from "dotenv";
import { connect, clear, close } from "../config/db";
import { getAuthenticatedAgent } from "../utils/authentication";

dotenv.config();

const app = createServer();
let agent;

describe("General Limiter", () => {
  beforeAll(async () => {
    await connect();
    agent = await getAuthenticatedAgent(app);
  });

  afterAll(async () => {
    await clear();
    await close();
  });
  test("should return 429 after 100 requests within rate limit window", async () => {
    for (let i = 0; i < 101; i++) {
      const response = await agent.get("/api/v1/users");
      if (i < 100) {
        expect(response.statusCode).toEqual(200);
      } else {
        expect(response.statusCode).toEqual(429);
        expect(response.text).toEqual(
          "Too many requests from this IP, please try again later"
        );
      }
    }
  });
});
