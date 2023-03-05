import express from "express";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use("/api/v1/users", userRouter);
  return app;
}

export default createServer;
