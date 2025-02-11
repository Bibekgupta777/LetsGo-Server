const mongoose = require("mongoose");

const seatSchema = mongoose.Schema({
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true
    },
    seat_number: {
      type: String,
      required: true
    },
    is_available: {
      type: Boolean,
      default: true
    },
  }, { timestamps: true });

  module.exports = mongoose.model("Seat", seatSchema);
