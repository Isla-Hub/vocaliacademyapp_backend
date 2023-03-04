import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
  },
  features: [{ type: String }],  
});

const roomModel = mongoose.model("Room", RoomSchema);

export default roomModel;
