const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");
const Seat = require("../models/Seat");
const Notification = require("../models/Notification");

const createBooking = async (req, res) => {
  try {
    const { schedule_id, seats, user_id } = req.body;

    // Check schedule exists and has available seats
    const schedule = await Schedule.findById(schedule_id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    if (schedule.available_seats < seats.length) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    // Calculate total amount
    const total_amount = schedule.fare * seats.length;

    // Create booking
    const booking = await Booking.create({
      user_id,
      schedule_id,
      seats,
      total_amount,
      payment_status: "pending",
      booking_status: "pending",
    });

    // Update available seats
    await Schedule.findByIdAndUpdate(schedule_id, {
      $inc: { available_seats: -seats.length },
    });

    // Update seat availability
    for (const seat of seats) {
      await Seat.findOneAndUpdate(
        { bus_id: schedule.bus_id, seat_number: seat.seat_number },
        { is_available: false }
      );
    }

    // Create notification
    await Notification.create({
      user_id,
      type: "booking_confirmation",
      message: `Booking confirmed for ${seats.length} seats`,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user_id: req.params.userId,
    }).populate({
      path: "schedule_id",
      populate: [{ path: "bus_id" }, { path: "route_id" }],
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID
    const { seats, booking_status, payment_status } = req.body;

    const booking = await Booking.findById(id).populate("schedule_id");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Handle seat changes
    if (seats && seats.length > 0) {
      const seatDifference = seats.length - booking.seats.length;

      // Check for available seats if adding more
      if (seatDifference > 0) {
        const schedule = await Schedule.findById(booking.schedule_id._id);
        if (schedule.available_seats < seatDifference) {
          return res.status(400).json({
            success: false,
            message: "Not enough seats available",
          });
        }
        // Update available seats
        schedule.available_seats -= seatDifference;
        await schedule.save();
      } else if (seatDifference < 0) {
        // Return seats if fewer seats are booked
        await Schedule.findByIdAndUpdate(booking.schedule_id._id, {
          $inc: { available_seats: Math.abs(seatDifference) },
        });
      }

      // Update seat availability
      await Seat.updateMany(
        {
          bus_id: booking.schedule_id.bus_id,
          seat_number: { $in: booking.seats.map((s) => s.seat_number) },
        },
        { is_available: true }
      );
      for (const seat of seats) {
        await Seat.findOneAndUpdate(
          { bus_id: booking.schedule_id.bus_id, seat_number: seat.seat_number },
          { is_available: false }
        );
      }

      // Update seats in booking
      booking.seats = seats;
    }

    // Update booking status or payment status
    if (booking_status) booking.booking_status = booking_status;
    if (payment_status) booking.payment_status = payment_status;

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("schedule_id");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.booking_status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Update seat availability
    await Schedule.findByIdAndUpdate(booking.schedule_id._id, {
      $inc: { available_seats: booking.seats.length },
    });
    await Seat.updateMany(
      {
        bus_id: booking.schedule_id.bus_id,
        seat_number: { $in: booking.seats.map((s) => s.seat_number) },
      },
      { is_available: true }
    );

    // Update booking status
    booking.booking_status = "cancelled";
    await booking.save();

    // Create notification
    await Notification.create({
      user_id: booking.user_id,
      type: "booking_cancellation",
      message: `Your booking for ${booking.seats.length} seats has been cancelled`,
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Bookings (Admin View)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "schedule_id",
        populate: [
          { path: "bus_id", select: "bus_number" },
          { path: "route_id", select: "source destination" },
        ],
      })
      .populate("user_id", "name email");

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  updateBooking,
  cancelBooking,
  getAllBookings,
};