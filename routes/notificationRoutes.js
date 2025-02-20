const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const { authenticateToken } = require("../middleware/auth");

router.get("/user/:userId", authenticateToken, getUserNotifications);
router.put("/mark-read/:id", authenticateToken, markAsRead);

module.exports = router;
