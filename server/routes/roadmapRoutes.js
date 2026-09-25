const express = require("express");
const Roadmap = require("../models/Roadmap");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get roadmap for a specific career
router.get("/:career", authMiddleware, async (req, res) => {
    try {
        const career = decodeURIComponent(req.params.career);

        const roadmap = await Roadmap.find({
            career: career
        }).sort({ order: 1 });

        res.json(roadmap);
    } catch (error) {
        console.error("Roadmap fetch error:", error);

        res.status(500).json({
            message: "Failed to fetch roadmap"
        });
    }
});

module.exports = router;