const express = require("express");
const router = express.Router();
const { getSeatsBySchedule } = require("../controllers/seatController");

router.get("/schedule/:schedule_id", getSeatsBySchedule);

module.exports = router;