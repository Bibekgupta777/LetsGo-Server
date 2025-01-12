const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied! Admin privileges required." });
    }

    req.user = user; // Attach user info to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access!" });
  }
};

module.exports = { isAdmin };
