const express = require("express");

const Skill = require("../models/Skill");

const router = express.Router();

// Get all skills
router.get("/", async (req, res) => {
    try {
        const skills = await Skill.find();

        res.json(skills);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skills"
        });
    }
});

module.exports = router;