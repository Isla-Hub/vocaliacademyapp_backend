import express from "express";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import cors from "cors";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/events", eventRouter);
  return app;
}

export default createServer;
