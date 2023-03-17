import Booking from "../mongodb/models/booking.js";

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json(booking);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
