import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Route,
  Target,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./Progress.css";

function Progress() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const [roadmap, setRoadmap] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [assignments, setAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // Fetch Progress Data
  // ==========================================

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);

        // ==========================================
        // Profile
        // ==========================================

        let profile = null;

        try {
          const profileResponse =
            await api.get("/users/profile");

          profile = profileResponse.data;

          setUser(profile);
        } catch (profileError) {
          console.error(
            "Failed to fetch profile:",
            profileError
          );
        }

        // ==========================================
        // Latest Assessment
        // ==========================================

        try {
          const assessmentResponse =
            await api.get("/assessments/latest");

          setAssessment(
            assessmentResponse.data
          );
        } catch (assessmentError) {
          if (
            assessmentError.response?.status === 404
          ) {
            setAssessment(null);
          } else {
            console.error(
              "Failed to fetch assessment:",
              assessmentError
            );
          }
        }

        // ==========================================
        // Roadmap + Assignments
        // ==========================================

        if (profile?.targetCareer) {
          const career =
            profile.targetCareer;

          try {
            const [
              roadmapResponse,
              roadmapProgressResponse,
              assignmentResponse,
              assignmentProgressResponse,
            ] = await Promise.all([
              api.get(
                `/roadmaps/${encodeURIComponent(
                  career
                )}`
              ),

              api.get(
                `/roadmap-progress/${encodeURIComponent(
                  career
                )}`
              ),

              api.get(
                `/assignments/career/${encodeURIComponent(
                  career
                )}`
              ),

              api.get(
                "/assignment-progress"
              ),
            ]);

            setRoadmap(
              roadmapResponse.data || []
            );

            setCompletedSteps(
              roadmapProgressResponse.data
                ?.completedSteps || []
            );

            setAssignments(
              assignmentResponse.data || []
            );

            const completedAssignmentIds =
              (
                assignmentProgressResponse.data ||
                []
              )
                .filter(
                  (item) =>
                    item.completed === true
                )
                .map(
                  (item) =>
                    item.assignment?._id ||
                    item.assignment
                )
                .filter(Boolean);

            setCompletedAssignments(
              completedAssignmentIds
            );
          } catch (careerDataError) {
            console.error(
              "Failed to fetch roadmap/assignment data:",
              careerDataError
            );

            setRoadmap([]);
            setCompletedSteps([]);
            setAssignments([]);
            setCompletedAssignments([]);
          }
        } else {
          setRoadmap([]);
          setCompletedSteps([]);
          setAssignments([]);
          setCompletedAssignments([]);
        }
      } catch (error) {
        console.error(
          "Failed to load progress data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // ==========================================
  // Assessment Calculations
  // ==========================================

  const skillResults =
    assessment?.skillResults || [];

  const assessedSkills =
    skillResults.length;

  const strongSkills =
    skillResults.filter(
      (skill) =>
        Number(skill.percentage) >= 80
    );

  const skillsToImprove =
    skillResults.filter(
      (skill) =>
        Number(skill.percentage) < 80
    );

  const overallScore =
    Number(
      assessment?.overallScore
    ) || 0;

  // ==========================================
  // Roadmap Calculations
  // ==========================================

  const completedCount =
    roadmap.filter(
      (step) =>
        completedSteps.includes(step._id)
    ).length;

  const roadmapProgress =
    roadmap.length > 0
      ? Math.round(
          (completedCount /
            roadmap.length) *
            100
        )
      : 0;

  // ==========================================
  // Assignment Calculations
  // ==========================================

  const completedAssignmentCount =
    assignments.filter(
      (assignment) =>
        completedAssignments.includes(
          assignment._id
        )
    ).length;

  const assignmentProgress =
    assignments.length > 0
      ? Math.round(
          (completedAssignmentCount /
            assignments.length) *
            100
        )
      : 0;

  // ==========================================
  // Highest / Lowest Skills
  // ==========================================

  const sortedSkills = useMemo(
    () =>
      [...skillResults].sort(
        (a, b) =>
          Number(b.percentage) -
          Number(a.percentage)
      ),
    [skillResults]
  );

  const highestScoringSkill =
    sortedSkills.length > 0
      ? sortedSkills[0]
      : null;

  const lowestScoringSkill =
    sortedSkills.length > 0
      ? sortedSkills[
          sortedSkills.length - 1
        ]
      : null;

  // ==========================================
  // Progress Metric
  // ==========================================

  const learningMetrics = [
    {
      label: "Assessment",
      value: assessment
        ? overallScore
        : 0,
      icon: ClipboardCheck,
    },
    {
      label: "Roadmap",
      value: roadmapProgress,
      icon: Route,
    },
    {
      label: "Assignments",
      value: assignmentProgress,
      icon: BookOpen,
    },
  ];

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="progress-content">
            <div className="progress-skeleton-header">
              <div className="progress-skeleton skeleton-title" />
              <div className="progress-skeleton skeleton-text" />
            </div>

            <div className="progress-skeleton-grid">
              <div className="progress-skeleton skeleton-card" />
              <div className="progress-skeleton skeleton-card" />
              <div className="progress-skeleton skeleton-card" />
              <div className="progress-skeleton skeleton-card" />
            </div>

            <div className="progress-skeleton skeleton-large" />
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

        <main className="progress-content">

          {/* ======================================
              Header
          ====================================== */}

          <section className="progress-page-header">
            <div>
              <div className="progress-eyebrow">
                <BarChart3 size={15} />
                LEARNING ANALYTICS
              </div>

              <h1>Progress Analytics</h1>

              <p>
                Track your assessment, skills,
                assignments and learning roadmap
                progress in one place.
              </p>
            </div>

            <div className="progress-header-icon">
              <TrendingUp size={22} />
            </div>
          </section>

          {/* ======================================
              Career
          ====================================== */}

          <section className="progress-career-card">
            <div className="progress-career-icon">
              <Target size={20} />
            </div>

            <div className="progress-career-info">
              <span>Target Career</span>

              <h2>
                {user?.targetCareer ||
                  "Not selected"}
              </h2>
            </div>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Update Career
              <ArrowRight size={15} />
            </button>
          </section>

          {/* ======================================
              Summary
          ====================================== */}

          <section className="progress-summary-grid">

            <div className="progress-summary-card">
              <div className="summary-icon">
                <ClipboardCheck size={18} />
              </div>

              <span>Assessment Score</span>

              <strong>
                {assessment
                  ? `${overallScore}%`
                  : "--"}
              </strong>

              <small>
                Latest assessment
              </small>
            </div>

            <div className="progress-summary-card">
              <div className="summary-icon">
                <GraduationCap size={18} />
              </div>

              <span>Skills Assessed</span>

              <strong>
                {assessedSkills}
              </strong>

              <small>
                Skills evaluated
              </small>
            </div>

            <div className="progress-summary-card">
              <div className="summary-icon">
                <CheckCircle2 size={18} />
              </div>

              <span>Strong Skills</span>

              <strong>
                {strongSkills.length}
              </strong>

              <small>
                80% or above
              </small>
            </div>

            <div className="progress-summary-card">
              <div className="summary-icon">
                <Target size={18} />
              </div>

              <span>Skills to Improve</span>

              <strong>
                {skillsToImprove.length}
              </strong>

              <small>
                Current focus areas
              </small>
            </div>

            <div className="progress-summary-card">
              <div className="summary-icon">
                <Route size={18} />
              </div>

              <span>Roadmap Progress</span>

              <strong>
                {roadmapProgress}%
              </strong>

              <small>
                Learning roadmap
              </small>
            </div>

            <div className="progress-summary-card">
              <div className="summary-icon">
                <BookOpen size={18} />
              </div>

              <span>Assignment Progress</span>

              <strong>
                {assignmentProgress}%
              </strong>

              <small>
                Practical tasks
              </small>
            </div>

          </section>

          {/* ======================================
              Learning Overview
          ====================================== */}

          <section className="progress-section">
            <div className="progress-section-header">
              <div>
                <span className="progress-section-label">
                  OVERVIEW
                </span>

                <h2>
                  Learning Progress
                </h2>

                <p>
                  A quick view of your major
                  learning milestones.
                </p>
              </div>
            </div>

            <div className="learning-metrics-grid">
              {learningMetrics.map(
                (metric) => {
                  const Icon =
                    metric.icon;

                  return (
                    <div
                      className="learning-metric-card"
                      key={metric.label}
                    >
                      <div className="metric-top">
                        <div className="metric-icon">
                          <Icon size={17} />
                        </div>

                        <strong>
                          {metric.value}%
                        </strong>
                      </div>

                      <span>
                        {metric.label}
                      </span>

                      <div className="metric-progress">
                        <div
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                100,
                                metric.value
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* ======================================
              Assessment Performance
          ====================================== */}

          <section className="progress-section">
            <div className="progress-section-header">
              <div>
                <span className="progress-section-label">
                  ASSESSMENT
                </span>

                <h2>
                  Assessment Performance
                </h2>

                <p>
                  Your latest skill assessment
                  results.
                </p>
              </div>

              {assessment && (
                <span className="progress-badge">
                  {overallScore}%
                </span>
              )}
            </div>

            {!assessment ? (
              <div className="progress-empty">
                <div className="progress-empty-icon">
                  <ClipboardCheck size={23} />
                </div>

                <h3>
                  Assessment not completed
                </h3>

                <p>
                  Complete your career
                  assessment to start tracking
                  your skill progress.
                </p>

                <button
                  onClick={() =>
                    navigate("/assessment")
                  }
                >
                  Take Assessment
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <div className="assessment-progress-content">

                <div className="overall-progress-box">
                  <div className="overall-score-circle">
                    <strong>
                      {overallScore}%
                    </strong>

                    <span>Score</span>
                  </div>

                  <div className="overall-progress-info">
                    <span>
                      Latest Assessment
                    </span>

                    <strong>
                      Overall Assessment
                    </strong>

                    <p>
                      Based on your latest
                      career assessment.
                    </p>

                    <div className="analytics-progress-bar">
                      <div
                        className="analytics-progress-fill"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              overallScore
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="skill-highlight-grid">

                  <div className="skill-highlight-card">
                    <span>
                      Highest Scoring Skill
                    </span>

                    <strong>
                      {highestScoringSkill
                        ? highestScoringSkill.skill
                        : "--"}
                    </strong>

                    <small>
                      {highestScoringSkill
                        ? `${highestScoringSkill.percentage}%`
                        : ""}
                    </small>
                  </div>

                  <div className="skill-highlight-card attention">
                    <span>
                      Needs Most Attention
                    </span>

                    <strong>
                      {lowestScoringSkill
                        ? lowestScoringSkill.skill
                        : "--"}
                    </strong>

                    <small>
                      {lowestScoringSkill
                        ? `${lowestScoringSkill.percentage}%`
                        : ""}
                    </small>
                  </div>

                </div>
              </div>
            )}
          </section>

          {/* ======================================
              Skill Progress
          ====================================== */}

          <section className="progress-section">
            <div className="progress-section-header">
              <div>
                <span className="progress-section-label">
                  SKILLS
                </span>

                <h2>
                  Skill Progress
                </h2>

                <p>
                  Performance across your
                  assessed skills.
                </p>
              </div>
            </div>

            {skillResults.length === 0 ? (
              <div className="progress-empty compact">
                <p>
                  Complete an assessment to see
                  your skill performance.
                </p>
              </div>
            ) : (
              <div className="skill-progress-list">
                {skillResults.map(
                  (skill) => {
                    const percentage = Math.max(
                      0,
                      Math.min(
                        100,
                        Number(
                          skill.percentage
                        ) || 0
                      )
                    );

                    return (
                      <div
                        className="skill-progress-row"
                        key={skill.skill}
                      >
                        <div className="skill-progress-name">
                          <strong>
                            {skill.skill}
                          </strong>

                          <span>
                            {skill.percentage}%
                          </span>
                        </div>

                        <div className="analytics-progress-bar">
                          <div
                            className="analytics-progress-fill"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* ======================================
              Roadmap Progress
          ====================================== */}

          <section className="progress-section">
            <div className="progress-section-header">
              <div>
                <span className="progress-section-label">
                  ROADMAP
                </span>

                <h2>
                  Learning Roadmap Progress
                </h2>

                <p>
                  Track completed steps in your
                  career roadmap.
                </p>
              </div>

              {user?.targetCareer && (
                <span className="progress-badge">
                  {roadmapProgress}%
                </span>
              )}
            </div>

            {!user?.targetCareer ? (
              <div className="progress-empty">
                <div className="progress-empty-icon">
                  <Target size={23} />
                </div>

                <h3>
                  Target career required
                </h3>

                <p>
                  Select a target career from
                  your Dashboard to generate a
                  roadmap.
                </p>

                <button
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Select Career
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : roadmap.length === 0 ? (
              <div className="progress-empty compact">
                <p>
                  No roadmap steps available for
                  this career yet.
                </p>
              </div>
            ) : (
              <>
                <div className="roadmap-progress-overview">
                  <div>
                    <strong>
                      {completedCount}
                    </strong>

                    <span>
                      Completed Steps
                    </span>
                  </div>

                  <div>
                    <strong>
                      {roadmap.length}
                    </strong>

                    <span>
                      Total Steps
                    </span>
                  </div>

                  <div>
                    <strong>
                      {roadmapProgress}%
                    </strong>

                    <span>
                      Completion
                    </span>
                  </div>
                </div>

                <div className="analytics-progress-bar roadmap-analytics-bar">
                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${roadmapProgress}%`,
                    }}
                  />
                </div>

                <div className="progress-roadmap-list">
                  {roadmap.map(
                    (step, index) => {
                      const completed =
                        completedSteps.includes(
                          step._id
                        );

                      return (
                        <div
                          className={`progress-roadmap-item ${
                            completed
                              ? "completed"
                              : ""
                          }`}
                          key={step._id}
                        >
                          <div
                            className={`progress-step-number ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                          >
                            {completed ? (
                              <Check size={15} />
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div className="progress-step-info">
                            <strong>
                              {step.title}
                            </strong>

                            <span>
                              {step.description}
                            </span>
                          </div>

                          <div
                            className={`progress-step-status ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                          >
                            {completed
                              ? "Completed"
                              : "Pending"}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </section>

          {/* ======================================
              Assignment Progress
          ====================================== */}

          <section className="progress-section">
            <div className="progress-section-header">
              <div>
                <span className="progress-section-label">
                  PRACTICE
                </span>

                <h2>
                  Assignment Progress
                </h2>

                <p>
                  Track your practical learning
                  tasks for your target career.
                </p>
              </div>

              {user?.targetCareer &&
                assignments.length > 0 && (
                  <span className="progress-badge">
                    {assignmentProgress}%
                  </span>
                )}
            </div>

            {!user?.targetCareer ? (
              <div className="progress-empty">
                <div className="progress-empty-icon">
                  <Target size={23} />
                </div>

                <h3>
                  Target career required
                </h3>

                <p>
                  Select a target career to get
                  career-specific assignments.
                </p>

                <button
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Select Career
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : assignments.length === 0 ? (
              <div className="progress-empty compact">
                <p>
                  No assignments available for
                  this career yet.
                </p>
              </div>
            ) : (
              <>
                <div className="assignment-progress-overview">
                  <div>
                    <strong>
                      {completedAssignmentCount}
                    </strong>

                    <span>
                      Completed
                    </span>
                  </div>

                  <div>
                    <strong>
                      {assignments.length}
                    </strong>

                    <span>
                      Total Assignments
                    </span>
                  </div>

                  <div>
                    <strong>
                      {assignmentProgress}%
                    </strong>

                    <span>
                      Completion
                    </span>
                  </div>
                </div>

                <div className="analytics-progress-bar">
                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${assignmentProgress}%`,
                    }}
                  />
                </div>

                <div className="progress-assignment-list">
                  {assignments.map(
                    (assignment, index) => {
                      const completed =
                        completedAssignments.includes(
                          assignment._id
                        );

                      return (
                        <div
                          className={`progress-assignment-item ${
                            completed
                              ? "completed"
                              : ""
                          }`}
                          key={
                            assignment._id
                          }
                        >
                          <div
                            className={`progress-assignment-number ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                          >
                            {completed ? (
                              <Check size={14} />
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div className="progress-assignment-info">
                            <strong>
                              {assignment.title}
                            </strong>

                            <span>
                              Skill:{" "}
                              {assignment.skill ||
                                "General"}
                            </span>
                          </div>

                          <div
                            className={`progress-assignment-status ${
                              completed
                                ? "completed"
                                : ""
                            }`}
                          >
                            {completed
                              ? "Completed"
                              : "Pending"}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="progress-inline-action">
                  <button
                    onClick={() =>
                      navigate(
                        "/assignments"
                      )
                    }
                  >
                    View Assignments
                    <ArrowRight size={15} />
                  </button>
                </div>
              </>
            )}
          </section>

          {/* ======================================
              Focus Areas
          ====================================== */}

          <section className="progress-section">
            <div className="progress-section-header">
              <div>
                <span className="progress-section-label">
                  DEVELOPMENT
                </span>

                <h2>Focus Areas</h2>

                <p>
                  Skills that currently need
                  more attention.
                </p>
              </div>
            </div>

            {skillsToImprove.length === 0 ? (
              <div className="progress-success">
                <CheckCircle2 size={20} />

                <div>
                  <strong>
                    No major skill gaps found
                  </strong>

                  <span>
                    Your latest assessment does
                    not currently show skills below
                    the improvement threshold.
                  </span>
                </div>
              </div>
            ) : (
              <div className="focus-progress-list">
                {[...skillsToImprove]
                  .sort(
                    (a, b) =>
                      Number(
                        a.percentage
                      ) -
                      Number(
                        b.percentage
                      )
                  )
                  .slice(0, 5)
                  .map((skill) => {
                    const percentage =
                      Math.max(
                        0,
                        Math.min(
                          100,
                          Number(
                            skill.percentage
                          ) || 0
                        )
                      );

                    return (
                      <div
                        className="focus-progress-item"
                        key={skill.skill}
                      >
                        <div>
                          <strong>
                            {skill.skill}
                          </strong>

                          <span>
                            {skill.percentage}%
                          </span>
                        </div>

                        <div className="analytics-progress-bar">
                          <div
                            className="analytics-progress-fill"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

          {/* ======================================
              Navigation
          ====================================== */}

          <section className="progress-actions">
            <button
              onClick={() =>
                navigate("/skills")
              }
            >
              <GraduationCap size={16} />
              View My Skills
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() =>
                navigate("/assignments")
              }
            >
              <BookOpen size={16} />
              View Assignments
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() =>
                navigate("/roadmap")
              }
            >
              <Route size={16} />
              View Roadmap
              <ArrowRight size={15} />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Progress;