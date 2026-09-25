import { useEffect, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Layers3,
  RotateCcw,
  Target,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./Roadmap.css";

function Roadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // Fetch Roadmap
  // =========================================================

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      // Get user profile
      const profileResponse =
        await api.get("/users/profile");

      const targetCareer =
        profileResponse.data.targetCareer;

      if (!targetCareer) {
        setError(
          "Please select your target career from the Dashboard."
        );

        setLoading(false);
        return;
      }

      setCareer(targetCareer);

      // Get roadmap
      const roadmapResponse =
        await api.get(
          `/roadmaps/${encodeURIComponent(
            targetCareer
          )}`
        );

      setRoadmap(roadmapResponse.data);

      // Get saved progress
      const progressResponse =
        await api.get(
          `/roadmap-progress/${encodeURIComponent(
            targetCareer
          )}`
        );

      setCompletedSteps(
        progressResponse.data.completedSteps ||
          []
      );
    } catch (error) {
      console.error(
        "Roadmap error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Toggle Step
  // =========================================================

  const toggleStep = async (id) => {
    let updatedSteps;

    if (completedSteps.includes(id)) {
      updatedSteps =
        completedSteps.filter(
          (stepId) => stepId !== id
        );
    } else {
      updatedSteps = [
        ...completedSteps,
        id,
      ];
    }

    // Update UI immediately
    setCompletedSteps(updatedSteps);

    try {
      setSaving(true);

      await api.put(
        `/roadmap-progress/${encodeURIComponent(
          career
        )}`,
        {
          completedSteps: updatedSteps,
        }
      );
    } catch (error) {
      console.error(
        "Progress save error:",
        error
      );

      // Restore previous state
      setCompletedSteps(
        completedSteps
      );

      alert(
        "Failed to save progress. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // Progress
  // =========================================================

  const completedCount =
    roadmap.filter((step) =>
      completedSteps.includes(step._id)
    ).length;

  const progress =
    roadmap.length > 0
      ? Math.round(
          (completedCount /
            roadmap.length) *
            100
        )
      : 0;

  const remainingSteps =
    roadmap.length - completedCount;

  // =========================================================
  // Difficulty Class
  // =========================================================

  const getDifficultyClass = (
    difficulty
  ) => {
    return (
      difficulty
        ?.toLowerCase()
        .replace(/\s+/g, "-") ||
      "intermediate"
    );
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="roadmap-page">

            <div className="roadmap-header">
              <div className="roadmap-title-skeleton" />

              <div className="roadmap-subtitle-skeleton" />
            </div>

            <div className="roadmap-progress-skeleton">
              <div />
              <div />
            </div>

            <div className="roadmap-loading-list">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    className="roadmap-step-skeleton"
                    key={item}
                  >
                    <div className="skeleton-circle" />

                    <div className="skeleton-roadmap-card">
                      <div className="skeleton-line large" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line" />
                      <div className="skeleton-tags">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )
              )}
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

        <main className="roadmap-page">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="roadmap-header">

            <div className="roadmap-header-main">

              <div className="roadmap-header-icon">
                <GitBranch size={23} />
              </div>

              <div>
                <div className="roadmap-eyebrow">
                  Learning Journey
                </div>

                <h1>
                  Learning Roadmap
                </h1>

                <p>
                  Follow your personalized learning
                  journey step by step.
                </p>
              </div>

            </div>

            {career && (
              <div className="roadmap-career">

                <Target size={15} />

                <span>
                  {career}
                </span>

              </div>
            )}

          </section>

          {/* =================================================
              SAVING STATUS
          ================================================= */}

          {saving && (
            <div className="roadmap-saving">

              <RotateCcw
                size={14}
                className="saving-spinner"
              />

              <span>
                Saving your progress...
              </span>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="roadmap-state error">

              <div className="state-icon">
                <Target size={21} />
              </div>

              <div>
                <h3>
                  Roadmap unavailable
                </h3>

                <p>
                  {error}
                </p>
              </div>

            </div>
          )}

          {/* =================================================
              ROADMAP
          ================================================= */}

          {!loading &&
            !error &&
            roadmap.length > 0 && (
              <>

                {/* =================================================
                    PROGRESS CARD
                ================================================= */}

                <section className="roadmap-progress-card">

                  <div className="progress-card-top">

                    <div className="progress-card-info">

                      <div className="progress-card-icon">
                        <GraduationCap size={20} />
                      </div>

                      <div>
                        <div className="progress-eyebrow">
                          Roadmap Progress
                        </div>

                        <h2>
                          Keep building your skills
                        </h2>

                        <p>
                          {completedCount} of{" "}
                          {roadmap.length} steps
                          completed
                        </p>
                      </div>

                    </div>

                    <div className="progress-percentage">
                      <strong>
                        {progress}%
                      </strong>

                      <span>
                        Complete
                      </span>
                    </div>

                  </div>

                  <div className="roadmap-progress-bar">
                    <span
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="progress-card-footer">

                    <span>
                      {completedCount ===
                      roadmap.length
                        ? "Roadmap completed"
                        : `${remainingSteps} ${
                            remainingSteps === 1
                              ? "step"
                              : "steps"
                          } remaining`}
                    </span>

                    <span>
                      {roadmap.length} total steps
                    </span>

                  </div>

                </section>

                {/* =================================================
                    TIMELINE
                ================================================= */}

                <section className="roadmap-section">

                  <div className="roadmap-section-heading">

                    <div>
                      <div className="roadmap-eyebrow">
                        Step-by-Step Path
                      </div>

                      <h2>
                        Your Learning Path
                      </h2>

                      <p>
                        Complete each stage to
                        progress through your
                        career roadmap.
                      </p>
                    </div>

                    <div className="roadmap-count">
                      <Layers3 size={15} />
                      {roadmap.length} Steps
                    </div>

                  </div>

                  <div className="roadmap-timeline">

                    {roadmap.map(
                      (step, index) => {
                        const completed =
                          completedSteps.includes(
                            step._id
                          );

                        const isLast =
                          index ===
                          roadmap.length - 1;

                        return (
                          <div
                            className={`roadmap-step ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                            key={step._id}
                          >

                            {/* Timeline Rail */}
                            <div className="roadmap-rail">

                              <button
                                className="roadmap-check"
                                onClick={() =>
                                  toggleStep(
                                    step._id
                                  )
                                }
                                disabled={saving}
                                aria-label={
                                  completed
                                    ? "Mark incomplete"
                                    : "Mark completed"
                                }
                              >
                                {completed ? (
                                  <CheckCircle2
                                    size={25}
                                  />
                                ) : (
                                  <Circle
                                    size={25}
                                  />
                                )}
                              </button>

                              {!isLast && (
                                <div
                                  className={`timeline-line ${
                                    completed
                                      ? "line-completed"
                                      : ""
                                  }`}
                                />
                              )}

                            </div>

                            {/* Step Card */}
                            <article className="roadmap-card">

                              <div className="roadmap-card-header">

                                <div className="roadmap-card-title">

                                  <span className="step-label">
                                    Step{" "}
                                    {step.order ||
                                      index + 1}
                                  </span>

                                  <h3>
                                    {step.title}
                                  </h3>

                                </div>

                                <span
                                  className={`difficulty ${getDifficultyClass(
                                    step.difficulty
                                  )}`}
                                >
                                  {
                                    step.difficulty
                                  }
                                </span>

                              </div>

                              <p className="roadmap-description">
                                {
                                  step.description
                                }
                              </p>

                              {/* Skills */}
                              {step.skills
                                ?.length >
                                0 && (
                                <div className="roadmap-detail">

                                  <div className="detail-label">
                                    <BookOpen
                                      size={15}
                                    />

                                    <span>
                                      Skills
                                    </span>
                                  </div>

                                  <div className="roadmap-tags">
                                    {step.skills.map(
                                      (skill) => (
                                        <span
                                          key={
                                            skill
                                          }
                                        >
                                          {skill}
                                        </span>
                                      )
                                    )}
                                  </div>

                                </div>
                              )}

                              {/* Prerequisites */}
                              {step.prerequisites
                                ?.length >
                                0 && (
                                <div className="roadmap-detail">

                                  <div className="detail-label">
                                    <Layers3
                                      size={15}
                                    />

                                    <span>
                                      Prerequisites
                                    </span>
                                  </div>

                                  <p className="prerequisites-text">
                                    {step.prerequisites.join(
                                      ", "
                                    )}
                                  </p>

                                </div>
                              )}

                              {/* Duration */}
                              <div className="roadmap-duration">

                                <Clock3
                                  size={15}
                                />

                                <span>
                                  Estimated time:
                                </span>

                                <strong>
                                  {
                                    step.estimatedWeeks
                                  }{" "}
                                  weeks
                                </strong>

                              </div>

                              {/* Resources */}
                              {step.resources
                                ?.length >
                                0 && (
                                <div className="roadmap-detail">

                                  <div className="detail-label">
                                    <BookOpen
                                      size={15}
                                    />

                                    <span>
                                      Resources
                                    </span>
                                  </div>

                                  <div className="resource-list">

                                    {step.resources.map(
                                      (
                                        resource
                                      ) => (
                                        <div
                                          className="resource-item"
                                          key={
                                            resource
                                          }
                                        >
                                          <span>
                                            {resource}
                                          </span>

                                          <ExternalLink
                                            size={
                                              13
                                            }
                                          />
                                        </div>
                                      )
                                    )}

                                  </div>

                                </div>
                              )}

                              {/* Complete Button */}
                              <div className="roadmap-card-footer">

                                {completed && (
                                  <div className="completed-status">
                                    <CheckCircle2
                                      size={15}
                                    />

                                    Completed
                                  </div>
                                )}

                                <button
                                  className={`complete-btn ${
                                    completed
                                      ? "completed-btn"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleStep(
                                      step._id
                                    )
                                  }
                                  disabled={saving}
                                >
                                  {completed ? (
                                    <>
                                      Mark as Incomplete
                                    </>
                                  ) : (
                                    <>
                                      Mark as Completed
                                      <ArrowRight
                                        size={15}
                                      />
                                    </>
                                  )}
                                </button>

                              </div>

                            </article>

                          </div>
                        );
                      }
                    )}

                  </div>

                </section>

              </>
            )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            !error &&
            roadmap.length === 0 && (
              <div className="roadmap-state">

                <div className="state-icon">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h3>
                    No roadmap found
                  </h3>

                  <p>
                    There is no learning roadmap
                    available for your current
                    target career.
                  </p>
                </div>

              </div>
            )}

        </main>
      </div>
    </div>
  );
}

export default Roadmap;