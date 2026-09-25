const express = require("express");

const AssignmentProgress = require("../models/AssignmentProgress");
const Assignment = require("../models/Assignment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL ASSIGNMENT PROGRESS
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const progress = await AssignmentProgress.find({
      user: req.userId,
    }).populate("assignment");

    res.json(progress);
  } catch (error) {
    console.error(
      "Failed to fetch assignment progress:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch assignment progress",
    });
  }
});


// ==========================================
// GET PROGRESS FOR A SPECIFIC ASSIGNMENT
// ==========================================

router.get(
  "/:assignmentId",
  protect,
  async (req, res) => {
    try {
      const assignment =
        await Assignment.findById(
          req.params.assignmentId
        );

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      const progress =
        await AssignmentProgress.findOne({
          user: req.userId,
          assignment: req.params.assignmentId,
        });

      res.json({
        assignmentId:
          req.params.assignmentId,

        completed:
          progress?.completed || false,

        completedAt:
          progress?.completedAt || null,
      });
    } catch (error) {
      console.error(
        "Failed to fetch assignment progress:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch assignment progress",
      });
    }
  }
);


// ==========================================
// MARK ASSIGNMENT AS COMPLETED
// ==========================================

router.put(
  "/:assignmentId",
  protect,
  async (req, res) => {
    try {
      const assignment =
        await Assignment.findById(
          req.params.assignmentId
        );

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found",
        });
      }

      const progress =
        await AssignmentProgress.findOneAndUpdate(
          {
            user: req.userId,
            assignment:
              req.params.assignmentId,
          },
          {
            user: req.userId,
            assignment:
              req.params.assignmentId,
            completed: true,
            completedAt: new Date(),
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.json({
        message:
          "Assignment marked as completed",
        progress,
      });
    } catch (error) {
      console.error(
        "Failed to update assignment progress:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update assignment progress",
      });
    }
  }
);


// ==========================================
// MARK ASSIGNMENT AS INCOMPLETE
// ==========================================

router.delete(
  "/:assignmentId",
  protect,
  async (req, res) => {
    try {
      const progress =
        await AssignmentProgress.findOneAndDelete({
          user: req.userId,
          assignment:
            req.params.assignmentId,
        });

      res.json({
        message:
          progress
            ? "Assignment marked as incomplete"
            : "Assignment progress not found",
      });
    } catch (error) {
      console.error(
        "Failed to remove assignment progress:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update assignment progress",
      });
    }
  }
);


module.exports = router;