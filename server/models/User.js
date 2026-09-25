const mongoose = require("mongoose");

// ==========================================
// Internship Application Schema
// ==========================================

const internshipApplicationSchema =
  new mongoose.Schema(
    {
      internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Saved",
          "Applied",
          "Interview",
          "Selected",
          "Rejected",
        ],
        default: "Saved",
      },

      appliedAt: {
        type: Date,
        default: null,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

// ==========================================
// User Schema
// ==========================================

const userSchema = new mongoose.Schema(
  {
    // ======================================
    // Basic Information
    // ======================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ======================================
    // Education
    // ======================================

    education: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    // ======================================
    // Career
    // ======================================

    targetCareer: {
      type: String,
      default: "",
    },

    // ======================================
    // Role
    // ======================================

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // ======================================
    // Password Reset
    // ======================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // ======================================
    // Skills
    // ======================================

    skills: {
      type: Map,
      of: Number,
      default: {},
    },

    // ======================================
    // Saved Internships
    // ======================================

    savedInternships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
      },
    ],

    // ======================================
    // Internship Applications
    // ======================================

    internshipApplications: [
      internshipApplicationSchema,
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);