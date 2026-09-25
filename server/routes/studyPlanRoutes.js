const express = require("express");

const StudyPlan = require("../models/StudyPlan");
const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Roadmap = require("../models/Roadmap");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL STUDY PLANS
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({
      user: req.userId,
    }).sort({
      date: 1,
      createdAt: 1,
    });

    res.json(studyPlans);
  } catch (error) {
    console.error(
      "Failed to fetch study plans:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch study plans",
    });
  }
});


// ==========================================
// GET PERSONALIZED STUDY RECOMMENDATIONS
// ==========================================

router.get(
  "/recommendations",
  protect,
  async (req, res) => {
    try {
      // ==========================================
      // Get User
      // ==========================================

      const user = await User.findById(
        req.userId
      ).select("targetCareer");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      // ==========================================
      // Target Career Check
      // ==========================================

      if (!user.targetCareer) {
        return res.json([]);
      }


      // ==========================================
      // Get Latest Assessment
      // ==========================================

      const assessment =
        await Assessment.findOne({
          user: req.userId,
        }).sort({
          createdAt: -1,
        });


      // ==========================================
      // Assessment Not Available
      // ==========================================

      if (!assessment) {
        return res.json([]);
      }


      // ==========================================
      // Convert Assessment Skills to Map
      // ==========================================

      const assessedSkills = new Map();


      (assessment.skillResults || []).forEach(
        (result) => {
          const normalizedSkill =
            String(result.skill || "")
              .toLowerCase()
              .trim();

          assessedSkills.set(
            normalizedSkill,
            {
              percentage:
                Number(
                  result.percentage
                ) || 0,

              level:
                result.level ||
                "Not Assessed",
            }
          );
        }
      );


      // ==========================================
      // Get Target Career Roadmap
      // ==========================================

      const roadmap =
        await Roadmap.find({
          career: user.targetCareer,
        }).sort({
          order: 1,
        });


      // ==========================================
      // No Roadmap
      // ==========================================

      if (roadmap.length === 0) {
        return res.json([]);
      }


      // ==========================================
      // Generate Grouped Recommendations
      //
      // One roadmap step = One recommendation
      // ==========================================

      const recommendations = [];


      roadmap.forEach((step) => {
        const stepSkills =
          step.skills || [];


        // Skip empty roadmap steps
        if (stepSkills.length === 0) {
          return;
        }


        // ==========================================
        // Analyze all skills in this step
        // ==========================================

        const skillAnalysis =
          stepSkills.map(
            (skill) => {
              const normalizedSkill =
                String(skill || "")
                  .toLowerCase()
                  .trim();


              const assessmentSkill =
                assessedSkills.get(
                  normalizedSkill
                );


              // Skill exists in assessment
              if (assessmentSkill) {
                return {
                  skill,

                  percentage:
                    Number(
                      assessmentSkill.percentage
                    ) || 0,

                  level:
                    assessmentSkill.level ||
                    "Needs Improvement",

                  assessed: true,
                };
              }


              // Skill not assessed
              return {
                skill,

                percentage: 0,

                level:
                  "Not Assessed",

                assessed: false,
              };
            }
          );


        // ==========================================
        // Find Skills That Need Learning
        // ==========================================

        const gapSkills =
          skillAnalysis.filter(
            (skill) =>
              !skill.assessed ||
              skill.percentage < 80
          );


        // ==========================================
        // If all skills are strong,
        // skip this roadmap step
        // ==========================================

        if (gapSkills.length === 0) {
          return;
        }


        // ==========================================
        // Find Lowest Performing Skill
        // ==========================================

        const lowestSkill =
          [...gapSkills].sort(
            (a, b) =>
              a.percentage -
              b.percentage
          )[0];


        // ==========================================
        // Create ONE recommendation
        // for the complete roadmap step
        // ==========================================

        recommendations.push({
          title:
            step.title,

          description:
            step.description || "",

          skills:
            gapSkills.map(
              (skill) =>
                skill.skill
            ),

          currentPercentage:
            lowestSkill.percentage,

          level:
            lowestSkill.level,

          difficulty:
            step.difficulty ||
            "Beginner",

          estimatedWeeks:
            step.estimatedWeeks ||
            1,

          resources:
            step.resources ||
            [],

          priority:
            100 -
            lowestSkill.percentage,
        });
      });


      // ==========================================
      // Sort By Highest Priority
      // ==========================================

      recommendations.sort(
        (a, b) =>
          b.priority -
          a.priority
      );


      // ==========================================
      // Return Top 5
      // ==========================================

      res.json(
        recommendations.slice(0, 5)
      );

    } catch (error) {
      console.error(
        "Failed to generate study recommendations:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to generate study recommendations",
      });
    }
  }
);


