import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Code2,
  Layers3,
  Target,
  TrendingDown,
  TrendingUp,
  GitBranch,
  AlertCircle,
} from "lucide-react";

import "./MySkills.css";

const getSkillLevel = (score) => {
  if (score >= 3) {
    return "Advanced";
  }

  if (score >= 2) {
    return "Intermediate";
  }

  if (score >= 1) {
    return "Beginner";
  }

  return "Not Assessed";
};

function MySkills() {
  const [skills, setSkills] = useState([]);
  const [assessment, setAssessment] = useState(null);

  // DSA based skill evaluation
  const [skillEvaluation, setSkillEvaluation] =
    useState(null);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // Fetch Skills + Latest Assessment
  // =========================================================

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        setLoading(true);

        const [
          skillsResponse,
          assessmentResponse,
        ] = await Promise.all([
          api.get("/skills"),
          api.get("/assessments/latest"),
        ]);

        const databaseSkills =
          skillsResponse.data;

        const latestAssessment =
          assessmentResponse.data;

        setAssessment(latestAssessment);

        // DSA Skill Evaluation Result
        setSkillEvaluation(
          latestAssessment.skillEvaluation ||
            null
        );

        // Convert Assessment Results
        const assessmentMap = {};

        latestAssessment.skillResults?.forEach(
          (result) => {
            const score =
              result.maxScore > 0
                ? Math.round(
                    (result.score /
                      result.maxScore) *
                      3
                  )
                : 0;

            assessmentMap[result.skill] = {
              score,
              percentage: result.percentage,
              level: getSkillLevel(score),
            };
          }
        );

        // Combine Database Skills + Assessment
        const formattedSkills =
          databaseSkills.map((skill) => ({
            name: skill.name,
            category: skill.category,
            difficulty: skill.difficulty,

            score:
              assessmentMap[skill.name]?.score ||
              0,

            percentage:
              assessmentMap[skill.name]
                ?.percentage || 0,

            level:
              assessmentMap[skill.name]?.level ||
              "Not Assessed",
          }));

        setSkills(formattedSkills);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(
            "No assessment found yet."
          );

          // Show Skills Without Assessment
          try {
            const response =
              await api.get("/skills");

            setSkills(
              response.data.map((skill) => ({
                name: skill.name,
                category: skill.category,
                difficulty: skill.difficulty,
                score: 0,
                percentage: 0,
                level: "Not Assessed",
              }))
            );
          } catch (skillError) {
            console.error(
              "Failed to fetch skills:",
              skillError
            );
          }
        } else {
          console.error(
            "Failed to fetch skill data:",
            error
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSkillData();
  }, []);

  // =========================================================
  // Skill Summary
  // =========================================================

  const assessedSkills = skills.filter(
    (skill) => skill.score > 0
  );

  const strongSkills = skills.filter(
    (skill) => skill.score === 3
  );

  const skillsToImprove =
    assessedSkills.filter(
      (skill) => skill.score < 3
    );

  // =========================================================
  // Overall Percentage
  // =========================================================

  const overallPercentage =
    assessment?.overallScore || 0;

  // =========================================================
  // DSA Evaluation Data
  // =========================================================

  const prioritySkills =
    skillEvaluation?.prioritySkills || [];

  const personalizedLearningOrder =
    skillEvaluation?.learningOrder || [];

  // =========================================================
  // Helper for Learning Order
  // =========================================================

  const getSkillName = (item) => {
    if (typeof item === "string") {
      return item;
    }

    return item?.skill || "";
  };

  // =========================================================
  // Focus Skills
  // =========================================================

  const focusSkills = useMemo(() => {
    return [...skillsToImprove]
      .sort(
        (a, b) => a.score - b.score
      )
      .slice(0, 3);
  }, [skillsToImprove]);

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="myskills-page">

            <div className="myskills-header">
              <div className="skills-skeleton-icon" />

              <div>
                <div className="skills-skeleton-title" />
                <div className="skills-skeleton-subtitle" />
              </div>
            </div>

            <div className="skills-summary-grid">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    className="summary-skeleton"
                    key={item}
                  />
                )
              )}
            </div>

            <div className="skills-main-skeleton">
              <div className="skeleton-line large" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>

            <div className="skills-cards-skeleton">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    className="skill-skeleton-card"
                    key={item}
                  />
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

        <main className="myskills-page">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="myskills-header">

            <div className="myskills-header-icon">
              <Layers3 size={23} />
            </div>

            <div>
              <div className="skills-eyebrow">
                Skill Development
              </div>

              <h1>My Skills</h1>

              <p>
                Track your skills, strengths and
                personalized learning priorities.
              </p>
            </div>

          </section>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <section className="skills-summary-grid">

            <div className="skills-summary-card">

              <div className="summary-icon blue">
                <Layers3 size={19} />
              </div>

              <div>
                <span>Total Skills</span>

                <strong>
                  {skills.length}
                </strong>
              </div>

            </div>

            <div className="skills-summary-card">

              <div className="summary-icon purple">
                <BarChart3 size={19} />
              </div>

              <div>
                <span>Assessed Skills</span>

                <strong>
                  {assessedSkills.length}
                </strong>
              </div>

            </div>

            <div className="skills-summary-card">

              <div className="summary-icon green">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <span>Strong Skills</span>

                <strong>
                  {strongSkills.length}
                </strong>
              </div>

            </div>

            <div className="skills-summary-card">

              <div className="summary-icon orange">
                <TrendingDown size={19} />
              </div>

              <div>
                <span>Skills to Improve</span>

                <strong>
                  {skillsToImprove.length}
                </strong>
              </div>

            </div>

          </section>

          {/* =================================================
              OVERALL ASSESSMENT
          ================================================= */}

          <section className="overall-skill-card">

            <div className="overall-content">

              <div className="overall-icon">
                <Award size={21} />
              </div>

              <div>
                <div className="overall-eyebrow">
                  Latest Assessment
                </div>

                <h2>
                  Overall Skill Assessment
                </h2>

                <p>
                  Your latest career assessment
                  performance.
                </p>
              </div>

            </div>

            <div className="overall-score">

              <strong>
                {assessment
                  ? `${overallPercentage}%`
                  : "--"}
              </strong>

              <span>
                {assessment
                  ? "Overall Score"
                  : "Not Assessed"}
              </span>

            </div>

          </section>

          {/* =================================================
              MAIN TWO COLUMN AREA
          ================================================= */}

          <div className="skills-content-grid">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="skills-primary-column">

              {/* =================================================
                  PRIORITY SKILLS
              ================================================= */}

              <section className="skills-panel">

                <div className="panel-header">

                  <div className="panel-heading">

                    <div className="panel-icon red">
                      <Target size={18} />
                    </div>

                    <div>
                      <h2>
                        Priority Skills
                      </h2>

                      <p>
                        Skills prioritized using
                        the Max Heap based on
                        your current skill gaps.
                      </p>
                    </div>

                  </div>

                  <span className="dsa-badge">
                    Max Heap
                  </span>

                </div>

                {prioritySkills.length ===
                0 ? (
                  <div className="skill-empty-state">
                    <div className="empty-state-icon">
                      <Target size={20} />
                    </div>

                    <div>
                      <strong>
                        No priority skills yet
                      </strong>

                      <p>
                        Complete your career
                        assessment to generate
                        skill priorities.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="priority-skills-list">

                    {prioritySkills
                      .slice(0, 5)
                      .map(
                        (skill, index) => (
                          <div
                            className="priority-skill-card"
                            key={
                              skill.skill ||
                              index
                            }
                          >

                            <div className="priority-rank">
                              #{index + 1}
                            </div>

                            <div className="priority-info">
                              <h3>
                                {skill.skill}
                              </h3>

                              <span>
                                {skill.level}
                              </span>
                            </div>

                            <div className="priority-progress-area">

                              <div className="priority-progress">
                                <span
                                  style={{
                                    width: `${Math.min(
                                      skill.percentage ||
                                        0,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>

                              <strong>
                                {skill.percentage}%
                              </strong>

                            </div>

                            <div className="priority-gap">
                              Gap{" "}
                              {skill.priority}%
                            </div>

                          </div>
                        )
                      )}

                  </div>
                )}

              </section>

              {/* =================================================
                  LEARNING ORDER
              ================================================= */}

              <section className="skills-panel">

                <div className="panel-header">

                  <div className="panel-heading">

                    <div className="panel-icon blue">
                      <GitBranch size={18} />
                    </div>

                    <div>
                      <h2>
                        Personalized Learning Order
                      </h2>

                      <p>
                        Recommended sequence based
                        on skill dependencies and
                        prerequisites.
                      </p>
                    </div>

                  </div>

                  <span className="dsa-badge">
                    Graph + Topological Sort
                  </span>

                </div>

                {personalizedLearningOrder.length ===
                0 ? (
                  <div className="skill-empty-state">
                    <div className="empty-state-icon blue">
                      <BookOpen size={20} />
                    </div>

                    <div>
                      <strong>
                        Learning order not available
                      </strong>

                      <p>
                        Complete your career
                        assessment to generate a
                        personalized learning order.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="learning-order">

                    {personalizedLearningOrder.map(
                      (item, index) => {
                        const skillName =
                          getSkillName(item);

                        return (
                          <div
                            className="learning-order-item"
                            key={`${skillName}-${index}`}
                          >

                            <div className="learning-order-number">
                              {index + 1}
                            </div>

                            <div className="learning-order-content">

                              <strong>
                                {skillName}
                              </strong>

                              {index <
                                personalizedLearningOrder.length -
                                  1 && (
                                <span>
                                  Next:{" "}
                                  {getSkillName(
                                    personalizedLearningOrder[
                                      index + 1
                                    ]
                                  )}
                                </span>
                              )}

                            </div>

                            {index <
                              personalizedLearningOrder.length -
                                1 && (
                              <div className="learning-order-arrow">
                                →
                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </section>

              {/* =================================================
                  ALL SKILLS
              ================================================= */}

              <section className="skills-panel">

                <div className="panel-header">

                  <div className="panel-heading">

                    <div className="panel-icon slate">
                      <Code2 size={18} />
                    </div>

                    <div>
                      <h2>
                        All Skills
                      </h2>

                      <p>
                        Your complete skill profile
                        and current proficiency levels.
                      </p>
                    </div>

                  </div>

                </div>

                {skills.length === 0 ? (
                  <div className="skill-empty-state">
                    <div className="empty-state-icon">
                      <Layers3 size={20} />
                    </div>

                    <div>
                      <strong>
                        No skills available
                      </strong>

                      <p>
                        Skills will appear here once
                        they are added to your profile.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="all-skills-list">

                    {skills.map((skill) => (
                      <div
                        className="all-skill-item"
                        key={skill.name}
                      >

                        <div className="all-skill-info">

                          <div className="all-skill-title">
                            <strong>
                              {skill.name}
                            </strong>

                            <span
                              className={`skill-level-badge ${skill.level
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {skill.level}
                            </span>
                          </div>

                          <div className="skill-meta">
                            <span>
                              {skill.category}
                            </span>

                            {skill.difficulty && (
                              <>
                                <span className="meta-dot">
                                  •
                                </span>

                                <span>
                                  {
                                    skill.difficulty
                                  }
                                </span>
                              </>
                            )}
                          </div>

                          <div className="all-skill-progress">
                            <span
                              style={{
                                width: `${Math.min(
                                  skill.percentage ||
                                    0,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                        </div>

                        <div className="all-skill-score">

                          <strong>
                            {skill.score > 0
                              ? `${skill.score}/3`
                              : "--"}
                          </strong>

                          <span>
                            {skill.percentage}%
                          </span>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </section>

            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <aside className="skills-sidebar">

              {/* Focus Areas */}
              <section className="focus-panel">

                <div className="focus-panel-header">

                  <div className="panel-icon orange">
                    <TrendingUp size={18} />
                  </div>

                  <div>
                    <h2>
                      Recommended Focus
                    </h2>

                    <p>
                      Skills that need more
                      attention.
                    </p>
                  </div>

                </div>

                {focusSkills.length === 0 ? (
                  <div className="focus-empty">
                    <CheckCircle2 size={19} />

                    <span>
                      No major focus areas
                      identified yet.
                    </span>
                  </div>
                ) : (
                  <div className="focus-list">

                    {focusSkills.map(
                      (skill, index) => (
                        <div
                          className="focus-card"
                          key={skill.name}
                        >

                          <div className="focus-rank">
                            {index + 1}
                          </div>

                          <div className="focus-info">

                            <strong>
                              {skill.name}
                            </strong>

                            <span>
                              {skill.level}
                            </span>

                            <div className="focus-progress">
                              <span
                                style={{
                                  width: `${Math.min(
                                    skill.percentage ||
                                      0,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>

                          </div>

                          <strong className="focus-score">
                            {skill.percentage}%
                          </strong>

                        </div>
                      )
                    )}

                  </div>
                )}

              </section>

              {/* Skill Level Legend */}
              <section className="skill-legend-panel">

                <div className="legend-heading">
                  <BarChart3 size={17} />

                  <h3>
                    Skill Levels
                  </h3>
                </div>

                <div className="legend-item">
                  <span className="legend-dot advanced" />

                  <div>
                    <strong>
                      Advanced
                    </strong>

                    <span>
                      Score 3/3
                    </span>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot intermediate" />

                  <div>
                    <strong>
                      Intermediate
                    </strong>

                    <span>
                      Score 2/3
                    </span>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot beginner" />

                  <div>
                    <strong>
                      Beginner
                    </strong>

                    <span>
                      Score 1/3
                    </span>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot not-assessed" />

                  <div>
                    <strong>
                      Not Assessed
                    </strong>

                    <span>
                      No assessment data
                    </span>
                  </div>
                </div>

              </section>

            </aside>

          </div>

        </main>
      </div>
    </div>
  );
}

export default MySkills;