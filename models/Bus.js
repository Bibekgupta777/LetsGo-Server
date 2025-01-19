const mongoose = require("mongoose");

const busSchema = mongoose.Schema(
  {
    bus_number: {
      type: String,
      required: [true, "Bus number is required"],
      unique: true,
      trim: true,
    },
    total_seats: {
      type: Number,
      required: [true, "Total seats is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);