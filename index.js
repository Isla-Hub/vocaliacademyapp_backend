import * as dotenv from "dotenv";
import connectDB from "./mongodb/connect.js";
import createServer from "./server.js";

dotenv.config();

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    const app = createServer();
    app.listen(8080, () => {
      console.log(`Server is running on http://localhost:8080`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();