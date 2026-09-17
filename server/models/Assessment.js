const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        overallScore: {
            type: Number,
            required: true
        },

        totalScore: {
            type: Number,
            required: true
        },

        maxScore: {
            type: Number,
            required: true
        },

        skillResults: [
            {
                skill: {
                    type: String,
                    required: true
                },

                score: {
                    type: Number,
                    required: true
                },

                maxScore: {
                    type: Number,
                    required: true
                },

                percentage: {
                    type: Number,
                    required: true
                },

                level: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Assessment",
    assessmentSchema
);