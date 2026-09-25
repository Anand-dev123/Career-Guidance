const express = require("express");
const RoadmapProgress = require("../models/RoadmapProgress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's roadmap progress
router.get("/:career", authMiddleware, async (req, res) => {
    try {
        const career = decodeURIComponent(req.params.career);

        const progress = await RoadmapProgress.findOne({
            user: req.userId,
            career: career
        });

        if (!progress) {
            return res.json({
                career,
                completedSteps: []
            });
        }

        res.json(progress);
    } catch (error) {
        console.error("Get roadmap progress error:", error);

        res.status(500).json({
            message: "Failed to fetch roadmap progress"
        });
    }
});


// Update user's roadmap progress
router.put("/:career", authMiddleware, async (req, res) => {
    try {
        const career = decodeURIComponent(req.params.career);

        const { completedSteps } = req.body;

        if (!Array.isArray(completedSteps)) {
            return res.status(400).json({
                message: "completedSteps must be an array"
            });
        }

        const progress = await RoadmapProgress.findOneAndUpdate(
            {
                user: req.userId,
                career: career
            },
            {
                user: req.userId,
                career: career,
                completedSteps: completedSteps
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            message: "Roadmap progress saved successfully",
            progress
        });
    } catch (error) {
        console.error("Update roadmap progress error:", error);

        res.status(500).json({
            message: "Failed to save roadmap progress"
        });
    }
});

module.exports = router;