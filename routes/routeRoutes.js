const express = require("express");
const router = express.Router();
const {
  createRoute,
  getRoutes,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/create", isAdmin, createRoute);
router.get("/all", getRoutes);
router.put("/:id", isAdmin, updateRoute);
router.delete("/:id", isAdmin, deleteRoute);

module.exports = router;