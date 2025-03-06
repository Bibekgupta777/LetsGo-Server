const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  signUp,
  signIn,
  getUserById,
  getAllUsers,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword,
  uploadImage,
  updateUserProfile,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");
const { uploadUserAvatar } = require("../config/multerConfig");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-user-by-id/:id", getUserById);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/uploadImage", uploadUserAvatar, uploadImage);
router.put("/:id", authenticateToken, updateUserProfile);

// Admin Routes
router.get("/all", authenticateToken, isAdmin, getAllUsers); // Get all users
router.put("/:id/role", authenticateToken, isAdmin, updateUserRole); // Update user role
router.delete("/:id", authenticateToken, isAdmin, deleteUser); // Delete user

module.exports = router;