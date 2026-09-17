import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionScores, setQuestionScores] = useState({});
  const [completed, setCompleted] = useState(false);

  // Fetch questions from MongoDB
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/questions");

        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Calculate total score
  const totalScore = questions.reduce((total, question) => {
    return total + (questionScores[question._id] || 0);
  }, 0);

  // Calculate maximum score
  const maxScore = questions.length * 3;

  // Calculate overall percentage
  const overallPercentage =
    maxScore > 0
      ? Math.round((totalScore / maxScore) * 100)
      : 0;

  // Calculate skill-wise results
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

  // Prepare final skill results
  const finalSkillResults = Object.entries(skillResults).map(
    ([skill, data]) => {
      const percentage = Math.round(
        (data.totalScore / data.maxScore) * 100
      );

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
    }
  );

  // Save result after completion
  useEffect(() => {
    if (completed) {
      // Save locally
      localStorage.setItem(
        "assessmentScore",
        overallPercentage.toString()
      );

      localStorage.setItem(
        "assessmentAnswers",
        JSON.stringify(answers)
      );

      // Save assessment result to MongoDB
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

          console.log(
            "Assessment result saved to MongoDB"
          );

          // Show Skill Evaluation response
          console.log(
            "Skill Evaluation:",
            response.data.skillEvaluation
          );
        } catch (error) {
          console.error(
            "Failed to save assessment:",
            error.response?.data?.message ||
              error.message
          );
        }
      };

      saveAssessment();
    }
  }, [
    completed,
    overallPercentage,
    totalScore,
    maxScore,
  ]);

  // Skill Gap Analysis
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

  // Handle answer
  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];

    const isCorrect =
      answer === question.correctAnswer;

    const score = isCorrect ? 3 : 1;

    // Save selected answer
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [question._id]: answer,
    }));

    // Save question score
    setQuestionScores((previousScores) => ({
      ...previousScores,
      [question._id]: score,
    }));

    // Next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>Career Assessment</h1>

              <p>
                Assess your skills and discover suitable
                career paths.
              </p>
            </div>
          </div>

          <div className="assessment-card">

            {/* Introduction */}
            {!started && !completed && (
              <>
                <h2>Discover Your Career Path</h2>

                <p>
                  This assessment will analyze your
                  technical skills, interests and
                  problem-solving abilities to help
                  you understand suitable career
                  options.
                </p>

                <div className="assessment-info">

                  <div>
                    <strong>
                      {questions.length}
                    </strong>

                    <span>Questions</span>
                  </div>

                  <div>
                    <strong>
                      {
                        new Set(
                          questions.map(
                            (question) =>
                              question.skill
                          )
                        ).size
                      }
                    </strong>

                    <span>Skill Areas</span>
                  </div>

                  <div>
                    <strong>~10 min</strong>

                    <span>Time Required</span>
                  </div>

                </div>

                <button
                  className="start-assessment-btn"
                  onClick={() => {
                    setStarted(true);
                  }}
                  disabled={questions.length === 0}
                >
                  {questions.length === 0
                    ? "Loading Questions..."
                    : "Start Assessment"}
                </button>
              </>
            )}

            {/* Questions */}
            {started &&
              !completed &&
              questions.length > 0 && (
                <div className="question-section">

                  <p className="question-number">
                    Question{" "}
                    {currentQuestion + 1} of{" "}
                    {questions.length}
                  </p>

                  <h2>
                    {
                      questions[currentQuestion]
                        .question
                    }
                  </h2>

                  <div className="question-options">

                    {questions[
                      currentQuestion
                    ].options.map((option) => (
                      <button
                        key={option}
                        className="question-option"
                        onClick={() =>
                          handleAnswer(option)
                        }
                      >
                        {option}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            {/* Assessment Result */}
            {completed && (
              <div className="assessment-result">

                <h2>
                  Assessment Completed
                </h2>

                <p>
                  Your skill assessment has been
                  completed successfully.
                </p>

                {/* Overall Score */}
                <div className="overall-score">

                  <span>
                    Overall Skill Score
                  </span>

                  <strong>
                    {overallPercentage}%
                  </strong>

                  <small>
                    {totalScore} / {maxScore} points
                  </small>

                </div>

                {/* Skill-wise Results */}
                <div className="skill-results">

                  {finalSkillResults.map(
                    (result) => (
                      <div
                        className="skill-result-item"
                        key={result.skill}
                      >

                        <div>
                          <strong>
                            {result.skill}
                          </strong>

                          <span>
                            {result.level} •{" "}
                            {result.percentage}%
                          </span>
                        </div>

                        <strong>
                          {result.totalScore}/
                          {result.maxScore}
                        </strong>

                      </div>
                    )
                  )}

                </div>

                {/* Skill Gap */}
                <div className="skill-gap-section">

                  <h3>
                    Skill Gap Analysis
                  </h3>

                  <p>
                    These skills can be improved
                    to strengthen your career
                    readiness.
                  </p>

                  <div className="skill-gap-list">

                    {skillGaps.map((gap) => (
                      <div
                        className="skill-gap-item"
                        key={gap.skill}
                      >

                        <div>

                          <strong>
                            {gap.skill}
                          </strong>

                          <span>
                            {gap.level} •{" "}
                            {gap.percentage}%
                          </span>

                        </div>

                        <strong>
                          {gap.score}/
                          {gap.maxScore}
                        </strong>

                      </div>
                    ))}

                  </div>

                </div>

                {/* Retake */}
                <button
                  className="retake-assessment-btn"
                  onClick={() => {
                    setStarted(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setQuestionScores({});
                    setCompleted(false);

                    localStorage.removeItem(
                      "assessmentAnswers"
                    );

                    localStorage.removeItem(
                      "assessmentScore"
                    );
                  }}
                >
                  Retake Assessment
                </button>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Assessment;