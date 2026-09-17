const express = require("express");

const Career = require("../models/Career");

const router = express.Router();

// Get all careers
router.get("/", async (req, res) => {
    try {
        const careers = await Career.find();

        res.json(careers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch careers"
        });
    }
});

module.exports = router;