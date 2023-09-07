import express from "express";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.routes.js";
import serviceRouter from "./routes/service.routes.js";
import eventRouter from "./routes/event.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import authRouter from "./routes/auth.routes.js";

import cors from "cors";
import morgan from "morgan";
import { authenticateToken } from "./middlewares/jwt.js";

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(morgan("dev"));

  app.use(/^(?!.*\/auth).*$/, authenticateToken);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // número máximo de solicitudes por IP en 15 minutos
    message: "Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.",
  });

  app.use("/api/v1/users", limiter, userRouter);
  app.use("/api/v1/services", limiter, serviceRouter);
  app.use("/api/v1/events", limiter, eventRouter);
  app.use("/api/v1/rooms", limiter, roomRouter);
  app.use("/api/v1/bookings", limiter, bookingRouter);
  app.use("/api/v1/payments", limiter, paymentRouter);
  app.use("/api/v1/auth", authRouter);

  return app;
}

export default createServer;
