import Event from "../mongodb/models/event.js";

const checkEventNameExists = async (eventName) => {
  const existingEvent = await Event.findOne({ name: eventName });
  return !!existingEvent;
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  const { name } = req.body;

  try {
    const eventExists = await checkEventNameExists(name);
    if (eventExists) {
      throw new Error("The event name already exists.");
    }
    
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { name } = req.body;

  try {
    const eventExists = await checkEventNameExists(name);
    if (eventExists) {
      throw new Error("The event name already exists.");
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };

