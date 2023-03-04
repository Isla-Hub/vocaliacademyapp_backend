import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sessionDuration: {
    type: Number,
    required: true,
  },
  frequencyPerWeek: {
    type: Number,
    required: true,
  },
  instructedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupSize: {
    type: Number,
    required: true,
  }
});

const serviceModel = mongoose.model("Service", ServiceSchema);

export default serviceModel;