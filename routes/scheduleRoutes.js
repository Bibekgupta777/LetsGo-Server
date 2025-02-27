  const express = require("express");
  const router = express.Router();
  const {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    searchSchedules,
    getScheduleByRoute,
  } = require("../controllers/scheduleController");
  const { isAdmin } = require("../middleware/isAdmin");

  router.post("/create", isAdmin, createSchedule);
  router.get("/get", getScheduleByRoute);
  router.get("/search", searchSchedules);
  router.put("/:id", isAdmin, updateSchedule);
  router.delete("/:id", isAdmin, deleteSchedule);

  module.exports = router;
