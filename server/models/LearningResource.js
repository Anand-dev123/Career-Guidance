const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    career: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Video",
        "Article",
        "Course",
        "Documentation",
        "Practice",
        "Project",
      ],
      default: "Article",
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    estimatedMinutes: {
      type: Number,
      default: 30,
      min: 1,
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "LearningResource",
    learningResourceSchema
  );