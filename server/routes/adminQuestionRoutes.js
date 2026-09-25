const express = require("express");

const Question = require("../models/Question");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// GET ALL QUESTIONS
// GET /api/admin/questions
// ======================================================

router.get("/", protect, adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ skill: 1, difficulty: 1, createdAt: -1 });

    res.json(questions);
  } catch (error) {
    console.error(
      "Failed to fetch questions:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
});


// ======================================================
// GET SINGLE QUESTION
// GET /api/admin/questions/:id
// ======================================================

router.get("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json(question);
  } catch (error) {
    console.error(
      "Failed to fetch question:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch question",
    });
  }
});


// ======================================================
// CREATE QUESTION
// POST /api/admin/questions
// ======================================================

router.post("/", protect, adminMiddleware, async (req, res) => {
  try {
    const {
      question,
      options,
      correctAnswer,
      skill,
      career,
      difficulty,
      marks,
    } = req.body;


    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (
      !question ||
      !skill ||
      !career ||
      !correctAnswer
    ) {
      return res.status(400).json({
        message:
          "Question, skill, career and correct answer are required",
      });
    }


    if (
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        message:
          "At least 2 options are required",
      });
    }


    if (
      !options.includes(correctAnswer)
    ) {
      return res.status(400).json({
        message:
          "Correct answer must be one of the options",
      });
    }


    // -----------------------------------------------
    // Create Question
    // -----------------------------------------------

    const newQuestion =
      await Question.create({
        question: question.trim(),

        options: options
          .map((item) => item.trim())
          .filter(Boolean),

        correctAnswer:
          correctAnswer.trim(),

        skill: skill.trim(),

        career: career.trim(),

        difficulty:
          difficulty || "Easy",

        marks:
          Number(marks) || 1,
      });


    res.status(201).json({
      message:
        "Question created successfully",

      question: newQuestion,
    });

  } catch (error) {
    console.error(
      "Failed to create question:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create question",
    });
  }
});


// ======================================================
// UPDATE QUESTION
// PUT /api/admin/questions/:id
// ======================================================

router.put("/:id", protect, adminMiddleware, async (req, res) => {
  try {
    const {
      question,
      options,
      correctAnswer,
      skill,
      career,
      difficulty,
      marks,
    } = req.body;


    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (
      !question ||
      !skill ||
      !career ||
      !correctAnswer
    ) {
      return res.status(400).json({
        message:
          "Question, skill, career and correct answer are required",
      });
    }


    if (
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        message:
          "At least 2 options are required",
      });
    }


    if (
      !options.includes(correctAnswer)
    ) {
      return res.status(400).json({
        message:
          "Correct answer must be one of the options",
      });
    }


    // -----------------------------------------------
    // Update
    // -----------------------------------------------

    const updatedQuestion =
      await Question.findByIdAndUpdate(
        req.params.id,

        {
          question: question.trim(),

          options: options
            .map((item) => item.trim())
            .filter(Boolean),

          correctAnswer:
            correctAnswer.trim(),

          skill: skill.trim(),

          career: career.trim(),

          difficulty:
            difficulty || "Easy",

          marks:
            Number(marks) || 1,
        },

        {
          returnDocument: "after",
          runValidators: true,
        }
      );


    if (!updatedQuestion) {
      return res.status(404).json({
        message:
          "Question not found",
      });
    }


    res.json({
      message:
        "Question updated successfully",

      question: updatedQuestion,
    });

  } catch (error) {
    console.error(
      "Failed to update question:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to update question",
    });
  }
});


// ======================================================
// DELETE QUESTION
// DELETE /api/admin/questions/:id
// ======================================================

router.delete(
  "/:id",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const question =
        await Question.findByIdAndDelete(
          req.params.id
        );


      if (!question) {
        return res.status(404).json({
          message:
            "Question not found",
        });
      }


      res.json({
        message:
          "Question deleted successfully",
      });

    } catch (error) {
      console.error(
        "Failed to delete question:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete question",
      });
    }
  }
);


module.exports = router;