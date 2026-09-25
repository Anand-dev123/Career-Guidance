const express = require("express");
const Roadmap = require("../models/Roadmap");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const {
    getPersonalizedRoadmap
} = require("../algorithms/personalizedRoadmap");

const router = express.Router();


// ==========================================
// Get Personalized Roadmap
// ==========================================

router.get(
    "/:career",
    authMiddleware,
    async (req, res) => {
        try {
            const career =
                decodeURIComponent(
                    req.params.career
                );

            // Get user's skills
            const user =
                await User.findById(
                    req.userId
                ).select("skills");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Get career roadmap
            const roadmap =
                await Roadmap.find({
                    career: career
                }).sort({
                    order: 1
                });

            if (roadmap.length === 0) {
                return res.json([]);
            }

            // Convert Mongoose Map to normal object
            const userSkills =
                user.skills
                    ? Object.fromEntries(
                          user.skills
                      )
                    : {};

            // Generate personalized roadmap
            const personalizedRoadmap =
                getPersonalizedRoadmap(
                    roadmap,
                    userSkills
                );

            res.json(
                personalizedRoadmap
            );

        } catch (error) {
            console.error(
                "Personalized roadmap error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to generate personalized roadmap"
            });
        }
    }
);


module.exports = router;