import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Layers3,
  Target,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./Assignments.css";

function Assignments() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // ==========================================
  // Fetch User + Assignments + Progress
  // ==========================================

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        setLoading(true);

        const profileResponse = await api.get("/users/profile");
        const profile = profileResponse.data;

        setUser(profile);

        if (!profile?.targetCareer) {
          setAssignments([]);
          setCompletedAssignments([]);
          return;
        }

        const career = profile.targetCareer;

        const [assignmentResponse, progressResponse] =
          await Promise.all([
            api.get(
              `/assignments/career/${encodeURIComponent(career)}`
            ),
            api.get("/assignment-progress"),
          ]);

        setAssignments(assignmentResponse.data || []);

        const completedIds = (progressResponse.data || [])
          .filter((item) => item.completed === true)
          .map(
            (item) =>
              item.assignment?._id || item.assignment
          )
          .filter(Boolean);

        setCompletedAssignments(completedIds);
      } catch (error) {
        console.error(
          "Failed to fetch assignments:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, []);

  // ==========================================
  // Toggle Assignment Completion
  // ==========================================

  const toggleAssignment = async (assignmentId) => {
    try {
      setSavingId(assignmentId);

      const isCompleted =
        completedAssignments.includes(assignmentId);

      if (isCompleted) {
        await api.delete(
          `/assignment-progress/${assignmentId}`
        );

        setCompletedAssignments((prev) =>
          prev.filter((id) => id !== assignmentId)
        );
      } else {
        await api.put(
          `/assignment-progress/${assignmentId}`
        );

        setCompletedAssignments((prev) => [
          ...prev,
          assignmentId,
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to update assignment status:",
        error
      );
    } finally {
      setSavingId(null);
    }
  };

  // ==========================================
  // Calculations
  // ==========================================

  const completedCount = assignments.filter((assignment) =>
    completedAssignments.includes(assignment._id)
  ).length;

  const progress =
    assignments.length > 0
      ? Math.round(
          (completedCount / assignments.length) * 100
        )
      : 0;

  const remainingCount = Math.max(
    assignments.length - completedCount,
    0
  );

  const difficultyCounts = useMemo(() => {
    return assignments.reduce(
      (acc, assignment) => {
        const difficulty =
          assignment.difficulty || "Other";

        acc[difficulty] = (acc[difficulty] || 0) + 1;

        return acc;
      },
      {}
    );
  }, [assignments]);

  // ==========================================
  // Difficulty Class
  // ==========================================

  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return "other";

    return difficulty
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="assignments-content">
            <div className="assignments-skeleton-header">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
            </div>

            <div className="assignments-skeleton-overview">
              <div className="skeleton skeleton-overview" />
              <div className="skeleton skeleton-overview" />
              <div className="skeleton skeleton-overview" />
            </div>

            <div className="assignments-skeleton-list">
              {[1, 2, 3].map((item) => (
                <div
                  className="assignment-skeleton-card"
                  key={item}
                >
                  <div className="skeleton skeleton-small" />
                  <div className="skeleton skeleton-card-title" />
                  <div className="skeleton skeleton-card-line" />
                  <div className="skeleton skeleton-card-line short" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="assignments-content">
          {/* ======================================
              Page Header
          ====================================== */}

          <section className="assignments-header">
            <div className="assignments-header-text">
              <div className="page-eyebrow">
                <BookOpen size={16} />
                PRACTICAL LEARNING
              </div>

              <h1>Assignments</h1>

              <p>
                Complete practical tasks to strengthen
                the skills required for your career.
              </p>
            </div>

            {user?.targetCareer && (
              <div className="career-target-badge">
                <Target size={17} />

                <div>
                  <span>Target Career</span>
                  <strong>{user.targetCareer}</strong>
                </div>
              </div>
            )}
          </section>

          {/* ======================================
              No Target Career
          ====================================== */}

          {!user?.targetCareer ? (
            <section className="assignment-empty-state">
              <div className="empty-icon">
                <Target size={28} />
              </div>

              <div className="empty-content">
                <span className="empty-label">
                  Career selection required
                </span>

                <h2>Select a Target Career</h2>

                <p>
                  Choose a target career from your
                  Dashboard to get career-specific
                  assignments.
                </p>

                <button
                  className="primary-action"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Select Career
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>
          ) : (
            <>
              {/* ====================================
                  Overview
              ==================================== */}

              <section className="assignment-overview-grid">
                <div className="assignment-overview-card progress-card">
                  <div className="overview-card-icon">
                    <CheckCircle2 size={20} />
                  </div>

                  <div className="overview-card-content">
                    <span>Overall Progress</span>

                    <strong>{progress}%</strong>

                    <p>
                      {completedCount} of{" "}
                      {assignments.length} completed
                    </p>
                  </div>
                </div>

                <div className="assignment-overview-card">
                  <div className="overview-card-icon">
                    <Layers3 size={20} />
                  </div>

                  <div className="overview-card-content">
                    <span>Total Assignments</span>

                    <strong>
                      {assignments.length}
                    </strong>

                    <p>
                      Career-specific tasks
                    </p>
                  </div>
                </div>

                <div className="assignment-overview-card">
                  <div className="overview-card-icon">
                    <Clock3 size={20} />
                  </div>

                  <div className="overview-card-content">
                    <span>Remaining</span>

                    <strong>{remainingCount}</strong>

                    <p>
                      Tasks left to complete
                    </p>
                  </div>
                </div>
              </section>

              {/* ====================================
                  Progress Section
              ==================================== */}

              <section className="assignment-progress-section">
                <div className="progress-section-top">
                  <div>
                    <span className="section-label">
                      Learning Progress
                    </span>

                    <h2>
                      {completedCount ===
                      assignments.length &&
                      assignments.length > 0
                        ? "All assignments completed"
                        : "Keep building your skills"}
                    </h2>
                  </div>

                  <strong>{progress}%</strong>
                </div>

                <div className="assignment-progress-track">
                  <div
                    className="assignment-progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="progress-section-bottom">
                  <span>
                    {completedCount} completed
                  </span>

                  <span>
                    {remainingCount} remaining
                  </span>
                </div>
              </section>

              {/* ====================================
                  Assignment Section
              ==================================== */}

              <section className="assignments-section">
                <div className="section-heading-row">
                  <div>
                    <span className="section-label">
                      Career Tasks
                    </span>

                    <h2>Your Assignments</h2>

                    <p>
                      Practice the skills relevant to{" "}
                      {user.targetCareer}.
                    </p>
                  </div>

                  {assignments.length > 0 && (
                    <div className="difficulty-summary">
                      {Object.entries(
                        difficultyCounts
                      ).map(
                        ([difficulty, count]) => (
                          <span
                            key={difficulty}
                            className={`difficulty-summary-item ${getDifficultyClass(
                              difficulty
                            )}`}
                          >
                            {difficulty}: {count}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                {assignments.length === 0 ? (
                  <div className="assignment-empty-state compact">
                    <div className="empty-icon">
                      <BookOpen size={26} />
                    </div>

                    <div className="empty-content">
                      <h2>
                        No Assignments Available
                      </h2>

                      <p>
                        There are currently no
                        assignments available for{" "}
                        {user.targetCareer}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="assignment-list">
                    {assignments.map(
                      (assignment, index) => {
                        const completed =
                          completedAssignments.includes(
                            assignment._id
                          );

                        const isSaving =
                          savingId === assignment._id;

                        return (
                          <article
                            className={`assignment-card ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                            key={assignment._id}
                          >
                            {/* Card Header */}

                            <div className="assignment-card-header">
                              <div className="assignment-title-area">
                                <div
                                  className={`assignment-index ${
                                    completed
                                      ? "done"
                                      : ""
                                  }`}
                                >
                                  {completed ? (
                                    <Check size={17} />
                                  ) : (
                                    String(
                                      index + 1
                                    ).padStart(2, "0")
                                  )}
                                </div>

                                <div>
                                  <span className="assignment-label">
                                    Assignment{" "}
                                    {index + 1}
                                  </span>

                                  <h3>
                                    {
                                      assignment.title
                                    }
                                  </h3>
                                </div>
                              </div>

                              <span
                                className={`assignment-difficulty ${getDifficultyClass(
                                  assignment.difficulty
                                )}`}
                              >
                                {
                                  assignment.difficulty ||
                                  "General"
                                }
                              </span>
                            </div>

                            {/* Description */}

                            <p className="assignment-description">
                              {
                                assignment.description
                              }
                            </p>

                            {/* Meta */}

                            <div className="assignment-meta">
                              <div className="assignment-meta-item">
                                <span>Skill</span>
                                <strong>
                                  {assignment.skill ||
                                    "General"}
                                </strong>
                              </div>

                              <div className="meta-divider" />

                              <div className="assignment-meta-item">
                                <span>Estimated Time</span>
                                <strong>
                                  {assignment.estimatedTime ??
                                    "—"}{" "}
                                  {assignment.estimatedTime
                                    ? "min"
                                    : ""}
                                </strong>
                              </div>
                            </div>

                            {/* Resources */}

                            {assignment.resources
                              ?.length > 0 && (
                              <div className="assignment-resources">
                                <div className="resources-heading">
                                  <BookOpen
                                    size={16}
                                  />
                                  <span>
                                    Resources
                                  </span>
                                </div>

                                <div className="resource-list">
                                  {assignment.resources.map(
                                    (
                                      resource,
                                      resourceIndex
                                    ) => (
                                      <span
                                        key={`${resource}-${resourceIndex}`}
                                      >
                                        {resource}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Footer */}

                            <div className="assignment-card-footer">
                              {completed ? (
                                <div className="completed-status">
                                  <CheckCircle2
                                    size={17}
                                  />
                                  <span>
                                    Assignment
                                    completed
                                  </span>
                                </div>
                              ) : (
                                <div className="pending-status">
                                  <Clock3 size={16} />
                                  <span>
                                    Not completed yet
                                  </span>
                                </div>
                              )}

                              <button
                                className={`assignment-complete-btn ${
                                  completed
                                    ? "completed-btn"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleAssignment(
                                    assignment._id
                                  )
                                }
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <>
                                    <span className="button-spinner" />
                                    Saving...
                                  </>
                                ) : completed ? (
                                  <>
                                    <Check size={16} />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    Mark as Complete
                                    <ArrowRight
                                      size={16}
                                    />
                                  </>
                                )}
                              </button>
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Assignments;