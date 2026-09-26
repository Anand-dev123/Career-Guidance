const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fileName: {
            type: String,
            default: ""
        },

        // ==========================================
        // Skills
        // ==========================================

        skills: [
            {
                name: String,
                level: String,
                score: Number,
                evidence: String
            }
        ],

        // ==========================================
        // Resume Sections
        // ==========================================

        education: {
            type: [String],
            default: []
        },

        experience: {
            type: [String],
            default: []
        },

        projects: {
            type: [String],
            default: []
        },

        certifications: {
            type: [String],
            default: []
        },

        // ==========================================
        // Resume Insights
        // ==========================================

        strengths: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        suggestions: {
            type: [String],
            default: []
        },

        // ==========================================
        // Career Matches
        // ==========================================

        careerMatches: [
            {
                career: String,
                reason: String
            }
        ],

        // ==========================================
        // Resume Score
        // ==========================================

        resumeScore: {
            type: Number,
            default: 0
        },

        scoreCategory: {
            type: String,
            default: "Needs Improvement"
        },

        // ==========================================
        // Resume Score Breakdown
        // ==========================================

        scoreBreakdown: {
            skillStrength: {
                type: Number,
                default: 0
            },

            projectStrength: {
                type: Number,
                default: 0
            },

            experienceStrength: {
                type: Number,
                default: 0
            },

            educationStrength: {
                type: Number,
                default: 0
            },

            certificationStrength: {
                type: Number,
                default: 0
            },

            careerAlignment: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "ResumeAnalysis",
        resumeAnalysisSchema
    );