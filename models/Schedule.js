const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true
    },
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true
    },
    departure_time: {
      type: Date,
      required: [true, 'Departure time is required']
    },
    arrival_time: {
      type: Date,
      required: [true, 'Arrival time is required']
    },
    fare: {
      type: Number,
      required: [true, 'Fare is required']
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled'
    },
    available_seats: {
      type: Number,
    }
  }, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
