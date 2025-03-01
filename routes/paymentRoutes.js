const express = require("express");
const router = express.Router();
const {
  getStripePublicKey,
  createPaymentIntent,
  confirmPayment,
  getAllPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const { authenticateToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

// Admin routes
router.get("/all", isAdmin,  getAllPayments);

// Public routes
router.get("/config", getStripePublicKey);

// Protected routes
router.post("/create-payment-intent", authenticateToken, createPaymentIntent);
router.post("/confirm-payment", authenticateToken, confirmPayment);
router.get("/my-payments", authenticateToken, getAllPayments);
router.get("/:id", authenticateToken, getPaymentById);

module.exports = router;