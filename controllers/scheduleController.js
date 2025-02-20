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

const searchSchedules = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date ) {
      return res.status(400).json({
        success: false,
        message: "All search parameters (source, destination, date) are required.",
      });
    }

    // Parse the date and calculate the range for filtering schedules
    const searchDate = new Date(date);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    // Find schedules matching the criteria
    const schedules = await Schedule.find({
      departure_time: {
        $gte: searchDate,
        $lt: nextDate,
      },
    })
      .populate({
        path: "route_id",
        match: { source, destination },
      })
      .populate("bus_id");

    // Filter schedules where the route didn't match
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.route_id
    );

    res.status(200).json({
      success: true,
      schedules: filteredSchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a Schedule
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params; // Schedule ID from request params
    const { bus_id, route_id, departure_time, arrival_time, fare } = req.body;

    // Find the schedule to update
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    // Optionally validate the bus ID
    if (bus_id) {
      const bus = await Bus.findById(bus_id);
      if (!bus) {
        return res.status(404).json({
          success: false,
          message: "Bus not found",
        });
      }
    }

    // Update the schedule
    schedule.bus_id = bus_id || schedule.bus_id;
    schedule.route_id = route_id || schedule.route_id;
    schedule.departure_time = departure_time || schedule.departure_time;
    schedule.arrival_time = arrival_time || schedule.arrival_time;
    schedule.fare = fare || schedule.fare;

    const updatedSchedule = await schedule.save();

    res.status(200).json({
      success: true,
      data: updatedSchedule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a Schedule
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params; // Schedule ID from request params

    // Find and delete the schedule
    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchSchedules,
  getScheduleByRoute,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};