import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));
};

export default connectDB;
