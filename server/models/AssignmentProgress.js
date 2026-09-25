const mongoose = require("mongoose");

// ==========================================
// Assignment Progress Schema
// ==========================================

const assignmentProgressSchema = new mongoose.Schema(
  {
    // User who completed the assignment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Assignment reference
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    // Completion status
    completed: {
      type: Boolean,
      default: false,
    },

    // Date and time of completion
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
// One progress record per user + assignment
// ==========================================

assignmentProgressSchema.index(
  {
    user: 1,
    assignment: 1,
  },
  {
    unique: true,
  }
);


// ==========================================
// Export Model
// ==========================================

module.exports = mongoose.model(
  "AssignmentProgress",
  assignmentProgressSchema
);