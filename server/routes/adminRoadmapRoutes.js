const express = require("express");

const Roadmap = require("../models/Roadmap");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// GET ALL ROADMAP STEPS
// GET /api/admin/roadmaps
// ======================================================

router.get("/", protect, adminMiddleware, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find()
      .sort({
        career: 1,
        order: 1,
      });

    res.json(roadmaps);
  } catch (error) {
    console.error(
      "Failed to fetch roadmaps:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch roadmaps",
    });
  }
});


// ======================================================
// GET SINGLE ROADMAP
// GET /api/admin/roadmaps/:id
// ======================================================

router.get(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const roadmap =
        await Roadmap.findById(
          req.params.id
        );

      if (!roadmap) {
        return res.status(404).json({
          message: "Roadmap not found",
        });
      }

      res.json(roadmap);
    } catch (error) {
      console.error(
        "Failed to fetch roadmap:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch roadmap",
      });
    }
  }
);


// ======================================================
// CREATE ROADMAP
// POST /api/admin/roadmaps
// ======================================================

router.post(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        career,
        title,
        description,
        skills,
        prerequisites,
        difficulty,
        estimatedWeeks,
        resources,
        order,
      } = req.body;


      // -----------------------------------------------
      // Required fields
      // -----------------------------------------------

      if (
        !career ||
        !title ||
        !description
      ) {
        return res.status(400).json({
          message:
            "Career, title and description are required",
        });
      }


      // -----------------------------------------------
      // Create roadmap
      // -----------------------------------------------

      const roadmap =
        await Roadmap.create({
          career:
            career.trim(),

          title:
            title.trim(),

          description:
            description.trim(),

          skills:
            Array.isArray(skills)
              ? skills
              : [],

          prerequisites:
            Array.isArray(
              prerequisites
            )
              ? prerequisites
              : [],

          difficulty:
            difficulty ||
            "Beginner",

          estimatedWeeks:
            Number(
              estimatedWeeks
            ) || 1,

          resources:
            Array.isArray(resources)
              ? resources
              : [],

          order:
            Number(order) || 1,
        });


      res.status(201).json({
        message:
          "Roadmap created successfully",

        roadmap,
      });

    } catch (error) {
      console.error(
        "Failed to create roadmap:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create roadmap",
      });
    }
  }
);


// ======================================================
// UPDATE ROADMAP
// PUT /api/admin/roadmaps/:id
// ======================================================

router.put(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        career,
        title,
        description,
        skills,
        prerequisites,
        difficulty,
        estimatedWeeks,
        resources,
        order,
      } = req.body;


      // -----------------------------------------------
      // Validation
      // -----------------------------------------------

      if (
        !career ||
        !title ||
        !description
      ) {
        return res.status(400).json({
          message:
            "Career, title and description are required",
        });
      }


      // -----------------------------------------------
      // Update
      // -----------------------------------------------

      const roadmap =
        await Roadmap.findByIdAndUpdate(
          req.params.id,

          {
            career:
              career.trim(),

            title:
              title.trim(),

            description:
              description.trim(),

            skills:
              Array.isArray(skills)
                ? skills
                : [],

            prerequisites:
              Array.isArray(
                prerequisites
              )
                ? prerequisites
                : [],

            difficulty:
              difficulty ||
              "Beginner",

            estimatedWeeks:
              Number(
                estimatedWeeks
              ) || 1,

            resources:
              Array.isArray(resources)
                ? resources
                : [],

            order:
              Number(order) || 1,
          },

          {
            returnDocument: "after",
            runValidators: true,
          }
        );


      if (!roadmap) {
        return res.status(404).json({
          message:
            "Roadmap not found",
        });
      }


      res.json({
        message:
          "Roadmap updated successfully",

        roadmap,
      });

    } catch (error) {
      console.error(
        "Failed to update roadmap:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update roadmap",
      });
    }
  }
);


// ======================================================
// DELETE ROADMAP
// DELETE /api/admin/roadmaps/:id
// ======================================================

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const roadmap =
        await Roadmap.findByIdAndDelete(
          req.params.id
        );


      if (!roadmap) {
        return res.status(404).json({
          message:
            "Roadmap not found",
        });
      }


      res.json({
        message:
          "Roadmap deleted successfully",
      });

    } catch (error) {
      console.error(
        "Failed to delete roadmap:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete roadmap",
      });
    }
  }
);


module.exports = router;