const express = require("express");

const Internship = require("../models/Internship");
const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// GET ALL INTERNSHIPS
// ==========================================

router.get(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        career,
        mode,
        isActive,
        search,
      } = req.query;

      const filter = {};

      // Career filter
      if (career) {
        filter.career = career;
      }

      // Mode filter
      if (mode) {
        filter.mode = mode;
      }

      // Active / inactive filter
      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }

      // Search
      if (search) {
        filter.$or = [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            company: {
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
            location: {
              $regex: search,
              $options: "i",
            },
          },
          {
            skills: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      const internships =
        await Internship.find(filter).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        count: internships.length,
        internships,
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin internships:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch internships",
      });
    }
  }
);

// ==========================================
// GET SINGLE INTERNSHIP
// ==========================================

router.get(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const internship =
        await Internship.findById(
          req.params.id
        );

      if (!internship) {
        return res.status(404).json({
          success: false,
          message:
            "Internship not found",
        });
      }

      res.json({
        success: true,
        internship,
      });
    } catch (error) {
      console.error(
        "Failed to fetch internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch internship",
      });
    }
  }
);

// ==========================================
// CREATE INTERNSHIP
// ==========================================

router.post(
  "/",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        location,
        mode,
        career,
        skills,
        duration,
        stipend,
        applyUrl,
        source,
        isActive,
        deadline,
      } = req.body;

      // --------------------------------------
      // Validation
      // --------------------------------------

      if (
        !title ||
        !company ||
        !career ||
        !applyUrl
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, company, career and application URL are required.",
        });
      }

      // --------------------------------------
      // Mode validation
      // --------------------------------------

      if (
        mode &&
        ![
          "Remote",
          "On-site",
          "Hybrid",
        ].includes(mode)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid internship mode.",
        });
      }

      // --------------------------------------
      // Normalize skills
      // --------------------------------------

      let normalizedSkills = [];

      if (Array.isArray(skills)) {
        normalizedSkills = skills
          .map((skill) =>
            String(skill).trim()
          )
          .filter(Boolean);
      }

      // --------------------------------------
      // Deadline
      // --------------------------------------

      let normalizedDeadline = null;

      if (deadline) {
        const parsedDeadline =
          new Date(deadline);

        if (isNaN(parsedDeadline.getTime())) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid deadline date.",
          });
        }

        normalizedDeadline =
          parsedDeadline;
      }

      // --------------------------------------
      // Create Internship
      // --------------------------------------

      const internship =
        await Internship.create({
          title: title.trim(),

          company: company.trim(),

          description:
            description
              ? description.trim()
              : "",

          location:
            location
              ? location.trim()
              : "Remote",

          mode: mode || "Remote",

          career: career.trim(),

          skills: normalizedSkills,

          duration:
            duration
              ? duration.trim()
              : "",

          stipend:
            stipend
              ? stipend.trim()
              : "Not specified",

          applyUrl: applyUrl.trim(),

          source:
            source
              ? source.trim()
              : "Manual",

          isActive:
            isActive !== undefined
              ? Boolean(isActive)
              : true,

          deadline:
            normalizedDeadline,
        });

      res.status(201).json({
        success: true,
        message:
          "Internship created successfully.",
        internship,
      });
    } catch (error) {
      console.error(
        "Failed to create internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create internship",
      });
    }
  }
);

// ==========================================
// UPDATE INTERNSHIP
// ==========================================

router.put(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        location,
        mode,
        career,
        skills,
        duration,
        stipend,
        applyUrl,
        source,
        isActive,
        deadline,
      } = req.body;

      // --------------------------------------
      // Find internship
      // --------------------------------------

      const internship =
        await Internship.findById(
          req.params.id
        );

      if (!internship) {
        return res.status(404).json({
          success: false,
          message:
            "Internship not found",
        });
      }

      // --------------------------------------
      // Validation
      // --------------------------------------

      if (
        !title ||
        !company ||
        !career ||
        !applyUrl
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, company, career and application URL are required.",
        });
      }

      // --------------------------------------
      // Mode validation
      // --------------------------------------

      if (
        mode &&
        ![
          "Remote",
          "On-site",
          "Hybrid",
        ].includes(mode)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid internship mode.",
        });
      }

      // --------------------------------------
      // Normalize skills
      // --------------------------------------

      let normalizedSkills =
        internship.skills || [];

      if (Array.isArray(skills)) {
        normalizedSkills = skills
          .map((skill) =>
            String(skill).trim()
          )
          .filter(Boolean);
      }

      // --------------------------------------
      // Deadline
      // --------------------------------------

      let normalizedDeadline = null;

      if (deadline) {
        const parsedDeadline =
          new Date(deadline);

        if (isNaN(parsedDeadline.getTime())) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid deadline date.",
          });
        }

        normalizedDeadline =
          parsedDeadline;
      }

      // --------------------------------------
      // Update fields
      // --------------------------------------

      internship.title =
        title.trim();

      internship.company =
        company.trim();

      internship.description =
        description
          ? description.trim()
          : "";

      internship.location =
        location
          ? location.trim()
          : "Remote";

      internship.mode =
        mode || "Remote";

      internship.career =
        career.trim();

      internship.skills =
        normalizedSkills;

      internship.duration =
        duration
          ? duration.trim()
          : "";

      internship.stipend =
        stipend
          ? stipend.trim()
          : "Not specified";

      internship.applyUrl =
        applyUrl.trim();

      internship.source =
        source
          ? source.trim()
          : "Manual";

      internship.isActive =
        isActive !== undefined
          ? Boolean(isActive)
          : internship.isActive;

      internship.deadline =
        normalizedDeadline;

      await internship.save();

      res.json({
        success: true,
        message:
          "Internship updated successfully.",
        internship,
      });
    } catch (error) {
      console.error(
        "Failed to update internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update internship",
      });
    }
  }
);

// ==========================================
// TOGGLE ACTIVE / INACTIVE
// ==========================================

router.patch(
  "/:id/toggle",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const internship =
        await Internship.findById(
          req.params.id
        );

      if (!internship) {
        return res.status(404).json({
          success: false,
          message:
            "Internship not found",
        });
      }

      internship.isActive =
        !internship.isActive;

      await internship.save();

      res.json({
        success: true,
        message: internship.isActive
          ? "Internship activated successfully."
          : "Internship deactivated successfully.",
        internship,
      });
    } catch (error) {
      console.error(
        "Failed to toggle internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update internship status",
      });
    }
  }
);

// ==========================================
// DELETE INTERNSHIP
// ==========================================

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const internship =
        await Internship.findById(
          req.params.id
        );

      if (!internship) {
        return res.status(404).json({
          success: false,
          message:
            "Internship not found",
        });
      }

      await Internship.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Internship deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to delete internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete internship",
      });
    }
  }
);

module.exports = router;