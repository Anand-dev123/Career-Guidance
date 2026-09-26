const express = require("express");
const multer = require("multer");
const path = require("path");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const ResumeAnalysis = require("../models/ResumeAnalysis");
const Career = require("../models/Career");

const authMiddleware = require("../middleware/authMiddleware");

const {
  extractSkillsWithLevels,
} = require("../algorithms/resumeSkillExtractor");

const {
  recommendCareers,
} = require("../algorithms/careerRecommendation");

const {
  analyzeResumeText,
} = require("../services/resumeAnalyzer");

// ======================================================
// Resume Score Calculator
// ======================================================

const calculateResumeScore =
  require("../algorithms/resumeScore");

const router = express.Router();

// ======================================================
// MULTER CONFIGURATION
// ======================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".docx"];

    const extension =
      path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(
        new Error("Only PDF and DOCX files are allowed")
      );
    }

    cb(null, true);
  },
});

// ======================================================
// POST /api/resumes/upload
// Extract Resume Text
// ======================================================

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Resume file is required",
        });
      }

      const fileName =
        req.file.originalname;

      const extension =
        path.extname(fileName).toLowerCase();

      let resumeText = "";

      // ==================================================
      // PDF
      // ==================================================

      if (extension === ".pdf") {
        const pdfData =
          await pdfParse(req.file.buffer);

        resumeText =
          pdfData.text || "";
      }

      // ==================================================
      // DOCX
      // ==================================================

      else if (extension === ".docx") {
        const result =
          await mammoth.extractRawText({
            buffer: req.file.buffer,
          });

        resumeText =
          result.value || "";
      }

      // ==================================================
      // Validate Extracted Text
      // ==================================================

      if (!resumeText.trim()) {
        return res.status(400).json({
          message:
            "Could not extract text from resume",
        });
      }

      // ==================================================
      // Response
      // ==================================================

      return res.json({
        fileName,

        text: resumeText,

        textLength:
          resumeText.length,
      });

    } catch (error) {

      console.error(
        "Resume upload error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to upload resume",
      });
    }
  }
);

// ======================================================
// POST /api/resumes/analyze
// Resume Analysis + Career Recommendation + Resume Score
// ======================================================

