import Booking from "../../mongodb/models/booking.js";
import Event from "../../mongodb/models/event.js";
import Room from "../../mongodb/models/room.js";
import Service from "../../mongodb/models/service.js";
import User from "../../mongodb/models/user.js";

const resetCollections = async () => {
  try {
    console.log("Resetting collections...");
    await Promise.all([
      Booking.deleteMany({}),
      Event.deleteMany({}),
      Room.deleteMany({}),
      Service.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("All collections reset.");
  } catch (error) {
    console.log("Error while resetting collections:", error);
  }
};

export default resetCollections;
