const express = require("express");

const Assessment = require("../models/Assessment");
const protect = require("../middleware/authMiddleware");
const evaluateSkills = require("../algorithms/skillEvaluation");

const router = express.Router();


// ==========================================
// GET LATEST ASSESSMENT
// ==========================================

router.get("/latest", protect, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    if (!assessment) {
      return res.status(404).json({
        message: "No assessment found",
      });
    }

    // ==========================================
    // Generate DSA-based skill evaluation
    // ==========================================

    const skillEvaluation = evaluateSkills(
      assessment.skillResults
    );

    // ==========================================
    // Return assessment + skill evaluation
    // ==========================================

    res.json({
      ...assessment.toObject(),
      skillEvaluation,
    });

  } catch (error) {
    console.error(
      "Failed to fetch latest assessment:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch latest assessment",
    });
  }
});


// ==========================================
// SAVE ASSESSMENT RESULT
// ==========================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      overallScore,
      totalScore,
      maxScore,
      skillResults,
    } = req.body;


    // ==========================================
    // Validate skill results
    // ==========================================

    if (!Array.isArray(skillResults)) {
      return res.status(400).json({
        message: "skillResults must be an array",
      });
    }


    // ==========================================
    // Validate required values
    // ==========================================

    if (
      overallScore === undefined ||
      totalScore === undefined ||
      maxScore === undefined
    ) {
      return res.status(400).json({
        message:
          "overallScore, totalScore and maxScore are required",
      });
    }


    // ==========================================
    // Save assessment in MongoDB
    // ==========================================

    const assessment = await Assessment.create({
      user: req.userId,
      overallScore,
      totalScore,
      maxScore,
      skillResults,
    });


    // ==========================================
    // DSA Skill Evaluation Engine
    //
    // HashMap / Map
    // Max Heap
    // Graph
    // BFS
    // DFS
    // Topological Sort
    // ==========================================

    const skillEvaluation =
      evaluateSkills(skillResults);


    // ==========================================
    // Send complete result
    // ==========================================

    res.status(201).json({
      message:
        "Assessment result saved successfully",

      assessment,

      skillEvaluation,
    });

  } catch (error) {
    console.error(
      "Failed to save assessment:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to save assessment result",
    });
  }
});


module.exports = router;