const express = require("express");

const Question = require("../models/Question");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL QUESTIONS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();

    res.json(questions);
  } catch (error) {
    console.error(
      "Failed to fetch questions:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
});

// ==========================================
// GET QUESTIONS BY CAREER
// Example:
// /api/questions/career?career=AI%2FML%20Engineer
// ==========================================

router.get("/career", protect, async (req, res) => {
  try {
    const career = req.query.career;

    if (!career) {
      return res.status(400).json({
        message: "Career is required",
      });
    }

    const questions = await Question.find({
      career: career,
    });

    res.json(questions);
  } catch (error) {
    console.error(
      "Failed to fetch career questions:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch career questions",
    });
  }
});

module.exports = router;