const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

const {
  getUserSummary,
  getBookingSummary,
  getPaymentSummary,
  getAnalyticsSummary,
} = require("../controllers/adminController");

// Routes for Admin Dashboard
router.get("/users/summary", authenticateToken, isAdmin, getUserSummary);
router.get("/bookings/summary", authenticateToken, isAdmin, getBookingSummary);
router.get("/payments/summary", authenticateToken, isAdmin, getPaymentSummary);
router.get("/analytics/summary", authenticateToken, isAdmin, getAnalyticsSummary);

module.exports = router;
