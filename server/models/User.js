const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        education: {
            type: String,
            default: ""
        },

        college: {
            type: String,
            default: ""
        },

        year: {
            type: String,
            default: ""
        },

        targetCareer: {
            type: String,
            default: ""
        },

        skills: {
            type: Map,
            of: Number,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);