import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  Brain,
  ClipboardCheck,
  BookOpen,
  Map,
  FileText,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  UserCog,
  Database,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      if (stats) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [statsResponse, studentsResponse] =
        await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/students/recent"),
        ]);

      setStats(statsResponse.data);
      setRecentStudents(studentsResponse.data);
    } catch (error) {
      console.error(
        "Failed to load admin dashboard:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "Access denied. Admin privileges are required."
        );
      } else {
        setError(
          "Unable to load admin dashboard."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ==========================================
     Loading State
  ========================================== */

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <div className="admin-skeleton admin-skeleton-small" />
            <div className="admin-skeleton admin-skeleton-title" />
            <div className="admin-skeleton admin-skeleton-text" />
          </div>
        </div>

        <div className="admin-stat-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              className="admin-stat-card admin-loading-card"
              key={index}
            >
              <div className="admin-skeleton admin-skeleton-icon" />

              <div className="admin-loading-content">
                <div className="admin-skeleton admin-skeleton-label" />
                <div className="admin-skeleton admin-skeleton-number" />
              </div>
            </div>
          ))}
        </div>

        <div className="admin-loading-panels">
          <div className="admin-skeleton admin-large-skeleton" />
          <div className="admin-skeleton admin-large-skeleton" />
        </div>
      </div>
    );
  }

  /* ==========================================
     Error State
  ========================================== */

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <div className="admin-eyebrow">
              <ShieldCheck size={14} />
              ADMINISTRATION
            </div>

            <h1>Admin Dashboard</h1>
          </div>
        </div>

        <div className="admin-error">
          <div className="admin-error-icon">
            <AlertCircle size={24} />
          </div>

          <div>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
          </div>

          <button
            onClick={fetchAdminData}
            className="admin-error-button"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userStats = stats?.users || {};
  const contentStats = stats?.content || {};

  /* ==========================================
     Statistics
  ========================================== */

  const statCards = [
    {
      title: "Students",
      value: userStats.students || 0,
      icon: Users,
      description: "Registered students",
    },
    {
      title: "Careers",
      value: contentStats.careers || 0,
      icon: BriefcaseBusiness,
      description: "Career paths",
    },
    {
      title: "Skills",
      value: contentStats.skills || 0,
      icon: Brain,
      description: "Available skills",
    },
    {
      title: "Assessments",
      value: stats?.assessments || 0,
      icon: ClipboardCheck,
      description: "Completed assessments",
    },
    {
      title: "Assignments",
      value: contentStats.assignments || 0,
      icon: BookOpen,
      description: "Learning assignments",
    },
    {
      title: "Roadmap Steps",
      value: contentStats.roadmapSteps || 0,
      icon: Map,
      description: "Career roadmap steps",
    },
    {
      title: "Resources",
      value:
        contentStats.learningResources || 0,
      icon: GraduationCap,
      description: "Learning resources",
    },
    {
      title: "Questions",
      value: contentStats.questions || 0,
      icon: FileText,
      description: "Assessment questions",
    },
  ];

  return (
    <div className="admin-page">

      {/* ======================================
          Header
      ====================================== */}

      <section className="admin-header">
        <div>
          <div className="admin-eyebrow">
            <ShieldCheck size={14} />
            ADMINISTRATION
          </div>

          <h1>Admin Dashboard</h1>

          <p>
            Manage and monitor the CareerGuide
            platform from one place.
          </p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={fetchAdminData}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "admin-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </section>

      {/* ======================================
          Statistics
      ====================================== */}

      <section className="admin-stat-grid">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="admin-stat-card"
              key={card.title}
            >
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  <Icon size={19} />
                </div>
              </div>

              <div className="admin-stat-value">
                {card.value}
              </div>

              <h3>{card.title}</h3>

              <p>{card.description}</p>
            </div>
          );
        })}
      </section>

      {/* ======================================
          Overview
      ====================================== */}

      <section className="admin-overview-grid">

        {/* User Overview */}

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <div className="admin-panel-icon">
                <Users size={17} />
              </div>

              <div>
                <h2>User Overview</h2>

                <p>
                  Current platform users
                </p>
              </div>
            </div>
          </div>

          <div className="admin-overview-list">

            <div className="admin-overview-row">
              <div>
                <span>Students</span>
                <small>
                  Registered student accounts
                </small>
              </div>

              <strong>
                {userStats.students || 0}
              </strong>
            </div>

            <div className="admin-overview-row">
              <div>
                <span>Admins</span>
                <small>
                  Administrative accounts
                </small>
              </div>

              <strong>
                {userStats.admins || 0}
              </strong>
            </div>

          </div>
        </div>

        {/* Content Overview */}

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <div className="admin-panel-icon">
                <Database size={17} />
              </div>

              <div>
                <h2>Content Overview</h2>

                <p>
                  Available learning content
                </p>
              </div>
            </div>
          </div>

          <div className="admin-overview-list">

            <div className="admin-overview-row">
              <div>
                <span>Careers</span>
                <small>
                  Career paths available
                </small>
              </div>

              <strong>
                {contentStats.careers || 0}
              </strong>
            </div>

            <div className="admin-overview-row">
              <div>
                <span>Skills</span>
                <small>
                  Skills in the platform
                </small>
              </div>

              <strong>
                {contentStats.skills || 0}
              </strong>
            </div>

            <div className="admin-overview-row">
              <div>
                <span>Roadmap Steps</span>
                <small>
                  Learning roadmap steps
                </small>
              </div>

              <strong>
                {contentStats.roadmapSteps || 0}
              </strong>
            </div>

            <div className="admin-overview-row">
              <div>
                <span>Learning Resources</span>
                <small>
                  Resources for students
                </small>
              </div>

              <strong>
                {
                  contentStats.learningResources ||
                  0
                }
              </strong>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================
          Recent Students
      ====================================== */}

      <section className="admin-panel admin-students-panel">

        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <div className="admin-panel-icon">
              <UserCog size={17} />
            </div>

            <div>
              <h2>Recent Students</h2>

              <p>
                Recently registered students
              </p>
            </div>
          </div>

          <span className="admin-count-badge">
            {recentStudents.length} Recent
          </span>
        </div>

        {recentStudents.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <Users size={22} />
            </div>

            <h3>No students registered yet</h3>

            <p>
              New student registrations will
              appear here.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Target Career</th>
                </tr>
              </thead>

              <tbody>
                {recentStudents.map(
                  (student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="admin-student">
                          <div className="admin-student-avatar">
                            {student.name
                              ? student.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <div>
                            <strong>
                              {student.name ||
                                "Unknown Student"}
                            </strong>

                            <span>
                              Student
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-email">
                          {student.email ||
                            "Not provided"}
                        </span>
                      </td>

                      <td>
                        {student.college ||
                          "Not provided"}
                      </td>

                      <td>
                        <span
                          className={
                            student.targetCareer
                              ? "admin-career-badge"
                              : "admin-muted-badge"
                          }
                        >
                          {student.targetCareer ||
                            "Not selected"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};

export default AdminDashboard;