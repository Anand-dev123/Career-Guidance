const express = require("express");

const LearningResource = require("../models/LearningResource");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// GET ALL LEARNING RESOURCES
// GET /api/admin/learning-resources
// ======================================================

router.get(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const resources =
        await LearningResource.find().sort({
          career: 1,
          skill: 1,
          order: 1,
        });

      res.json(resources);
    } catch (error) {
      console.error(
        "Failed to fetch learning resources:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch learning resources",
      });
    }
  }
);


// ======================================================
// GET SINGLE RESOURCE
// GET /api/admin/learning-resources/:id
// ======================================================

router.get(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const resource =
        await LearningResource.findById(
          req.params.id
        );

      if (!resource) {
        return res.status(404).json({
          message:
            "Learning resource not found",
        });
      }

      res.json(resource);
    } catch (error) {
      console.error(
        "Failed to fetch learning resource:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch learning resource",
      });
    }
  }
);


// ======================================================
// CREATE RESOURCE
// POST /api/admin/learning-resources
// ======================================================

router.post(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        skill,
        career,
        type,
        url,
        difficulty,
        estimatedMinutes,
        order,
        isActive,
      } = req.body;


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !title ||
        !skill ||
        !career ||
        !url
      ) {
        return res.status(400).json({
          message:
            "Title, skill, career and URL are required",
        });
      }


      // -----------------------------------------------
      // CREATE
      // -----------------------------------------------

      const resource =
        await LearningResource.create({
          title:
            title.trim(),

          description:
            description?.trim() || "",

          skill:
            skill.trim(),

          career:
            career.trim(),

          type:
            type || "Article",

          url:
            url.trim(),

          difficulty:
            difficulty || "Beginner",

          estimatedMinutes:
            Number(
              estimatedMinutes
            ) || 30,

          order:
            Number(order) || 1,

          isActive:
            typeof isActive ===
            "boolean"
              ? isActive
              : true,
        });


      res.status(201).json({
        message:
          "Learning resource created successfully",

        resource,
      });

    } catch (error) {
      console.error(
        "Failed to create learning resource:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create learning resource",
      });
    }
  }
);


// ======================================================
// UPDATE RESOURCE
// PUT /api/admin/learning-resources/:id
// ======================================================

router.put(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        skill,
        career,
        type,
        url,
        difficulty,
        estimatedMinutes,
        order,
        isActive,
      } = req.body;


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !title ||
        !skill ||
        !career ||
        !url
      ) {
        return res.status(400).json({
          message:
            "Title, skill, career and URL are required",
        });
      }


      // -----------------------------------------------
      // UPDATE
      // -----------------------------------------------

      const resource =
        await LearningResource.findByIdAndUpdate(
          req.params.id,

          {
            title:
              title.trim(),

            description:
              description?.trim() || "",

            skill:
              skill.trim(),

            career:
              career.trim(),

            type:
              type || "Article",

            url:
              url.trim(),

            difficulty:
              difficulty || "Beginner",

            estimatedMinutes:
              Number(
                estimatedMinutes
              ) || 30,

            order:
              Number(order) || 1,

            isActive:
              typeof isActive ===
              "boolean"
                ? isActive
                : true,
          },

          {
            returnDocument: "after",
            runValidators: true,
          }
        );


      if (!resource) {
        return res.status(404).json({
          message:
            "Learning resource not found",
        });
      }


      res.json({
        message:
          "Learning resource updated successfully",

        resource,
      });

    } catch (error) {
      console.error(
        "Failed to update learning resource:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update learning resource",
      });
    }
  }
);


// ======================================================
// DELETE RESOURCE
// DELETE /api/admin/learning-resources/:id
// ======================================================

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const resource =
        await LearningResource.findByIdAndDelete(
          req.params.id
        );


      if (!resource) {
        return res.status(404).json({
          message:
            "Learning resource not found",
        });
      }


      res.json({
        message:
          "Learning resource deleted successfully",
      });

    } catch (error) {
      console.error(
        "Failed to delete learning resource:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete learning resource",
      });
    }
  }
);


// ======================================================
// TOGGLE ACTIVE / INACTIVE
// PATCH /api/admin/learning-resources/:id/status
// ======================================================

router.patch(
  "/:id/status",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        isActive,
      } = req.body;


      if (
        typeof isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          message:
            "isActive must be true or false",
        });
      }


      const resource =
        await LearningResource.findByIdAndUpdate(
          req.params.id,

          {
            isActive,
          },

          {
            returnDocument: "after",
            runValidators: true,
          }
        );


      if (!resource) {
        return res.status(404).json({
          message:
            "Learning resource not found",
        });
      }


      res.json({
        message:
          isActive
            ? "Resource activated successfully"
            : "Resource deactivated successfully",

        resource,
      });

    } catch (error) {
      console.error(
        "Failed to update resource status:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update resource status",
      });
    }
  }
);


module.exports = router;