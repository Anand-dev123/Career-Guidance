const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    // authMiddleware ke baad req.userId available hoga
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Logged-in user find karo
    const user = await User.findById(
      req.userId
    ).select("role");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin role check
    if (user.role !== "admin") {
      return res.status(403).json({
        message:
          "Access denied. Admin privileges required.",
      });
    }

    // Admin hai → next middleware/route
    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to verify admin access",
    });
  }
};

module.exports = adminMiddleware;