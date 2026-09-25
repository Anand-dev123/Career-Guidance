const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ==========================================
// Database
// ==========================================

const connectDB = require("./config/db");

// ==========================================
// Routes
// ==========================================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const careerRoutes = require("./routes/careerRoutes");
const skillRoutes = require("./routes/skillRoutes");
const questionRoutes = require("./routes/questionRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const roadmapRoutes = require("./routes/roadmapRoutes");
const roadmapProgressRoutes = require("./routes/roadmapProgressRoutes");

const assignmentRoutes = require("./routes/assignmentRoutes");
const assignmentProgressRoutes = require("./routes/assignmentProgressRoutes");

const studyPlanRoutes = require("./routes/studyPlanRoutes");

const learningResourceRoutes = require("./routes/learningResourceRoutes");
const internshipApplicationRoutes = require("./routes/internshipApplicationRoutes");

// ==========================================
// Admin Routes
// ==========================================

const adminRoutes = require("./routes/adminRoutes");
const adminSkillRoutes = require("./routes/adminSkillRoutes");
const adminQuestionRoutes = require("./routes/adminQuestionRoutes");
const adminRoadmapRoutes = require("./routes/adminRoadmapRoutes");
const adminLearningResourceRoutes = require("./routes/adminLearningResourceRoutes");
const adminAssignmentRoutes = require("./routes/adminAssignmentRoutes");
const adminInternshipRoutes = require("./routes/adminInternshipRoutes");

// ==========================================
// Internship Routes
// ==========================================

const internshipRoutes = require("./routes/internshipRoutes");

// ==========================================
// App
// ==========================================

const app = express();

// ==========================================
// Database Connection
// ==========================================

connectDB();

// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// Authentication Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

// ==========================================
// Student Routes
// ==========================================

app.use("/api/careers", careerRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/assessments", assessmentRoutes);

app.use("/api/resumes", resumeRoutes);

app.use("/api/roadmaps", roadmapRoutes);

app.use("/api/roadmap-progress", roadmapProgressRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/assignment-progress", assignmentProgressRoutes);

app.use("/api/study-plans", studyPlanRoutes);

app.use("/api/learning-resources", learningResourceRoutes);
app.use("/api/internship-applications", internshipApplicationRoutes);

// ==========================================
// Admin Routes
// ==========================================

app.use("/api/admin/skills", adminSkillRoutes);

app.use("/api/admin/questions", adminQuestionRoutes);

app.use("/api/admin/roadmaps", adminRoadmapRoutes);

app.use("/api/admin/learning-resources", adminLearningResourceRoutes);

app.use("/api/admin/assignments", adminAssignmentRoutes);

// General Admin Routes
app.use("/api/admin", adminRoutes);

// ==========================================
// Internship Routes
// ==========================================

// Student Internship APIs
app.use("/api/internships", internshipRoutes);

// Admin Internship APIs
app.use("/api/admin/internships", adminInternshipRoutes);

// ==========================================
// Test Route
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Intelligent Career Guidance API is running!",
  });
});

// ==========================================
// Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
