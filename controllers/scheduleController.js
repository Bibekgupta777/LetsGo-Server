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

const getScheduleByRoute = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    // Construct query based on filters
    let query = Schedule.find().populate("bus_id").populate("route_id");

    if (source && destination) {
      query = query.populate({
        path: "route_id",
        match: { source, destination },
      });
    }

    if (date) {
      const searchDate = new Date(date);
      const nextDate = new Date(searchDate);
      nextDate.setDate(searchDate.getDate() + 1);

      query = query.find({
        departure_time: {
          $gte: searchDate,
          $lt: nextDate,
        },
      });
    }

    const schedules = await query;

    // Filter out schedules where route_id is null (no match for source/destination)
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.route_id !== null
    );

    res.status(200).json({
      success: true,
      data: filteredSchedules,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};