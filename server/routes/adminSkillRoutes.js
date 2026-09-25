const express = require("express");

const Skill = require("../models/Skill");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// GET ALL SKILLS
// ==========================================

router.get(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const skills = await Skill.find()
        .sort({
          category: 1,
          name: 1,
        });

      res.json(skills);
    } catch (error) {
      console.error(
        "Failed to fetch skills:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch skills",
      });
    }
  }
);


// ==========================================
// GET SINGLE SKILL
// ==========================================

router.get(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const skill = await Skill.findById(
        req.params.id
      );

      if (!skill) {
        return res.status(404).json({
          message: "Skill not found",
        });
      }

      res.json(skill);
    } catch (error) {
      console.error(
        "Failed to fetch skill:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch skill",
      });
    }
  }
);


// ==========================================
// CREATE SKILL
// ==========================================

router.post(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        category,
        difficulty,
        prerequisites,
        relatedSkills,
      } = req.body;


      // Required fields
      if (!name || !category) {
        return res.status(400).json({
          message:
            "Skill name and category are required",
        });
      }


      // Check duplicate skill
      const existingSkill =
        await Skill.findOne({
          name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
          },
        });

      if (existingSkill) {
        return res.status(400).json({
          message: "Skill already exists",
        });
      }


      const skill =
        await Skill.create({
          name: name.trim(),

          category: category.trim(),

          difficulty:
            difficulty || "Beginner",

          prerequisites:
            Array.isArray(prerequisites)
              ? prerequisites
              : [],

          relatedSkills:
            Array.isArray(relatedSkills)
              ? relatedSkills
              : [],
        });


      res.status(201).json({
        message:
          "Skill created successfully",

        skill,
      });
    } catch (error) {
      console.error(
        "Failed to create skill:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create skill",
      });
    }
  }
);


// ==========================================
// UPDATE SKILL
// ==========================================

router.put(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        category,
        difficulty,
        prerequisites,
        relatedSkills,
      } = req.body;


      if (!name || !category) {
        return res.status(400).json({
          message:
            "Skill name and category are required",
        });
      }


      // Check duplicate name
      const duplicate =
        await Skill.findOne({
          name: {
            $regex: `^${name.trim()}$`,
            $options: "i",
          },

          _id: {
            $ne: req.params.id,
          },
        });


      if (duplicate) {
        return res.status(400).json({
          message:
            "Another skill with this name already exists",
        });
      }


      const skill =
        await Skill.findByIdAndUpdate(
          req.params.id,

          {
            name: name.trim(),

            category: category.trim(),

            difficulty:
              difficulty || "Beginner",

            prerequisites:
              Array.isArray(prerequisites)
                ? prerequisites
                : [],

            relatedSkills:
              Array.isArray(relatedSkills)
                ? relatedSkills
                : [],
          },

          {
            returnDocument: "after",
            runValidators: true,
          }
        );


      if (!skill) {
        return res.status(404).json({
          message: "Skill not found",
        });
      }


      res.json({
        message:
          "Skill updated successfully",

        skill,
      });
    } catch (error) {
      console.error(
        "Failed to update skill:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update skill",
      });
    }
  }
);


// ==========================================
// DELETE SKILL
// ==========================================

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const skill =
        await Skill.findByIdAndDelete(
          req.params.id
        );


      if (!skill) {
        return res.status(404).json({
          message: "Skill not found",
        });
      }


      res.json({
        message:
          "Skill deleted successfully",
      });
    } catch (error) {
      console.error(
        "Failed to delete skill:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete skill",
      });
    }
  }
);


module.exports = router;