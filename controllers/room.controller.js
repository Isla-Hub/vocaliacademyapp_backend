import Room from "../mongodb/models/room.js";

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("id del conroller", id);
    if (!mongoose.isValidObjectId(id)) {
      console.log("cucu");
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const paramRoom = await Room.findById(id);
    console.log("paramRoom", paramRoom);
    if (!paramRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomSameName = await Room.findOne({ name: req.body.name });
    if (roomSameName && paramRoom.id !== roomSameName.id) {
      return res.status(409).json({
        message: "Another room is using the provided name",
      });
    }
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
