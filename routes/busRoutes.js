const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/isAdmin");

const {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
} = require("../controllers/busController");

router.post("/create", isAdmin, createBus);
router.get("/all", getAllBuses);
router.put("/:id",isAdmin, updateBus);
router.delete("/:id",isAdmin, deleteBus);

module.exports = router;
