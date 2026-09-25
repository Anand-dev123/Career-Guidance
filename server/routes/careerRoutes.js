const express = require("express");

const Career = require("../models/Career");
const protect = require("../middleware/authMiddleware");

const {
    recommendCareers
} = require("../algorithms/careerRecommendation");

const router = express.Router();

// Get all careers
router.get("/", async (req, res) => {
    try {
        const careers = await Career.find();

        res.json(careers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch careers"
        });
    }
});


// Personalized Career Recommendation
router.post("/recommend", protect, async (req, res) => {
    try {

        const { skills } = req.body;

        if (!skills || typeof skills !== "object") {
            return res.status(400).json({
                message: "Skills data is required"
            });
        }

        // Convert skills object into Map
        const userSkills = new Map(
            Object.entries(skills)
        );

        // Get careers from MongoDB
        const careers = await Career.find();

        // Generate recommendations
        const recommendations =
            recommendCareers(
                userSkills,
                careers
            );

        res.json({
            message: "Career recommendations generated successfully",
            recommendations
        });

    } catch (error) {

        console.error(
            "Career recommendation error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to generate career recommendations"
        });
    }
});


module.exports = router;