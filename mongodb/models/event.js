import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  instructedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  eventGroupSize: {
    type: Number,
    required: true,
  },
  totalAttended: {
    type: Number,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  categories: [{ type: String, required: true }],
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  internalPrice: {
    type: Number,
    required: true,
  },
  externalPrice: {
    type: Number,
    required: true,
  },
  internalAtendants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  externalAtendants: [
    {
      name: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
  ],
});

const eventModel = mongoose.model("Event", EventSchema);

export default eventModel;
