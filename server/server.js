const userRoutes = require("./routes/userRoutes");
const careerRoutes = require("./routes/careerRoutes");
const skillRoutes = require("./routes/skillRoutes");
const questionRoutes = require("./routes/questionRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/assessments", assessmentRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Intelligent Career Guidance API is running!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});