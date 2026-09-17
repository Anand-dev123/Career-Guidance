const express = require("express");

const Assessment = require("../models/Assessment");
const protect = require("../middleware/authMiddleware");
const evaluateSkills = require("../algorithms/skillEvaluation");

const router = express.Router();

// Save assessment result
router.post("/", protect, async (req, res) => {
  try {
    const {
      overallScore,
      totalScore,
      maxScore,
      skillResults
    } = req.body;

    const assessment = await Assessment.create({
      user: req.userId,
      overallScore,
      totalScore,
      maxScore,
      skillResults
    });

    // Skill Evaluation
    const skillEvaluation = evaluateSkills(skillResults);

    res.status(201).json({
      message: "Assessment result saved successfully",
      assessment,
      skillEvaluation
    });

  } catch (error) {
    console.error(
      "Failed to save assessment:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save assessment result"
    });
  }
});

module.exports = router;