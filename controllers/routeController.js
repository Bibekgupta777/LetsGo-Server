const Route = require("../models/Route");

// Create a new route
const createRoute = async (req, res) => {
  try {
    const { source, destination, distance, duration } = req.body;

    // Validate required fields
    if (!source || !destination || !distance || !duration) {
      return res.status(400).json({
        success: false,
        message: "All fields (source, destination, distance, duration) are required",
      });
    }

    const newRoute = new Route({ source, destination, distance, duration });
    const savedRoute = await newRoute.save();

    res.status(201).json({
      success: true,
      data: savedRoute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json({
      success: true,
      data: routes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a route
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params; // Route ID from params
    const { source, destination, distance, duration } = req.body;

    // Find and update the route
    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      { source, destination, distance, duration },
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedRoute) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRoute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  updateRoute,
  deleteRoute,
};