const mongoose = require("mongoose");


// ==========================================
// Assignment Schema
// ==========================================

const assignmentSchema = new mongoose.Schema(
  {
    // Assignment title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Assignment description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Related career
    career: {
      type: String,
      required: true,
      trim: true,
    },

    // Skill related to assignment
    skill: {
      type: String,
      required: true,
      trim: true,
    },

    // Difficulty level
    difficulty: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    // Estimated completion time in minutes
    estimatedTime: {
      type: Number,
      default: 30,
    },

    // Learning resources / links
    resources: {
      type: [String],
      default: [],
    },

    // Order in the learning sequence
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// Export Model
// ==========================================

module.exports =
  mongoose.model(
    "Assignment",
    assignmentSchema
  );