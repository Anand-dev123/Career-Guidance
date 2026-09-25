const mongoose = require("mongoose");

// ==========================================
// Study Plan Schema
// ==========================================

const studyPlanSchema = new mongoose.Schema(
  {
    // User who created the study task
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Study task date
    date: {
      type: Date,
      required: true,
    },

    // Task title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Task description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Related skill
    skill: {
      type: String,
      default: "",
      trim: true,
    },

    // Estimated study time in minutes
    duration: {
      type: Number,
      default: 60,
      min: 1,
    },

    // Completion status
    completed: {
      type: Boolean,
      default: false,
    },

    // Completion timestamp
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model(
  "StudyPlan",
  studyPlanSchema
);