import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Layers3,
  RefreshCcw,
  Target,
  TrendingUp,
  XCircle,
  AlertCircle,
} from "lucide-react";

import "./Assessment.css";

function Assessment() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionScores, setQuestionScores] = useState({});
  const [completed, setCompleted] = useState(false);
  const [prioritySkills, setPrioritySkills] = useState([]);
  const [learningOrder, setLearningOrder] = useState([]);

  // =========================================================
  // Fetch Questions Based On Target Career
  // =========================================================

  useEffect(() => {
    const fetchCareerQuestions = async () => {
      try {
        const profileResponse = await api.get("/users/profile");

        const targetCareer = profileResponse.data.targetCareer;

        if (!targetCareer) {
          console.log("No target career selected");
          return;
        }

        const response = await api.get("/questions/career", {
          params: {
            career: targetCareer,
          },
        });

        setQuestions(response.data);

        console.log("Target Career:", targetCareer);

        console.log("Career Questions:", response.data);
      } catch (error) {
        console.error(
          "Failed to fetch career questions:",
          error.response?.data?.message || error.message,
        );
      }
    };

    fetchCareerQuestions();
  }, []);

  // =========================================================
  // Calculate Total Score
  // =========================================================

  const totalScore = questions.reduce((total, question) => {
    return total + (questionScores[question._id] || 0);
  }, 0);

  // =========================================================
  // Maximum Score
  // =========================================================

  const maxScore = questions.length * 3;

  // =========================================================
  // Overall Percentage
  // =========================================================

  const overallPercentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // =========================================================
  // Skill-wise Results
  // =========================================================

  const skillResults = {};

  questions.forEach((question) => {
    const skill = question.skill;

    const score = questionScores[question._id] || 0;

    if (!skillResults[skill]) {
      skillResults[skill] = {
        totalScore: 0,
        maxScore: 0,
        questions: 0,
      };
    }

    skillResults[skill].totalScore += score;
    skillResults[skill].maxScore += 3;
    skillResults[skill].questions += 1;
  });

  // =========================================================
  // Final Skill Results
  // =========================================================

  const finalSkillResults = Object.entries(skillResults).map(
    ([skill, data]) => {
      const percentage = Math.round((data.totalScore / data.maxScore) * 100);

      let level = "Needs Improvement";

      if (percentage >= 80) {
        level = "Advanced";
      } else if (percentage >= 60) {
        level = "Intermediate";
      }

      return {
        skill,
        totalScore: data.totalScore,
        maxScore: data.maxScore,
        questions: data.questions,
        percentage,
        level,
      };
    },
  );

  // =========================================================
  // Save Assessment Result
  // =========================================================

  useEffect(() => {
    if (!completed) return;

    localStorage.setItem("assessmentScore", overallPercentage.toString());

    localStorage.setItem("assessmentAnswers", JSON.stringify(answers));

    const saveAssessment = async () => {
      try {
        const response = await api.post("/assessments", {
          overallScore: overallPercentage,
          totalScore: totalScore,
          maxScore: maxScore,

          skillResults: finalSkillResults.map((result) => ({
            skill: result.skill,
            score: result.totalScore,
            maxScore: result.maxScore,
            percentage: result.percentage,
            level: result.level,
          })),
        });

        console.log("Assessment result saved to MongoDB");

        console.log("Skill Evaluation:", response.data.skillEvaluation);

        setPrioritySkills(response.data.skillEvaluation.prioritySkills);

        setLearningOrder(response.data.skillEvaluation.learningOrder);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        console.error(
          "Failed to save assessment:",
          error.response?.data?.message || error.message,
        );
      }
    };

    saveAssessment();
  }, [completed, overallPercentage, totalScore, maxScore, answers]);

  // =========================================================
  // Skill Gap Analysis
  // =========================================================

  const skillGaps = finalSkillResults
    .filter((result) => result.percentage < 80)
    .map((result) => {
      let gapLevel = "Low Gap";

      if (result.percentage < 60) {
        gapLevel = "High Gap";
      } else if (result.percentage < 70) {
        gapLevel = "Medium Gap";
      }

      return {
        skill: result.skill,
        percentage: result.percentage,
        score: result.totalScore,
        maxScore: result.maxScore,
        level: gapLevel,
      };
    });

  // =========================================================
  // Handle Answer
  // =========================================================

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];

    const isCorrect = answer === question.correctAnswer;

    const score = isCorrect ? 3 : 1;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [question._id]: answer,
    }));

    setQuestionScores((previousScores) => ({
      ...previousScores,
      [question._id]: score,
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  // =========================================================
  // Retake Assessment
  // =========================================================

  const retakeAssessment = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setQuestionScores({});
    setCompleted(false);
    setPrioritySkills([]);
    setLearningOrder([]);

    localStorage.removeItem("assessmentAnswers");

    localStorage.removeItem("assessmentScore");
  };

  // =========================================================
  // Loading / Question State
  // =========================================================

  const currentQuestionData = questions[currentQuestion];

  const progressPercentage =
    questions.length > 0
      ? Math.round(((currentQuestion + 1) / questions.length) * 100)
      : 0;

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="assessment-page">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="assessment-page-header">
            <div className="assessment-header-icon">
              <Target size={23} />
            </div>

            <div>
              <div className="assessment-eyebrow">Career Discovery</div>

              <h1>Career Assessment</h1>

              <p>
                Assess your current skills and discover suitable career paths.
              </p>
            </div>
          </section>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <section className="assessment-container">
            {/* =================================================
                INTRO
            ================================================= */}

            {!started && !completed && (
              <div className="assessment-intro">
                <div className="intro-badge">
                  <Award size={17} />
                  Personalized Assessment
                </div>

                <h2>Discover Your Career Path</h2>

                <p className="intro-description">
                  This assessment analyzes your technical skills, interests and
                  problem-solving abilities to help you understand suitable
                  career options.
                </p>

                {/* Info Cards */}
                <div className="assessment-info-grid">
                  <div className="assessment-info-card">
                    <div className="info-card-icon blue">
                      <Layers3 size={19} />
                    </div>

                    <div>
                      <strong>{questions.length}</strong>

                      <span>Questions</span>
                    </div>
                  </div>

                  <div className="assessment-info-card">
                    <div className="info-card-icon purple">
                      <BarChart3 size={19} />
                    </div>

                    <div>
                      <strong>
                        {
                          new Set(questions.map((question) => question.skill))
                            .size
                        }
                      </strong>

                      <span>Skill Areas</span>
                    </div>
                  </div>

                  <div className="assessment-info-card">
                    <div className="info-card-icon green">
                      <Clock3 size={19} />
                    </div>

                    <div>
                      <strong>~10 min</strong>

                      <span>Time Required</span>
                    </div>
                  </div>
                </div>

                {/* Assessment Guidelines */}
                <div className="assessment-guidelines">
                  <div className="guidelines-heading">
                    <CheckCircle2 size={17} />

                    <strong>Before you begin</strong>
                  </div>

                  <div className="guideline-list">
                    <div>
                      <Check size={15} />
                      <span>
                        Answer each question based on your current knowledge.
                      </span>
                    </div>

                    <div>
                      <Check size={15} />
                      <span>
                        Your results will identify skill strengths and gaps.
                      </span>
                    </div>

                    <div>
                      <Check size={15} />
                      <span>You can retake the assessment later.</span>
                    </div>
                  </div>
                </div>

                <button
                  className="start-assessment-btn"
                  onClick={() => setStarted(true)}
                  disabled={questions.length === 0}
                >
                  {questions.length === 0 ? (
                    "Loading Questions..."
                  ) : (
                    <>
                      Start Assessment
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* =================================================
                QUESTIONS
            ================================================= */}

            {started &&
              !completed &&
              questions.length > 0 &&
              currentQuestionData && (
                <div className="question-section">
                  {/* Question Top */}
                  <div className="question-top">
                    <div>
                      <span className="question-label">Skill Assessment</span>

                      <div className="question-counter">
                        Question <strong>{currentQuestion + 1}</strong> of{" "}
                        {questions.length}
                      </div>
                    </div>

                    <span className="question-percentage">
                      {progressPercentage}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="question-progress">
                    <span
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>

                  {/* Skill */}
                  <div className="question-skill">
                    <Layers3 size={14} />
                    {currentQuestionData.skill}
                  </div>

                  {/* Question */}
                  <h2 className="question-title">
                    {currentQuestionData.question}
                  </h2>

                  <p className="question-helper">
                    Select the option that best answers the question.
                  </p>

                  {/* Options */}
                  <div className="question-options">
                    {currentQuestionData.options.map((option, index) => {
                      const selected =
                        answers[currentQuestionData._id] === option;

                      return (
                        <button
                          key={option}
                          className={`question-option ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => handleAnswer(option)}
                        >
                          <span className="option-number">
                            {String.fromCharCode(65 + index)}
                          </span>

                          <span className="option-text">{option}</span>

                          <span className="option-check">
                            {selected && <Check size={16} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Question Footer */}
                  <div className="question-footer">
                    <div className="question-footer-info">
                      <Target size={15} />

                      <span>
                        Your answer will be used to calculate your skill score.
                      </span>
                    </div>

                    <span className="auto-next">
                      Select an answer to continue
                    </span>
                  </div>
                </div>
              )}

            {/* =================================================
                RESULT
            ================================================= */}

            {completed && (
              <div className="assessment-result">
                {/* Result Header */}
                <div className="result-header">
                  <div className="result-success-icon">
                    <CheckCircle2 size={27} />
                  </div>

                  <div>
                    <div className="assessment-eyebrow">
                      Assessment Complete
                    </div>

                    <h2>Your Assessment Results</h2>

                    <p>
                      Your skill assessment has been completed successfully.
                    </p>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="result-overview">
                  <div className="score-circle">
                    <div>
                      <strong>{overallPercentage}%</strong>

                      <span>Overall</span>
                    </div>
                  </div>

                  <div className="result-overview-content">
                    <span className="result-label">Overall Skill Score</span>

                    <h3>
                      {totalScore} / {maxScore}
                    </h3>

                    <p>points scored across all assessment questions.</p>

                    <div className="result-progress">
                      <span
                        style={{
                          width: `${overallPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skill Results */}
                <div className="result-section">
                  <div className="result-section-heading">
                    <div className="result-section-icon">
                      <BarChart3 size={18} />
                    </div>

                    <div>
                      <h3>Skill-wise Performance</h3>

                      <p>Your performance across individual skill areas.</p>
                    </div>
                  </div>

                  <div className="skill-results">
                    {finalSkillResults.map((result) => (
                      <div className="skill-result-item" key={result.skill}>
                        <div className="skill-result-main">
                          <div className="skill-result-title">
                            <strong>{result.skill}</strong>

                            <span
                              className={`skill-level ${result.level
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {result.level}
                            </span>
                          </div>

                          <div className="skill-result-progress">
                            <span
                              style={{
                                width: `${result.percentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="skill-result-score">
                          <strong>{result.percentage}%</strong>

                          <span>
                            {result.totalScore}/{result.maxScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Gap */}
                <div className="result-section">
                  <div className="result-section-heading">
                    <div className="result-section-icon warning">
                      <AlertCircle size={18} />
                    </div>

                    <div>
                      <h3>Skill Gap Analysis</h3>

                      <p>
                        These skills can be improved to strengthen your career
                        readiness.
                      </p>
                    </div>
                  </div>

                  {skillGaps.length > 0 ? (
                    <div className="skill-gap-list">
                      {skillGaps.map((gap) => (
                        <div className="skill-gap-item" key={gap.skill}>
                          <div className="gap-icon">
                            <TrendingUp size={17} />
                          </div>

                          <div className="gap-info">
                            <strong>{gap.skill}</strong>

                            <span>{gap.level}</span>
                          </div>

                          <div className="gap-score">
                            <strong>{gap.percentage}%</strong>

                            <span>
                              {gap.score}/{gap.maxScore}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="result-empty">
                      <CheckCircle2 size={18} />
                      <span>No significant skill gaps were identified.</span>
                    </div>
                  )}
                </div>

                {/* Priority Skills */}
                <div className="result-section">
                  <div className="result-section-heading">
                    <div className="result-section-icon danger">
                      <Target size={18} />
                    </div>

                    <div>
                      <h3>Priority Skills</h3>

                      <p>
                        Skills that should be your first focus based on your
                        current gaps.
                      </p>
                    </div>
                  </div>

                  {prioritySkills.length > 0 ? (
                    <div className="priority-skills-list">
                      {prioritySkills.map((skill, index) => (
                        <div className="priority-skill-item" key={skill.skill}>
                          <div className="priority-rank">#{index + 1}</div>

                          <div className="priority-info">
                            <strong>{skill.skill}</strong>

                            <span>
                              {skill.percentage}%{" • "}
                              Priority {skill.priority}
                            </span>
                          </div>

                          <div className="priority-score">
                            {skill.score}/{skill.maxScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="result-empty">
                      <CheckCircle2 size={18} />
                      <span>
                        Priority skills will appear after the evaluation is
                        processed.
                      </span>
                    </div>
                  )}
                </div>

                {/* Learning Order */}
                <div className="result-section">
                  <div className="result-section-heading">
                    <div className="result-section-icon blue">
                      <BookOpen size={18} />
                    </div>

                    <div>
                      <h3>Recommended Learning Order</h3>

                      <p>
                        Follow this order to build your skills based on
                        prerequisite dependencies.
                      </p>
                    </div>
                  </div>

                  {learningOrder.length > 0 ? (
                    <div className="learning-order-list">
                      {learningOrder.map((skill, index) => (
                        <div
                          className="learning-order-item"
                          key={`${skill}-${index}`}
                        >
                          <div className="learning-order-number">
                            {index + 1}
                          </div>

                          <div className="learning-order-info">
                            <strong>{skill}</strong>

                            {index < learningOrder.length - 1 && (
                              <span>Next: {learningOrder[index + 1]}</span>
                            )}
                          </div>

                          {index < learningOrder.length - 1 && (
                            <ArrowRight size={16} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="result-empty">
                      <BookOpen size={18} />
                      <span>
                        Your recommended learning order is being prepared.
                      </span>
                    </div>
                  )}
                </div>

                {/* Result Footer */}
                <div className="result-footer">
                  <div>
                    <strong>Want to improve your result?</strong>

                    <span>
                      Retake the assessment after improving your priority
                      skills.
                    </span>
                  </div>

                  <button
                    className="retake-assessment-btn"
                    onClick={retakeAssessment}
                  >
                    <RefreshCcw size={16} />
                    Retake Assessment
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Assessment;
