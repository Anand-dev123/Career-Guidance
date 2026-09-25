const express = require("express");

const User = require("../models/User");
const Career = require("../models/Career");
const Skill = require("../models/Skill");
const Question = require("../models/Question");
const Assessment = require("../models/Assessment");
const Assignment = require("../models/Assignment");
const Roadmap = require("../models/Roadmap");
const LearningResource = require("../models/LearningResource");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// ADMIN DASHBOARD STATISTICS
// ======================================================

router.get(
  "/stats",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const [
        totalStudents,
        totalAdmins,
        totalCareers,
        totalSkills,
        totalQuestions,
        totalAssessments,
        totalAssignments,
        totalRoadmapSteps,
        totalLearningResources,
      ] = await Promise.all([
        User.countDocuments({
          role: "student",
        }),

        User.countDocuments({
          role: "admin",
        }),

        Career.countDocuments(),

        Skill.countDocuments(),

        Question.countDocuments(),

        Assessment.countDocuments(),

        Assignment.countDocuments(),

        Roadmap.countDocuments(),

        LearningResource.countDocuments({
          isActive: true,
        }),
      ]);

      res.json({
        users: {
          students: totalStudents,
          admins: totalAdmins,
        },

        content: {
          careers: totalCareers,
          skills: totalSkills,
          questions: totalQuestions,
          assignments: totalAssignments,
          roadmapSteps: totalRoadmapSteps,
          learningResources: totalLearningResources,
        },

        assessments: totalAssessments,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin statistics:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch admin statistics",
      });
    }
  }
);


// ======================================================
// GET ALL STUDENTS
// ======================================================

router.get(
  "/students",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const students = await User.find({
        role: "student",
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

      res.json(students);
    } catch (error) {
      console.error(
        "Failed to fetch students:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch students",
      });
    }
  }
);


// ======================================================
// GET RECENT STUDENTS
// ======================================================

router.get(
  "/students/recent",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const students = await User.find({
        role: "student",
      })
        .select(
          "name email college year targetCareer createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

      res.json(students);
    } catch (error) {
      console.error(
        "Failed to fetch recent students:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch recent students",
      });
    }
  }
);


// ======================================================
// ADMIN PROFILE
// ======================================================

router.get(
  "/profile",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const admin = await User.findById(
        req.userId
      ).select("-password");

      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }

      res.json(admin);
    } catch (error) {
      console.error(
        "Failed to fetch admin profile:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch admin profile",
      });
    }
  }
);


// ======================================================
// ADMIN ACCESS TEST
// ======================================================

router.get(
  "/check",
  protect,
  adminMiddleware,
  async (req, res) => {
    res.json({
      success: true,
      message: "Admin authentication successful",
    });
  }
);


// ======================================================
// GET ALL CAREERS
// ======================================================

router.get(
  "/careers",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const careers = await Career.find()
        .sort({
          createdAt: -1,
        });

      res.json(careers);
    } catch (error) {
      console.error(
        "Failed to fetch careers:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch careers",
      });
    }
  }
);


// ======================================================
// CREATE CAREER
// ======================================================

router.post(
  "/careers",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        requiredSkills,
        roadmap,
        difficulty,
      } = req.body;

      if (
        !name ||
        !description ||
        !category
      ) {
        return res.status(400).json({
          message:
            "Name, description and category are required",
        });
      }

      const existingCareer =
        await Career.findOne({
          name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
          },
        });

      if (existingCareer) {
        return res.status(400).json({
          message:
            "A career with this name already exists",
        });
      }

      const career =
        await Career.create({
          name: name.trim(),

          description:
            description.trim(),

          category:
            category.trim(),

          requiredSkills:
            Array.isArray(requiredSkills)
              ? requiredSkills
              : [],

          roadmap:
            Array.isArray(roadmap)
              ? roadmap
              : [],

          difficulty:
            difficulty || "Intermediate",
        });

      res.status(201).json({
        message:
          "Career created successfully",

        career,
      });
    } catch (error) {
      console.error(
        "Failed to create career:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create career",
        error: error.message,
      });
    }
  }
);


// ======================================================
// UPDATE CAREER
// ======================================================

router.put(
  "/careers/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        requiredSkills,
        roadmap,
        difficulty,
      } = req.body;

      if (
        !name ||
        !description ||
        !category
      ) {
        return res.status(400).json({
          message:
            "Name, description and category are required",
        });
      }

      const duplicateCareer =
        await Career.findOne({
          name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
          },

          _id: {
            $ne: req.params.id,
          },
        });

      if (duplicateCareer) {
        return res.status(400).json({
          message:
            "Another career with this name already exists",
        });
      }

      const career =
        await Career.findByIdAndUpdate(
          req.params.id,
          {
            name: name.trim(),

            description:
              description.trim(),

            category:
              category.trim(),

            requiredSkills:
              Array.isArray(requiredSkills)
                ? requiredSkills
                : [],

            roadmap:
              Array.isArray(roadmap)
                ? roadmap
                : [],

            difficulty:
              difficulty || "Intermediate",
          },
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      if (!career) {
        return res.status(404).json({
          message: "Career not found",
        });
      }

      res.json({
        message:
          "Career updated successfully",

        career,
      });
    } catch (error) {
      console.error(
        "Failed to update career:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update career",
        error: error.message,
      });
    }
  }
);


// ======================================================
// DELETE CAREER
// ======================================================

router.delete(
  "/careers/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const career =
        await Career.findByIdAndDelete(
          req.params.id
        );

      if (!career) {
        return res.status(404).json({
          message: "Career not found",
        });
      }

      res.json({
        message:
          "Career deleted successfully",
      });
    } catch (error) {
      console.error(
        "Failed to delete career:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete career",
      });
    }
  }
);


module.exports = router;