// ==========================================
// GET STUDY PLANS BY DATE
// ==========================================

router.get(
  "/date/:date",
  protect,
  async (req, res) => {
    try {
      const startDate = new Date(
        `${req.params.date}T00:00:00`
      );

      const endDate = new Date(
        `${req.params.date}T23:59:59.999`
      );


      // ==========================================
      // Validate Date
      // ==========================================

      if (
        Number.isNaN(
          startDate.getTime()
        ) ||
        Number.isNaN(
          endDate.getTime()
        )
      ) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }


      const studyPlans =
        await StudyPlan.find({
          user: req.userId,

          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }).sort({
          createdAt: 1,
        });


      res.json(studyPlans);

    } catch (error) {
      console.error(
        "Failed to fetch study plans by date:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch study plans by date",
      });
    }
  }
);


// ==========================================
// CREATE STUDY PLAN
// ==========================================

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        date,
        title,
        description,
        skill,
        duration,
      } = req.body;


      // ==========================================
      // Validation
      // ==========================================

      if (!date || !title) {
        return res.status(400).json({
          message:
            "date and title are required",
        });
      }


      // ==========================================
      // Create Study Plan
      // ==========================================

      const studyPlan =
        await StudyPlan.create({
          user: req.userId,

          date,

          title:
            title.trim(),

          description:
            description
              ? description.trim()
              : "",

          skill:
            skill
              ? skill.trim()
              : "",

          duration:
            Number(duration) > 0
              ? Number(duration)
              : 60,
        });


      res.status(201).json({
        message:
          "Study plan created successfully",

        studyPlan,
      });

    } catch (error) {
      console.error(
        "Failed to create study plan:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create study plan",
      });
    }
  }
);


// ==========================================
// UPDATE STUDY PLAN
// ==========================================

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const studyPlan =
        await StudyPlan.findOne({
          _id: req.params.id,
          user: req.userId,
        });


      if (!studyPlan) {
        return res.status(404).json({
          message:
            "Study plan not found",
        });
      }


      const {
        date,
        title,
        description,
        skill,
        duration,
        completed,
      } = req.body;


      // ==========================================
      // Update Fields
      // ==========================================

      if (date !== undefined) {
        studyPlan.date = date;
      }


      if (title !== undefined) {
        studyPlan.title =
          String(title).trim();
      }


      if (
        description !==
        undefined
      ) {
        studyPlan.description =
          String(description).trim();
      }


      if (skill !== undefined) {
        studyPlan.skill =
          String(skill).trim();
      }


      if (duration !== undefined) {
        const newDuration =
          Number(duration);

        if (newDuration > 0) {
          studyPlan.duration =
            newDuration;
        }
      }


      // ==========================================
      // Completion Status
      // ==========================================

      if (
        completed !==
        undefined
      ) {
        studyPlan.completed =
          Boolean(completed);

        studyPlan.completedAt =
          studyPlan.completed
            ? new Date()
            : null;
      }


      await studyPlan.save();


      res.json({
        message:
          "Study plan updated successfully",

        studyPlan,
      });

    } catch (error) {
      console.error(
        "Failed to update study plan:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update study plan",
      });
    }
  }
);


// ==========================================
// MARK STUDY PLAN AS COMPLETE
// ==========================================

router.put(
  "/:id/complete",
  protect,
  async (req, res) => {
    try {
      const studyPlan =
        await StudyPlan.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.userId,
          },

          {
            completed: true,
            completedAt:
              new Date(),
          },

          {
            returnDocument:
              "after",

            runValidators: true,
          }
        );


      if (!studyPlan) {
        return res.status(404).json({
          message:
            "Study plan not found",
        });
      }


      res.json({
        message:
          "Study plan marked as completed",

        studyPlan,
      });

    } catch (error) {
      console.error(
        "Failed to complete study plan:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to complete study plan",
      });
    }
  }
);


// ==========================================
// DELETE STUDY PLAN
// ==========================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const studyPlan =
        await StudyPlan.findOneAndDelete({
          _id: req.params.id,
          user: req.userId,
        });


      if (!studyPlan) {
        return res.status(404).json({
          message:
            "Study plan not found",
        });
      }


      res.json({
        message:
          "Study plan deleted successfully",
      });

    } catch (error) {
      console.error(
        "Failed to delete study plan:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete study plan",
      });
    }
  }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;