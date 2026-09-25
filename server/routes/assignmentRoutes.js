const express = require("express");

const Assignment = require("../models/Assignment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL ASSIGNMENTS
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({
        career: 1,
        order: 1,
      });

    res.json(assignments);

  } catch (error) {
    console.error(
      "Failed to fetch assignments:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch assignments",
    });
  }
});


// ==========================================
// GET ASSIGNMENTS BY CAREER
// ==========================================

router.get(
  "/career/:career",
  protect,
  async (req, res) => {
    try {
      const career = decodeURIComponent(
        req.params.career
      );

      const assignments =
        await Assignment.find({
          career,
        }).sort({
          order: 1,
        });

      res.json(assignments);

    } catch (error) {
      console.error(
        "Failed to fetch career assignments:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch career assignments",
      });
    }
  }
);


module.exports = router;