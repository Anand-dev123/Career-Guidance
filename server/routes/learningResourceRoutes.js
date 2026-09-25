const express = require("express");

const LearningResource = require("../models/LearningResource");
const Assessment = require("../models/Assessment");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL ACTIVE LEARNING RESOURCES
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const resources = await LearningResource.find({
      isActive: true,
    }).sort({
      order: 1,
      createdAt: 1,
    });

    res.json(resources);
  } catch (error) {
    console.error(
      "Failed to fetch learning resources:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch learning resources",
    });
  }
});


// ==========================================
// GET PERSONALIZED RECOMMENDATIONS
// ==========================================

router.get(
  "/recommendations",
  protect,
  async (req, res) => {
    try {
      // --------------------------------------
      // Get logged-in user
      // --------------------------------------

      const user = await User.findById(
        req.userId
      ).select(
        "targetCareer"
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // --------------------------------------
      // Target career check
      // --------------------------------------

      if (!user.targetCareer) {
        return res.json({
          targetCareer: "",
          recommendations: [],
          message:
            "Please select a target career first.",
        });
      }

      // --------------------------------------
      // Get latest assessment
      // --------------------------------------

      const latestAssessment =
        await Assessment.findOne({
          user: req.userId,
        }).sort({
          createdAt: -1,
        });

      if (!latestAssessment) {
        return res.json({
          targetCareer: user.targetCareer,
          recommendations: [],
          message:
            "Complete your career assessment first.",
        });
      }

      // --------------------------------------
      // Find skill gaps
      // --------------------------------------

      const skillGaps =
        latestAssessment.skillResults
          .filter(
            (skill) => skill.percentage < 80
          )
          .map((skill) => ({
            skill: skill.skill,
            percentage: skill.percentage,
          }));

      // --------------------------------------
      // If no skill gaps
      // --------------------------------------

      if (skillGaps.length === 0) {
        return res.json({
          targetCareer: user.targetCareer,
          recommendations: [],
          message:
            "Great! No major skill gaps were found.",
        });
      }

      // --------------------------------------
      // Get resources for target career
      // --------------------------------------

      const resources =
        await LearningResource.find({
          career: user.targetCareer,
          isActive: true,
        });

      // --------------------------------------
      // Match resources with skill gaps
      // --------------------------------------

      const recommendations =
        resources
          .map((resource) => {
            const matchedSkill =
              skillGaps.find(
                (gap) =>
                  gap.skill.toLowerCase() ===
                  resource.skill.toLowerCase()
              );

            if (!matchedSkill) {
              return null;
            }

            return {
              ...resource.toObject(),

              currentPercentage:
                matchedSkill.percentage,

              gap:
                100 -
                matchedSkill.percentage,

              recommendationReason:
                `Your current ${matchedSkill.skill} score is ${matchedSkill.percentage}%. This resource can help you improve this skill.`,
            };
          })
          .filter(Boolean);

      // --------------------------------------
      // Sort by largest skill gap
      // --------------------------------------

      recommendations.sort(
        (a, b) => b.gap - a.gap
      );

      // --------------------------------------
      // Return top recommendations
      // --------------------------------------

      res.json({
        targetCareer: user.targetCareer,

        skillGaps,

        recommendations:
          recommendations.slice(0, 6),
      });
    } catch (error) {
      console.error(
        "Failed to generate learning recommendations:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to generate learning recommendations",
      });
    }
  }
);


// ==========================================
// GET RESOURCES BY CAREER
// ==========================================

router.get(
  "/career/:career",
  protect,
  async (req, res) => {
    try {
      const career = decodeURIComponent(
        req.params.career
      );

      const resources =
        await LearningResource.find({
          career,
          isActive: true,
        }).sort({
          order: 1,
          createdAt: 1,
        });

      res.json(resources);
    } catch (error) {
      console.error(
        "Failed to fetch career resources:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch career resources",
      });
    }
  }
);


// ==========================================
// GET RESOURCES BY SKILL
// ==========================================

router.get(
  "/skill/:skill",
  protect,
  async (req, res) => {
    try {
      const skill = decodeURIComponent(
        req.params.skill
      );

      const resources =
        await LearningResource.find({
          skill,
          isActive: true,
        }).sort({
          order: 1,
          createdAt: 1,
        });

      res.json(resources);
    } catch (error) {
      console.error(
        "Failed to fetch skill resources:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch skill resources",
      });
    }
  }
);


// ==========================================
// GET SINGLE RESOURCE
// ==========================================

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const resource =
        await LearningResource.findOne({
          _id: req.params.id,
          isActive: true,
        });

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


module.exports = router;