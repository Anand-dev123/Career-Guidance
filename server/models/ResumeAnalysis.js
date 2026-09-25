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

        skills: [
            {
                name: String,
                level: String,
                evidence: String
            }
        ],

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

        careerMatches: [
            {
                career: String,
                reason: String
            }
        ]
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