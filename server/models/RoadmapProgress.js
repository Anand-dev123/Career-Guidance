const mongoose = require("mongoose");

const roadmapProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        career: {
            type: String,
            required: true,
            trim: true
        },

        completedSteps: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Roadmap"
            }
        ]
    },
    {
        timestamps: true
    }
);

roadmapProgressSchema.index(
    { user: 1, career: 1 },
    { unique: true }
);

module.exports =
    mongoose.model(
        "RoadmapProgress",
        roadmapProgressSchema
    );