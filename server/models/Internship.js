const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "Remote",
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote",
    },

    career: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    duration: {
      type: String,
      default: "",
    },

    stipend: {
      type: String,
      default: "Not specified",
    },

    applyUrl: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      default: "Manual",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Internship",
  internshipSchema
);