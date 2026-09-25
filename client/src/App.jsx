import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// Student Pages
// ==========================================

import MySkills from "./pages/MySkills";
import Assessment from "./pages/Assessment";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CareerExplorer from "./pages/CareerExplorer";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Roadmap from "./pages/Roadmap";
import Progress from "./pages/Progress";
import Assignments from "./pages/Assignments";
import StudyPlanner from "./pages/StudyPlanner";
import LearningHub from "./pages/LearningHub";
import Internships from "./pages/Internships";

// ==========================================
// Admin Pages
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCareers from "./pages/AdminCareers";
import AdminSkills from "./pages/AdminSkills";
import AdminQuestions from "./pages/AdminQuestions";
import AdminRoadmaps from "./pages/AdminRoadmaps";
import AdminLearningResources from "./pages/AdminLearningResources";
import AdminAssignments from "./pages/AdminAssignments";
import AdminInternships from "./pages/AdminInternships";

// ==========================================
// Components
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================
            Public Routes
        ================================== */}

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Reset Password */}
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* ==================================
            Student Routes
        ================================== */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* My Skills */}
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <MySkills />
            </ProtectedRoute>
          }
        />

        {/* Career Explorer */}
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <CareerExplorer />
            </ProtectedRoute>
          }
        />

        {/* Career Assessment */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />

        {/* Resume Analyzer */}
        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />

        {/* Learning Roadmap */}
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />

        {/* Progress */}
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        {/* Assignments */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />

        {/* Study Planner */}
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <StudyPlanner />
            </ProtectedRoute>
          }
        />

        {/* Learning Hub */}
        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <LearningHub />
            </ProtectedRoute>
          }
        />

        {/* Internships */}
        <Route
          path="/internships"
          element={
            <ProtectedRoute>
              <Internships />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            Admin Routes
        ================================== */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >

          {/* Admin Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Manage Students */}
          <Route
            path="students"
            element={<AdminStudents />}
          />

          {/* Manage Careers */}
          <Route
            path="careers"
            element={<AdminCareers />}
          />

          {/* Manage Skills */}
          <Route
            path="skills"
            element={<AdminSkills />}
          />

          {/* Manage Questions */}
          <Route
            path="questions"
            element={<AdminQuestions />}
          />

          {/* Manage Roadmaps */}
          <Route
            path="roadmaps"
            element={<AdminRoadmaps />}
          />

          {/* Manage Learning Resources */}
          <Route
            path="resources"
            element={<AdminLearningResources />}
          />

          {/* Manage Assignments */}
          <Route
            path="assignments"
            element={<AdminAssignments />}
          />

          {/* Manage Internships */}
          <Route
            path="internships"
            element={<AdminInternships />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;