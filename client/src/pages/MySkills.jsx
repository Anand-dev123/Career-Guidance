import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

const getScore = (answer) => {
  if (
    answer === "Beginner" ||
    answer === "Need Practice" ||
    answer === "Needs Improvement"
  ) {
    return 1;
  }

  if (
    answer === "Intermediate" ||
    answer === "Comfortable" ||
    answer === "Good"
  ) {
    return 2;
  }

  if (
    answer === "Advanced" ||
    answer === "Very Comfortable" ||
    answer === "Strong"
  ) {
    return 3;
  }

  return 0;
};

const getSkillLevel = (score) => {
  if (score === 1) {
    return "Beginner";
  }

  if (score === 2) {
    return "Intermediate";
  }

  if (score === 3) {
    return "Advanced";
  }

  return "Not Assessed";
};

function MySkills() {
  const [skillList, setSkillList] = useState([]);
  const [answers, setAnswers] = useState({});

  // Fetch skills from MongoDB
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("/skills");

        const skillNames = response.data.map(
          (skill) => skill.name
        );

        setSkillList(skillNames);
      } catch (error) {
        console.error(
          "Failed to fetch skills:",
          error
        );
      }
    };

    fetchSkills();
  }, []);

  // Load assessment answers
  useEffect(() => {
    const savedAnswers =
      localStorage.getItem("assessmentAnswers");

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Skill Summary
  const assessedSkills = skillList.filter(
    (skill) => answers[skill]
  );

  const strongSkills = assessedSkills.filter(
    (skill) => getScore(answers[skill]) === 3
  );

  const skillsToImprove = assessedSkills.filter(
    (skill) => getScore(answers[skill]) < 3
  );

  // Priority Skills
  const prioritySkills = assessedSkills
    .filter(
      (skill) => getScore(answers[skill]) < 3
    )
    .sort((a, b) => {
      return (
        getScore(answers[a]) -
        getScore(answers[b])
      );
    });

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="dashboard-content">

          <div className="dashboard-header">
            <div>
              <h1>My Skills</h1>

              <p>
                Track your current skills and identify
                areas for improvement.
              </p>
            </div>
          </div>

          {/* Skills Summary */}
          <div className="skills-summary">

            <div className="skills-summary-card">
              <span>Total Skills</span>

              <strong>
                {skillList.length}
              </strong>
            </div>

            <div className="skills-summary-card">
              <span>Strong Skills</span>

              <strong>
                {strongSkills.length}
              </strong>
            </div>

            <div className="skills-summary-card">
              <span>Skills to Improve</span>

              <strong>
                {skillsToImprove.length}
              </strong>
            </div>

          </div>

          {/* Recommended Focus Areas */}
          <div className="focus-section">

            <h2>Recommended Focus Areas</h2>

            <p>
              Focus on these skills to improve your
              career readiness.
            </p>

            <div className="focus-list">

              {prioritySkills
                .slice(0, 3)
                .map((skill) => {

                  const score =
                    getScore(answers[skill]);

                  return (
                    <div
                      className="focus-card"
                      key={skill}
                    >
                      <div>
                        <strong>
                          {skill}
                        </strong>

                        <span>
                          {getSkillLevel(score)}
                        </span>
                      </div>

                      <strong>
                        {score}/3
                      </strong>
                    </div>
                  );
                })}

            </div>
          </div>

          {/* Skill Cards */}
          <div className="skills-page">

            {skillList.map((skill) => {

              const answer = answers[skill];

              const score = getScore(answer);

              return (
                <div
                  className="skill-card"
                  key={skill}
                >

                  <div className="skill-card-info">

                    <h3>{skill}</h3>

                    <p>
                      {getSkillLevel(score)}
                    </p>

                  </div>

                  <div className="skill-score-section">

                    <div className="skill-score">

                      {score > 0
                        ? `${score}/3`
                        : "--"}

                    </div>

                    <div className="skill-progress">

                      <div
                        className="skill-progress-bar"
                        style={{
                          width: `${(score / 3) * 100}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </main>
      </div>
    </div>
  );
}

export default MySkills;