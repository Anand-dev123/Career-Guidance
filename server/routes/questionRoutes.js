const express = require("express");

const Question = require("../models/Question");

const router = express.Router();

// Get all questions
router.get("/", async (req, res) => {
    try {
        const questions = await Question.find();

        res.json(questions);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch questions"
        });
    }
});

module.exports = router;