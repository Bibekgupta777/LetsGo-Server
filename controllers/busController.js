const Bus = require("../models/Bus");
const Seat = require("../models/Seat");

const createBus = async (req, res) => {
  try {
    const { bus_number, total_seats} = req.body;

    // Create new bus
    const bus = await Bus.create({
      bus_number,
      total_seats,
    });

    // Create seats for the bus
    const seatPromises = [];
    for (let i = 1; i <= total_seats; i++) {
      seatPromises.push(
        Seat.create({
          bus_id: bus._id,
          seat_number: `${i}`,
          is_available: true,
        })
      );
    }
    await Promise.all(seatPromises);

    res.status(201).json({
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json({
      success: true,
      data: buses,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update bus details
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bus_number, total_seats } = req.body;

    // Find and update the bus
    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { bus_number, total_seats },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Update seats if total_seats is changed
    if (total_seats) {
      const currentSeatCount = await Seat.countDocuments({ bus_id: id });

      if (total_seats > currentSeatCount) {
        // Add new seats
        const seatPromises = [];
        for (let i = currentSeatCount + 1; i <= total_seats; i++) {
          seatPromises.push(
            Seat.create({
              bus_id: id,
              seat_number: `${i}`,
              is_available: true,
            })
          );
        }
        await Promise.all(seatPromises);
      } else if (total_seats < currentSeatCount) {
        // Remove excess seats
        await Seat.deleteMany({
          bus_id: id,
          seat_number: { $gt: total_seats.toString() },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: updatedBus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete bus and its seats
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the bus
    const deletedBus = await Bus.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Delete associated seats
    await Seat.deleteMany({ bus_id: id });

    res.status(200).json({
      success: true,
      message: "Bus and associated seats deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
};
