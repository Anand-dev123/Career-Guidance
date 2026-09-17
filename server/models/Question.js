const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [String],
            required: true
        },

        correctAnswer: {
            type: String,
            required: true
        },

        skill: {
            type: String,
            required: true
        },

        career: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        },

        marks: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Question", questionSchema);