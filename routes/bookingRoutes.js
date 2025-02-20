const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

const {
  createBooking,
  getUserBookings,
  updateBooking,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/create", authenticateToken, createBooking);
router.get("/user/:userId", getUserBookings);
router.put("/:id", authenticateToken, updateBooking); // Update booking
router.put("/:id/cancel", authenticateToken, cancelBooking); // Cancel booking
router.get("/all", authenticateToken, getAllBookings);

module.exports = router;
