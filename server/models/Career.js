const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        requiredSkills: {
            type: [String],
            default: []
        },

        roadmap: {
            type: [String],
            default: []
        },

        difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Intermediate"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Career", careerSchema);