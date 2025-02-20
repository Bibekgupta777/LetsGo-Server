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