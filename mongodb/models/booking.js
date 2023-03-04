import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
      type: Date,
      required: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  }, 
  cancelled: {
    type: Boolean,
    default: false,
  },
  comments: [{
      by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
      },
      date: {
          type: Date,
          default: Date.now,
      },
      content: {
          type: String,
          required: true,
      }
  }]
});

const bookingModel = mongoose.model("Booking", BookingSchema);

export default bookingModel;