router.post(
  "/analyze",
  authMiddleware,

  async (req, res) => {

    try {

      const {
        text,
        fileName
      } = req.body;

      if (
        !text ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            "Resume text is required",
        });
      }

      // ==================================================
      // STEP 1
      // Extract Skills
      // ==================================================

      const extractedSkills =
        extractSkillsWithLevels(
          text
        );

      // ==================================================
      // STEP 2
      // Convert Skills into Score Map
      // ==================================================

      const userSkills = {};

      extractedSkills.forEach(
        (skill) => {

          userSkills[skill.name] =
            skill.score;
        }
      );

      // ==================================================
      // STEP 3
      // Get Careers from MongoDB
      // ==================================================

      const careers =
        await Career.find({});

      // ==================================================
      // STEP 4
      // Calculate Career Recommendations
      // ==================================================

      const careerRecommendations =
        recommendCareers(
          userSkills,
          careers
        );

      // ==================================================
      // STEP 5
      // Basic Resume Information
      // ==================================================

      const education = [];
      const experience = [];
      const projects = [];
      const certifications = [];

      // ==================================================
      // STEP 6
      // Improved Resume Section Extraction
      // ==================================================

      const lines =
        text
          .split(/\r?\n/)
          .map(
            (line) =>
              line.trim()
          )
          .filter(Boolean);

      // ==================================================
      // Section Detection
      // ==================================================

      const sectionPatterns = {

        education: [
          "education",
          "academic background",
          "academic qualification",
          "qualifications",
        ],

        experience: [
          "experience",
          "work experience",
          "professional experience",
          "internship",
          "internships",
        ],

        projects: [
          "projects",
          "project",
          "academic projects",
          "personal projects",
        ],

        certifications: [
          "certifications",
          "certification",
          "certificates",
          "certificate",
        ],

        skills: [
          "technical skills",
          "skills",
          "technical skill",
          "core skills",
        ],
      };

      // ==================================================
      // Detect Section
      // ==================================================

      const detectSection =
        (line) => {

          const normalizedLine =
            line
              .toLowerCase()
              .replace(
                /[:\-|]/g,
                ""
              )
              .replace(
                /\s+/g,
                " "
              )
              .trim();

          for (
            const [
              section,
              patterns
            ]
              of Object.entries(
                sectionPatterns
              )
          ) {

            const isMatch =
              patterns.some(
                (pattern) => {

                  return (
                    normalizedLine ===
                      pattern ||

                    normalizedLine.startsWith(
                      pattern + " "
                    )
                  );
                }
              );

            if (isMatch) {
              return section;
            }
          }

          return null;
        };

      // ==================================================
      // Extract Sections
      // ==================================================

      let currentSection = null;

      lines.forEach(
        (line) => {

          const detectedSection =
            detectSection(line);

          // ==========================================
          // New Section Found
          // ==========================================

          if (detectedSection) {

            currentSection =
              detectedSection;

            return;
          }

          // ==========================================
          // Ignore Skills Section
          // ==========================================

          if (
            currentSection ===
            "skills"
          ) {
            return;
          }

          // ==========================================
          // Education
          // ==========================================

          if (
            currentSection ===
            "education"
          ) {

            education.push(line);

            return;
          }

          // ==========================================
          // Experience
          // ==========================================

          if (
            currentSection ===
            "experience"
          ) {

            experience.push(line);

            return;
          }

          // ==========================================
          // Projects
          // ==========================================

          if (
            currentSection ===
            "projects"
          ) {

            projects.push(line);

            return;
          }

          // ==========================================
          // Certifications
          // ==========================================

          if (
            currentSection ===
            "certifications"
          ) {

            certifications.push(line);

            return;
          }
        }
      );

      // ==================================================
      // STEP 7
      // Strengths & Resume Evidence
      // ==================================================

      const strengths = [];

      // ==================================================
      // Skill-Based Strengths
      // ==================================================

      extractedSkills
        .filter(
          (skill) =>
            skill.score >= 2
        )
        .forEach(
          (skill) => {

            if (
              skill.score >= 3
            ) {

              strengths.push(
                `Strong in ${skill.name}`
              );

            } else {

              strengths.push(
                `Working knowledge of ${skill.name}`
              );
            }
          }
        );

      // ==================================================
      // Project-Based Strengths
      // ==================================================

      const lowerResumeText =
        text.toLowerCase();

      if (
        lowerResumeText.includes(
          "full-stack"
        ) ||
        lowerResumeText.includes(
          "full stack"
        )
      ) {

        strengths.push(
          "Hands-on full-stack web development experience"
        );
      }

      if (
        lowerResumeText.includes(
          "rest api"
        ) ||
        lowerResumeText.includes(
          "restful api"
        )
      ) {

        strengths.push(
          "Experience developing REST APIs"
        );
      }

      if (
        lowerResumeText.includes(
          "jwt"
        )
      ) {

        strengths.push(
          "Experience implementing JWT authentication"
        );
      }

      if (
        lowerResumeText.includes(
          "mongodb"
        )
      ) {

        strengths.push(
          "Experience working with MongoDB"
        );
      }

      if (
        lowerResumeText.includes(
          "internship"
        )
      ) {

        strengths.push(
          "Practical internship experience"
        );
      }

      if (
        lowerResumeText.includes(
          "github"
        )
      ) {

        strengths.push(
          "Experience using Git and GitHub"
        );
      }

      // ==================================================
      // Project Evidence
      // ==================================================

      if (
        lowerResumeText.includes(
          "built"
        ) ||
        lowerResumeText.includes(
          "developed"
        ) ||
        lowerResumeText.includes(
          "implemented"
        )
      ) {

        strengths.push(
          "Hands-on project development experience"
        );
      }

      // ==================================================
      // Remove Duplicate Strengths
      // ==================================================

      const uniqueStrengths =
        [
          ...new Set(strengths)
        ];

      // ==================================================
      // STEP 8
      // Career-Specific Skill Gap
      // ==================================================

      const topCareer =
        careerRecommendations.length > 0
          ? careerRecommendations[0]
          : null;

      // Keep missing skills relevant
      // to the top career

      const allMissingSkills =
        topCareer
          ? topCareer.missingSkills
          : [];

      // ==================================================
      // STEP 9
      // Career-Specific Suggestions
      // ==================================================

      const suggestions = [];

      if (topCareer) {

        // Skills that need improvement

        topCareer.skillsToImprove.forEach(
          (skillData) => {

            suggestions.push(
              `Improve ${skillData.skill} from ${skillData.level} level to strengthen your ${topCareer.career} readiness.`
            );
          }
        );

        // Missing skills

        topCareer.missingSkills.forEach(
          (skill) => {

            suggestions.push(
              `Learn ${skill} to improve your ${topCareer.career} skill coverage.`
            );
          }
        );

      } else {

        suggestions.push(
          "Add more technical skills to your resume to generate career-specific recommendations."
        );
      }

      // ==================================================
      // STEP 10
      // Career Matches for ResumeAnalysis
      // ==================================================

      const careerMatches =
        careerRecommendations
          .slice(0, 5)
          .map(
            (career) => ({

              career:
                career.career,

              reason:
                career.recommendationReason,
            })
          );

      // ==================================================
      // STEP 11
      // Calculate Resume Score
      // ==================================================

      const resumeScoreData =
        calculateResumeScore({

          skills:
            extractedSkills,

          education,

          experience,

          projects,

          certifications,

          careerRecommendations
        });

      // ==================================================
      // STEP 12
      // Save Analysis to MongoDB
      // ==================================================

      const savedAnalysis =
        await ResumeAnalysis.create({

          user:
            req.userId,

          fileName:
            fileName || "",

          skills:
            extractedSkills,

          education,

          experience,

          projects,

          certifications,

          strengths:
            uniqueStrengths,

          missingSkills:
            allMissingSkills,

          suggestions,

          careerMatches,

          // ==========================================
          // Resume Score
          // ==========================================

          resumeScore:
            resumeScoreData.overallScore,

          scoreCategory:
            resumeScoreData.category,

          scoreBreakdown:
            resumeScoreData.breakdown
        });

      // ==================================================
      // STEP 13
      // Final Response
      // ==================================================

      return res.json({

        success: true,

        analysis: {

          id:
            savedAnalysis._id,

          fileName:
            savedAnalysis.fileName,

          skills:
            savedAnalysis.skills,

          education:
            savedAnalysis.education,

          experience:
            savedAnalysis.experience,

          projects:
            savedAnalysis.projects,

          certifications:
            savedAnalysis.certifications,

          strengths:
            savedAnalysis.strengths,

          missingSkills:
            savedAnalysis.missingSkills,

          suggestions:
            savedAnalysis.suggestions,

          careerMatches:
            savedAnalysis.careerMatches,

          // ==========================================
          // Resume Score
          // ==========================================

          resumeScore:
            savedAnalysis.resumeScore,

          scoreCategory:
            savedAnalysis.scoreCategory,

          scoreBreakdown:
            savedAnalysis.scoreBreakdown
        },

        // ==========================================
        // Career Recommendations
        // ==========================================

        careerRecommendations,

        // ==========================================
        // Resume Score Object
        // ==========================================

        resumeScore:
          resumeScoreData
      });

    } catch (error) {

      console.error(
        "Resume analysis error:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to analyze resume",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined
      });
    }
  }
);

// ======================================================
// Export
// ======================================================

module.exports = router;