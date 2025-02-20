const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const User = require("../models/User");

// Route: /api/users/summary
const getUserSummary = async (req, res) => {
  const totalUsers = await User.countDocuments();
  res.status(200).json({ totalUsers });
};

// Route: /api/bookings/summary
const getBookingSummary = async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  res.status(200).json({ totalBookings });
};

// Route: /api/payments/summary
const getPaymentSummary = async (req, res) => {
  const totalPayments = await Payment.countDocuments();
  const totalRevenue = await Payment.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  res
    .status(200)
    .json({ totalPayments, totalRevenue: totalRevenue[0]?.total || 0 });
};
