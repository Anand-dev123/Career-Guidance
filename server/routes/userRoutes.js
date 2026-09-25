const express = require("express");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get user profile
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

// Update target career
router.put("/target-career", protect, async (req, res) => {
    try {
        const { targetCareer } = req.body;

        if (!targetCareer) {
            return res.status(400).json({
                message: "Target career is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                targetCareer
            },
            {
                returnDocument: "after"
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Target career updated successfully",
            user
        });

    } catch (error) {
        console.error(
            "Failed to update target career:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update target career"
        });
    }
});

module.exports = router;