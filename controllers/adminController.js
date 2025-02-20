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

// Route: /api/analytics/summary
const getAnalyticsSummary = async (req, res) => {
    try {
      // Monthly Revenue
      const monthlyRevenueRaw = await Payment.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            amount: { $sum: "$amount" },
          },
        },
        { $sort: { "_id": 1 } },
      ]);
      const monthlyRevenue = monthlyRevenueRaw.map((item) => ({
        month: `Month ${item._id}`,
        amount: item.amount,
      }));
  
      // Booking Trends
      const bookingTrendsRaw = await Booking.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);
      const bookingTrends = bookingTrendsRaw.map((item) => ({
        date: item._id,
        count: item.count,
      }));
  
      // User Registrations
      const userRegistrationsRaw = await User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);
      const userRegistrations = userRegistrationsRaw.map((item) => ({
        date: item._id,
        count: item.count,
      }));
  
      // Respond with summary
      res.status(200).json({ monthlyRevenue, bookingTrends, userRegistrations });
    } catch (error) {
      console.error("Error in getAnalyticsSummary:", error);
      res.status(500).json({ success: false, message: "Failed to fetch analytics summary", error });
    }
  };
  

module.exports = {
  getUserSummary,
  getBookingSummary,
  getPaymentSummary,
  getAnalyticsSummary,
};