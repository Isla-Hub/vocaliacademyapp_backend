import express from "express";
import userRouter from "./routes/user.routes.js";
import roomRouter from "./routes/room.routes.js";
import cors from "cors";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/rooms", roomRouter);
  return app;
}

export default createServer;
