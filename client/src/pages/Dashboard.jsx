import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Compass,
  FileText,
  GraduationCap,
  Map,
  Search,
  Target,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [careers, setCareers] = useState([]);

  const [targetCareer, setTargetCareer] = useState(
    user?.targetCareer || ""
  );

  const [assessment, setAssessment] = useState(null);

  const [recommendations, setRecommendations] = useState([]);

  const [recommendationLoading, setRecommendationLoading] =
    useState(false);

  const [roadmap, setRoadmap] = useState([]);

  const [completedSteps, setCompletedSteps] = useState([]);

  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // ==========================================
  // Fetch Careers
  // ==========================================

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get("/careers");

        setCareers(response.data || []);
      } catch (error) {
        console.error("Failed to fetch careers:", error);
      }
    };

    fetchCareers();
  }, []);

  // ==========================================
  // Fetch Assessment + Recommendations
  // ==========================================

  useEffect(() => {
    const loadAssessmentData = async () => {
      try {
        setRecommendationLoading(true);

        const response = await api.get("/assessments/latest");

        const latestAssessment = response.data;

        setAssessment(latestAssessment);

        const skillResults =
          latestAssessment?.skillResults || [];

        if (skillResults.length === 0) {
          setRecommendations([]);
          return;
        }

        const userSkills = {};

        skillResults.forEach((result) => {
          const score =
            result.maxScore > 0
              ? Math.round(
                  (result.score / result.maxScore) * 3
                )
              : 0;

          userSkills[result.skill] = score;
        });

        const recommendationResponse = await api.post(
          "/careers/recommend",
          {
            skills: userSkills,
          }
        );

        const responseData = recommendationResponse.data;

        const recommendationList = Array.isArray(
          responseData
        )
          ? responseData
          : responseData?.recommendations || [];

        setRecommendations(recommendationList);
      } catch (error) {
        if (error.response?.status === 404) {
          setAssessment(null);
          setRecommendations([]);
        } else {
          console.error(
            "Failed to load assessment:",
            error
          );
        }
      } finally {
        setRecommendationLoading(false);
      }
    };

    loadAssessmentData();
  }, []);

  // ==========================================
  // Fetch Roadmap
  // ==========================================

  useEffect(() => {
    const fetchRoadmapProgress = async () => {
      if (!targetCareer) {
        setRoadmap([]);
        setCompletedSteps([]);
        return;
      }

      try {
        setRoadmapLoading(true);

        const roadmapResponse = await api.get(
          `/roadmaps/${encodeURIComponent(targetCareer)}`
        );

        setRoadmap(roadmapResponse.data || []);

        const progressResponse = await api.get(
          `/roadmap-progress/${encodeURIComponent(
            targetCareer
          )}`
        );

        setCompletedSteps(
          progressResponse.data?.completedSteps || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch roadmap progress:",
          error
        );

        setRoadmap([]);
        setCompletedSteps([]);
      } finally {
        setRoadmapLoading(false);
      }
    };

    fetchRoadmapProgress();
  }, [targetCareer]);

  // ==========================================
  // Target Career
  // ==========================================

  const handleCareerChange = async (selectedCareer) => {
    const previousCareer = targetCareer;

    setTargetCareer(selectedCareer);

    try {
      const response = await api.put(
        "/users/target-career",
        {
          targetCareer: selectedCareer,
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error(
        "Failed to update target career:",
        error
      );

      setTargetCareer(previousCareer);
    }
  };

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // Roadmap Calculations
  // ==========================================

  const completedCount = roadmap.filter((step) =>
    completedSteps.includes(step._id)
  ).length;

  const roadmapProgress =
    roadmap.length > 0
      ? Math.round(
          (completedCount / roadmap.length) * 100
        )
      : 0;

  const nextStep = roadmap.find(
    (step) => !completedSteps.includes(step._id)
  );

  // ==========================================
  // Assessment Calculations
  // ==========================================

  const assessedSkillCount =
    assessment?.skillResults?.length || 0;

  const assessmentScore =
    assessment?.overallScore ?? 0;

  // ==========================================
  // Career Match
  // ==========================================

  const topRecommendation = recommendations[0];

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="app-layout">

      {/* Student Sidebar */}
      <Sidebar />

      <div className="main-area">

        {/* Student Navbar */}
        <Navbar />

        <main className="dashboard-content">

          {/* ==================================
              Welcome Header
          ================================== */}

          <section className="dashboard-welcome">

            <div>
              <div className="dashboard-eyebrow">
                <Compass size={15} />
                Career Dashboard
              </div>

              <h1>
                Welcome back,{" "}
                {user?.name?.split(" ")[0] || "Student"}
              </h1>

              <p>
                Track your skills, learning progress,
                and career direction from one place.
              </p>
            </div>

            <div className="dashboard-header-actions">

              <button
                className="secondary-action"
                onClick={() => navigate("/profile")}
              >
                <UserRound size={17} />
                Profile
              </button>

              <button
                className="primary-action"
                onClick={() => navigate("/assessment")}
              >
                <Target size={17} />
                Career Assessment
              </button>

            </div>

          </section>

          {/* ==================================
              Career Selection
          ================================== */}

          <section className="career-focus-card">

            <div className="career-focus-left">

              <div className="career-focus-icon">
                <Target size={21} />
              </div>

              <div>

                <span className="section-label">
                  CURRENT CAREER FOCUS
                </span>

                <h2>
                  {targetCareer ||
                    "Choose your target career"}
                </h2>

                <p>
                  Your roadmap and internship
                  recommendations are based on this
                  career.
                </p>

              </div>

            </div>

            <div className="career-select-wrapper">

              <select
                value={targetCareer}
                onChange={(e) =>
                  handleCareerChange(e.target.value)
                }
              >
                <option value="">
                  Select target career
                </option>

                {careers.map((career) => (
                  <option
                    key={career._id}
                    value={career.name}
                  >
                    {career.name}
                  </option>
                ))}
              </select>

            </div>

          </section>

          {/* ==================================
              Overview Stats
          ================================== */}

          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon blue">
                <GraduationCap size={20} />
              </div>

              <div>
                <span>Skills assessed</span>
                <strong>
                  {assessedSkillCount}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon purple">
                <Target size={20} />
              </div>

              <div>
                <span>Assessment score</span>

                <strong>
                  {assessment
                    ? `${assessmentScore}%`
                    : "—"}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                <Map size={20} />
              </div>

              <div>
                <span>Roadmap progress</span>

                <strong>
                  {roadmapLoading
                    ? "—"
                    : `${roadmapProgress}%`}
                </strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                <TrendingUp size={20} />
              </div>

              <div>
                <span>Career readiness</span>

                <strong>
                  {assessment
                    ? `${Math.round(
                        (assessmentScore +
                          roadmapProgress) /
                          2
                      )}%`
                    : "—"}
                </strong>
              </div>

            </div>

          </section>

          {/* ==================================
              Main Grid
          ================================== */}

          <section className="dashboard-main-grid">

            {/* ==================================
                Roadmap
            ================================== */}

            <div className="dashboard-panel roadmap-panel">

              <div className="panel-header">

                <div>

                  <div className="panel-title-row">
                    <Map size={19} />
                    <h2>Learning Roadmap</h2>
                  </div>

                  <p>
                    Your progress toward{" "}
                    {targetCareer ||
                      "your target career"}.
                  </p>

                </div>

                <button
                  className="text-action"
                  onClick={() =>
                    navigate("/roadmap")
                  }
                >
                  View roadmap
                  <ArrowRight size={16} />
                </button>

              </div>

              {targetCareer ? (
                <>

                  <div className="roadmap-progress-area">

                    <div className="progress-heading">

                      <span>
                        {completedCount} of{" "}
                        {roadmap.length} steps completed
                      </span>

                      <strong>
                        {roadmapProgress}%
                      </strong>

                    </div>

                    <div className="progress-track">

                      <div
                        className="progress-value"
                        style={{
                          width: `${roadmapProgress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {roadmapLoading ? (

                    <div className="panel-empty">

                      <div className="loading-line" />

                      <div className="loading-line short" />

                    </div>

                  ) : nextStep ? (

                    <div className="next-step-card">

                      <div className="next-step-number">
                        {completedCount + 1}
                      </div>

                      <div className="next-step-content">

                        <span>
                          NEXT STEP
                        </span>

                        <h3>
                          {nextStep.title}
                        </h3>

                        <p>
                          {nextStep.description ||
                            "Continue this step to make progress on your roadmap."}
                        </p>

                      </div>

                      <button
                        className="icon-action"
                        onClick={() =>
                          navigate("/roadmap")
                        }
                        aria-label="Continue roadmap"
                      >
                        <ChevronRight size={19} />
                      </button>

                    </div>

                  ) : roadmap.length > 0 ? (

                    <div className="success-state">

                      <CheckCircle2 size={20} />

                      <div>

                        <strong>
                          Roadmap completed
                        </strong>

                        <p>
                          You have completed all
                          available roadmap steps.
                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="panel-empty">

                      <Map size={24} />

                      <strong>
                        No roadmap available
                      </strong>

                      <p>
                        A roadmap for this career
                        has not been added yet.
                      </p>

                    </div>

                  )}

                </>
              ) : (

                <div className="panel-empty">

                  <Target size={24} />

                  <strong>
                    Select a target career
                  </strong>

                  <p>
                    Choose a career above to start
                    tracking your roadmap.
                  </p>

                </div>

              )}

            </div>

            {/* ==================================
                Career Recommendation
            ================================== */}

            <div className="dashboard-panel recommendation-panel">

              <div className="panel-header">

                <div>

                  <div className="panel-title-row">
                    <Compass size={19} />
                    <h2>Career Match</h2>
                  </div>

                  <p>
                    Based on your latest assessment.
                  </p>

                </div>

                <button
                  className="text-action"
                  onClick={() =>
                    navigate("/careers")
                  }
                >
                  Explore
                  <ArrowRight size={16} />
                </button>

              </div>

              {recommendationLoading ? (

                <div className="panel-empty">

                  <Search size={23} />

                  <strong>
                    Analyzing your skills
                  </strong>

                  <p>
                    Preparing your career matches.
                  </p>

                </div>

              ) : topRecommendation ? (

                <div className="top-match">

                  <div className="match-top">

                    <div className="career-match-icon">
                      <BriefcaseBusiness size={21} />
                    </div>

                    <div>

                      <span>
                        TOP MATCH
                      </span>

                      <h3>
                        {topRecommendation.career}
                      </h3>

                    </div>

                  </div>

                  <div className="match-score-row">

                    <div className="match-score-value">
                      {topRecommendation.matchPercentage}%
                    </div>

                    <div className="match-score-copy">

                      <strong>
                        Skill compatibility
                      </strong>

                      <span>
                        Based on your assessment
                        results
                      </span>

                    </div>

                  </div>

                  <div className="match-progress">

                    <div
                      style={{
                        width: `${Math.min(
                          topRecommendation.matchPercentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="match-details">

                    {topRecommendation.matchedSkills
                      ?.length > 0 && (

                      <div>

                        <span className="detail-label">
                          Matching skills
                        </span>

                        <div className="skill-tags">

                          {topRecommendation.matchedSkills
                            .slice(0, 4)
                            .map((skill) => (

                              <span
                                key={skill.skill}
                                className="skill-tag"
                              >
                                {skill.skill}
                              </span>

                            ))}

                        </div>

                      </div>

                    )}

                    {topRecommendation.skillsToImprove
                      ?.length > 0 && (

                      <div className="improvement-note">

                        <CircleAlert size={16} />

                        <span>
                          {
                            topRecommendation
                              .skillsToImprove.length
                          }{" "}
                          skill
                          {topRecommendation
                            .skillsToImprove.length > 1
                            ? "s"
                            : ""}{" "}
                          need improvement
                        </span>

                      </div>

                    )}

                  </div>

                  <button
                    className="full-width-secondary"
                    onClick={() =>
                      navigate("/careers")
                    }
                  >
                    View career matches
                    <ArrowRight size={17} />
                  </button>

                </div>

              ) : (

                <div className="panel-empty">

                  <Target size={24} />

                  <strong>
                    No career matches yet
                  </strong>

                  <p>
                    Complete your assessment to
                    receive personalized career
                    recommendations.
                  </p>

                  <button
                    className="small-primary-button"
                    onClick={() =>
                      navigate("/assessment")
                    }
                  >
                    Start assessment
                    <ArrowRight size={16} />
                  </button>

                </div>

              )}

            </div>

          </section>

          {/* ==================================
              Quick Access
          ================================== */}

          <section className="quick-section">

            <div className="section-heading">

              <div>

                <h2>Continue your journey</h2>

                <p>
                  Quick access to your most
                  important career tools.
                </p>

              </div>

            </div>

            <div className="quick-grid">

              <button
                className="quick-card"
                onClick={() =>
                  navigate("/skills")
                }
              >

                <div className="quick-icon blue">
                  <GraduationCap size={20} />
                </div>

                <div>

                  <strong>My Skills</strong>

                  <span>
                    Review strengths and skill gaps
                  </span>

                </div>

                <ChevronRight size={18} />

              </button>

              <button
                className="quick-card"
                onClick={() =>
                  navigate("/resume-analyzer")
                }
              >

                <div className="quick-icon purple">
                  <FileText size={20} />
                </div>

                <div>

                  <strong>Resume Analyzer</strong>

                  <span>
                    Review and improve your resume
                  </span>

                </div>

                <ChevronRight size={18} />

              </button>

              <button
                className="quick-card"
                onClick={() =>
                  navigate("/learning")
                }
              >

                <div className="quick-icon green">
                  <BookOpen size={20} />
                </div>

                <div>

                  <strong>Learning Hub</strong>

                  <span>
                    Find resources for your career
                  </span>

                </div>

                <ChevronRight size={18} />

              </button>

              <button
                className="quick-card"
                onClick={() =>
                  navigate("/internships")
                }
              >

                <div className="quick-icon orange">
                  <BriefcaseBusiness size={20} />
                </div>

                <div>

                  <strong>Internships</strong>

                  <span>
                    Discover relevant opportunities
                  </span>

                </div>

                <ChevronRight size={18} />

              </button>

            </div>

          </section>

          {/* ==================================
              Assessment CTA
          ================================== */}

          {!assessment && (

            <section className="assessment-cta">

              <div className="cta-icon">
                <Target size={23} />
              </div>

              <div className="cta-content">

                <span>
                  GET STARTED
                </span>

                <h2>
                  Build your personalized career path
                </h2>

                <p>
                  Complete the assessment to understand
                  your strengths and discover careers
                  that align with your current skills.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/assessment")
                }
              >
                Take assessment
                <ArrowRight size={17} />
              </button>

            </section>

          )}

        </main>

      </div>

    </div>
  );
}

export default Dashboard;