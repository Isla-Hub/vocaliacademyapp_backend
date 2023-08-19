import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createAdmin, createStudent } from "./users";

let mongoServer;

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  console.log(
    "Shutting down previous MongoDB Memory Server connection instances..."
  );
  await mongoose.disconnect();

  mongoServer = await MongoMemoryServer.create();

  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) {
      console.error(err);
    }
  });
  console.log("MongoDB Memory Server connected");
  console.log("Setting up necessary entities for testing...");
  await createAdmin();
  await createStudent();
};

const close = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log("MongoDB Memory Server connection closed");
};

const clear = async () => {
  try {
    console.log("Resetting collections...");
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
    console.log("All collections reset");
  } catch (error) {
    console.log("Error while resetting collections:", error);
  }
};

export { connect, close, clear };
