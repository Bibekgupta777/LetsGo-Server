const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true
    },
    seats: [{
      seat_number: String,
      passenger_name: String,
    }],
    booking_date: {
      type: Date,
      default: Date.now
    },
    total_amount: {
      type: Number,
      required: true
    },
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    booking_status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'pending'
    }
  }, { timestamps: true });

  module.exports = mongoose.model("Booking", bookingSchema);