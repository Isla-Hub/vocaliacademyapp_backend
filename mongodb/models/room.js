import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  features: [{ type: String }],
});

const roomModel = mongoose.model("Room", RoomSchema);

export default roomModel;
