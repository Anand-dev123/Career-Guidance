const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
    {
        career: {
            type: String,
            required: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        prerequisites: {
            type: [String],
            default: []
        },

        difficulty: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        },

        estimatedWeeks: {
            type: Number,
            default: 2
        },

        resources: {
            type: [String],
            default: []
        },

        order: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Roadmap",
        roadmapSchema
    );