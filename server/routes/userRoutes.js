const express = require("express");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user profile
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile"
        });
    }
});

module.exports = router;