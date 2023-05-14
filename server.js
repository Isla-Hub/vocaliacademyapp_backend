import express from "express";
import userRouter from "./routes/user.routes.js";
import serviceRouter from "./routes/service.routes.js";
import eventRouter from "./routes/event.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import authRouter from "./routes/auth.routes.js";

import cors from "cors";
import { authenticateToken } from "./middlewares/jwt.js";

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  app.use(/^(?!.*\/auth).*$/, authenticateToken);

  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/services", serviceRouter);
  app.use("/api/v1/events", eventRouter);
  app.use("/api/v1/rooms", roomRouter);
  app.use("/api/v1/bookings", bookingRouter);
  app.use("/api/v1/payments", paymentRouter);
  app.use("/api/v1/auth", authRouter);

  return app;
}

export default createServer;
