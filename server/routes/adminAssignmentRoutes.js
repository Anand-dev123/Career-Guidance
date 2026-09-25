const express = require("express");

const Assignment = require("../models/Assignment");
const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// GET ALL ASSIGNMENTS
// ==========================================

router.get(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const { career, skill, difficulty, search } =
        req.query;

      const filter = {};

      if (career) {
        filter.career = career;
      }

      if (skill) {
        filter.skill = skill;
      }

      if (difficulty) {
        filter.difficulty = difficulty;
      }

      if (search) {
        filter.$or = [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            career: {
              $regex: search,
              $options: "i",
            },
          },
          {
            skill: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      const assignments =
        await Assignment.find(filter).sort({
          career: 1,
          order: 1,
          createdAt: -1,
        });

      res.json({
        success: true,
        count: assignments.length,
        assignments,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin assignments:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch assignments",
      });
    }
  }
);


// ==========================================
// GET SINGLE ASSIGNMENT
// ==========================================

router.get(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const assignment =
        await Assignment.findById(
          req.params.id
        );

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found",
        });
      }

      res.json({
        success: true,
        assignment,
      });
    } catch (error) {
      console.error(
        "Failed to fetch assignment:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch assignment",
      });
    }
  }
);


// ==========================================
// CREATE ASSIGNMENT
// ==========================================

router.post(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        career,
        skill,
        difficulty,
        estimatedTime,
        resources,
        order,
      } = req.body;

      // ------------------------------
      // Validation
      // ------------------------------

      if (
        !title ||
        !description ||
        !career ||
        !skill
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description, career and skill are required.",
        });
      }

      if (
        difficulty &&
        ![
          "Beginner",
          "Intermediate",
          "Advanced",
        ].includes(difficulty)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid difficulty level.",
        });
      }

      // ------------------------------
      // Resources validation
      // ------------------------------

      let normalizedResources = [];

      if (Array.isArray(resources)) {
        normalizedResources =
          resources
            .map((resource) =>
              String(resource).trim()
            )
            .filter(Boolean);
      }

      // ------------------------------
      // Create
      // ------------------------------

      const assignment =
        await Assignment.create({
          title: title.trim(),
          description:
            description.trim(),
          career: career.trim(),
          skill: skill.trim(),
          difficulty:
            difficulty || "Beginner",
          estimatedTime:
            Number(estimatedTime) || 30,
          resources:
            normalizedResources,
          order: Number(order) || 1,
        });

      res.status(201).json({
        success: true,
        message:
          "Assignment created successfully.",
        assignment,
      });
    } catch (error) {
      console.error(
        "Failed to create assignment:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create assignment",
      });
    }
  }
);


// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

router.put(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        career,
        skill,
        difficulty,
        estimatedTime,
        resources,
        order,
      } = req.body;

      const assignment =
        await Assignment.findById(
          req.params.id
        );

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found",
        });
      }

      // ------------------------------
      // Validation
      // ------------------------------

      if (
        !title ||
        !description ||
        !career ||
        !skill
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description, career and skill are required.",
        });
      }

      if (
        difficulty &&
        ![
          "Beginner",
          "Intermediate",
          "Advanced",
        ].includes(difficulty)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid difficulty level.",
        });
      }

      // ------------------------------
      // Resources
      // ------------------------------

      let normalizedResources =
        assignment.resources;

      if (Array.isArray(resources)) {
        normalizedResources =
          resources
            .map((resource) =>
              String(resource).trim()
            )
            .filter(Boolean);
      }

      // ------------------------------
      // Update
      // ------------------------------

      assignment.title =
        title.trim();

      assignment.description =
        description.trim();

      assignment.career =
        career.trim();

      assignment.skill =
        skill.trim();

      assignment.difficulty =
        difficulty || "Beginner";

      assignment.estimatedTime =
        Number(estimatedTime) || 30;

      assignment.resources =
        normalizedResources;

      assignment.order =
        Number(order) || 1;

      await assignment.save();

      res.json({
        success: true,
        message:
          "Assignment updated successfully.",
        assignment,
      });
    } catch (error) {
      console.error(
        "Failed to update assignment:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update assignment",
      });
    }
  }
);


// ==========================================
// DELETE ASSIGNMENT
// ==========================================

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const assignment =
        await Assignment.findById(
          req.params.id
        );

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found",
        });
      }

      await Assignment.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Assignment deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to delete assignment:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete assignment",
      });
    }
  }
);


module.exports = router;