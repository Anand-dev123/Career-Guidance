const express = require("express");

const User = require("../models/User");
const Internship = require("../models/Internship");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// SAVE INTERNSHIP
// ==========================================

router.post(
  "/:id/save",
  protect,
  async (req, res) => {
    try {
      const internship =
        await Internship.findById(req.params.id);

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: "Internship not found.",
        });
      }

      const user =
        await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const alreadySaved =
        user.savedInternships.some(
          (id) =>
            id.toString() ===
            internship._id.toString()
        );

      if (alreadySaved) {
        return res.status(400).json({
          success: false,
          message: "Internship already saved.",
        });
      }

      user.savedInternships.push(
        internship._id
      );

      await user.save();

      res.json({
        success: true,
        message:
          "Internship saved successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to save internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to save internship.",
      });
    }
  }
);

// ==========================================
// UNSAVE INTERNSHIP
// ==========================================

router.delete(
  "/:id/save",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      user.savedInternships =
        user.savedInternships.filter(
          (id) =>
            id.toString() !==
            req.params.id
        );

      await user.save();

      res.json({
        success: true,
        message:
          "Internship removed from saved list.",
      });
    } catch (error) {
      console.error(
        "Failed to unsave internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to remove saved internship.",
      });
    }
  }
);

// ==========================================
// GET SAVED INTERNSHIPS
// ==========================================

router.get(
  "/saved",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(req.userId)
          .populate("savedInternships");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.json({
        success: true,
        count:
          user.savedInternships.length,
        internships:
          user.savedInternships,
      });
    } catch (error) {
      console.error(
        "Failed to fetch saved internships:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch saved internships.",
      });
    }
  }
);

// ==========================================
// APPLY FOR INTERNSHIP
// ==========================================

router.post(
  "/:id/apply",
  protect,
  async (req, res) => {
    try {
      const internship =
        await Internship.findById(req.params.id);

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: "Internship not found.",
        });
      }

      const user =
        await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const existingApplication =
        user.internshipApplications.find(
          (application) =>
            application.internship
              ?.toString() ===
            internship._id.toString()
        );

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message:
            "You have already applied for this internship.",
          application:
            existingApplication,
        });
      }

      const application = {
        internship: internship._id,
        status: "Applied",
        appliedAt: new Date(),
      };

      user.internshipApplications.push(
        application
      );

      // Automatically save internship
      const alreadySaved =
        user.savedInternships.some(
          (id) =>
            id.toString() ===
            internship._id.toString()
        );

      if (!alreadySaved) {
        user.savedInternships.push(
          internship._id
        );
      }

      await user.save();

      res.json({
        success: true,
        message:
          "Internship application recorded successfully.",
        application:
          user.internshipApplications[
            user.internshipApplications.length - 1
          ],
      });
    } catch (error) {
      console.error(
        "Failed to apply for internship:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to apply for internship.",
      });
    }
  }
);

// ==========================================
// GET APPLICATIONS
// ==========================================

router.get(
  "/applications",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(req.userId)
          .populate(
            "internshipApplications.internship"
          );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.json({
        success: true,
        count:
          user.internshipApplications.length,
        applications:
          user.internshipApplications,
      });
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch applications.",
      });
    }
  }
);

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================

router.patch(
  "/:id/status",
  protect,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Saved",
        "Applied",
        "Interview",
        "Selected",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status.",
        });
      }

      const user =
        await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const application =
        user.internshipApplications.find(
          (item) =>
            item.internship?.toString() ===
            req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Internship application not found.",
        });
      }

      application.status = status;

      if (
        status === "Applied" &&
        !application.appliedAt
      ) {
        application.appliedAt =
          new Date();
      }

      await user.save();

      res.json({
        success: true,
        message:
          "Application status updated successfully.",
        application,
      });
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update application status.",
      });
    }
  }
);

module.exports = router;