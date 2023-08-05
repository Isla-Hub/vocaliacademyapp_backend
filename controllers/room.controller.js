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
    const { name } = req.body;
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(409).json({ message: "Room name already exists" });
    }
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log("params", req.params);

    console.log("NEXT");
    /*const paramRoom = await Room.findById(req.params);
    console.log("paramRoom", paramRoom);
    if (!paramRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomSameName = await Room.findOne({ name: req.body.name });
    if (roomSameName && paramRoom.id !== roomSameName.id) {
      return res.status(409).json({
        message: "Another room is using the provided name",
      });
    }*/
=======
    const { name } = req.body;
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(409).json({ message: "New room name already exists" });
    }
>>>>>>> c68fb2e8f248787c705fc7a3eed4ee98f97c6951
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("ROOOM", room);
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
