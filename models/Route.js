const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, "Source location is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination location is required"],
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);