import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json" assert { type: "json" };
import userRoutes from "./routes/user.routes.js";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use("/api/v1/users", userRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
  return app;
}

export default createServer;
