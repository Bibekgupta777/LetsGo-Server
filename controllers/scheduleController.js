const Schedule = require("../models/Schedule");
const Bus = require("../models/Bus");

const createSchedule = async (req, res) => {
  try {
    const { bus_id, route_id, departure_time, arrival_time, fare } = req.body;

    // Get bus details to set available seats
    const bus = await Bus.findById(bus_id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const schedule = await Schedule.create({
      bus_id,
      route_id,
      departure_time,
      arrival_time,
      fare,
      available_seats: bus.total_seats,
    });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};