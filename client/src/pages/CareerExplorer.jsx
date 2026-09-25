import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import {
  Search,
  SlidersHorizontal,
  BriefcaseBusiness,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Target,
  Layers3,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import "./CareerExplorer.css";

function CareerExplorer() {
  const [careers, setCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] =
    useState(false);

  // =========================================================
  // Fetch Careers + Career Recommendations
  // =========================================================

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        setLoading(true);
        setRecommendationLoading(true);

        // Fetch careers from MongoDB
        const careersResponse = await api.get("/careers");

        const databaseCareers = careersResponse.data || [];

        // Format careers
        let formattedCareers = databaseCareers.map((career) => ({
          id: career._id,
          title: career.name,
          domain: career.category,
          description: career.description,
          skills: career.requiredSkills || [],
          roadmap: career.roadmap || [],
          difficulty: career.difficulty || "Intermediate",
          matchPercentage: null,
          matchedSkills: [],
          skillsToImprove: [],
          missingSkills: [],
          recommendationReason: "",
        }));

        // Get latest assessment
        try {
          const assessmentResponse =
            await api.get("/assessments/latest");

          const assessment = assessmentResponse.data;

          const skillResults = assessment.skillResults || [];

          if (skillResults.length > 0) {
            // Convert scores into 0-3 proficiency
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

            // Generate Career Recommendations
            const recommendationResponse =
              await api.post("/careers/recommend", {
                skills: userSkills,
              });

            const responseData = recommendationResponse.data;

            const recommendations = Array.isArray(responseData)
              ? responseData
              : responseData.recommendations || [];

            // Attach recommendation data
            formattedCareers = formattedCareers.map((career) => {
              const recommendation = recommendations.find(
                (item) => item.career === career.title
              );

              if (!recommendation) {
                return career;
              }

              return {
                ...career,
                matchPercentage:
                  recommendation.matchPercentage,
                matchedSkills:
                  recommendation.matchedSkills || [],
                skillsToImprove:
                  recommendation.skillsToImprove || [],
                missingSkills:
                  recommendation.missingSkills || [],
                recommendationReason:
                  recommendation.recommendationReason || "",
              };
            });
          }
        } catch (assessmentError) {
          if (assessmentError.response?.status === 404) {
            console.log("No assessment found yet.");
          } else {
            console.error(
              "Failed to generate career recommendations:",
              assessmentError
            );
          }
        }

        setCareers(formattedCareers);
      } catch (error) {
        console.error("Failed to fetch careers:", error);
      } finally {
        setLoading(false);
        setRecommendationLoading(false);
      }
    };

    fetchCareerData();
  }, []);

  // =========================================================
  // Load Saved Careers
  // =========================================================

  useEffect(() => {
    const saved = localStorage.getItem("savedCareers");

    if (saved) {
      try {
        setSavedCareers(JSON.parse(saved));
      } catch (error) {
        console.error(
          "Failed to load saved careers:",
          error
        );
        setSavedCareers([]);
      }
    }
  }, []);

  // =========================================================
  // Save / Unsave Career
  // =========================================================

  const toggleSaveCareer = (career) => {
    const alreadySaved = savedCareers.some(
      (savedCareer) => savedCareer.id === career.id
    );

    let updatedCareers;

    if (alreadySaved) {
      updatedCareers = savedCareers.filter(
        (savedCareer) => savedCareer.id !== career.id
      );
    } else {
      updatedCareers = [...savedCareers, career];
    }

    setSavedCareers(updatedCareers);

    localStorage.setItem(
      "savedCareers",
      JSON.stringify(updatedCareers)
    );
  };

  // =========================================================
  // Domains
  // =========================================================

  const domains = useMemo(() => {
    return [
      "All",
      ...new Set(
        careers
          .map((career) => career.domain)
          .filter(Boolean)
      ),
    ];
  }, [careers]);

  // =========================================================
  // Search + Filter
  // =========================================================

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        career.title?.toLowerCase().includes(search) ||
        career.description?.toLowerCase().includes(search) ||
        career.skills?.some((skill) =>
          skill.toLowerCase().includes(search)
        );

      const matchesDomain =
        selectedDomain === "All" ||
        career.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [careers, searchTerm, selectedDomain]);

  // =========================================================
  // Open Career Details
  // =========================================================

  const openCareerDetails = (career) => {
    setSelectedCareer(career);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // Helper Functions
  // =========================================================

  const isSaved = (careerId) => {
    return savedCareers.some(
      (career) => career.id === careerId
    );
  };

  const getMatchClass = (percentage) => {
    if (percentage >= 80) return "excellent";
    if (percentage >= 65) return "strong";
    if (percentage >= 50) return "good";
    return "potential";
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

          <main className="career-explorer-page">
            <div className="career-page-header">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>

            <div className="career-toolbar skeleton-toolbar">
              <div className="skeleton-input" />
              <div className="skeleton-select" />
            </div>

            <div className="career-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  className="career-card career-skeleton"
                  key={item}
                >
                  <div className="skeleton-card-title" />
                  <div className="skeleton-card-line" />
                  <div className="skeleton-card-line short" />

                  <div className="skeleton-tags">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="skeleton-button" />
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

        <main className="career-explorer-page">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          {!selectedCareer && (
            <section className="career-page-header">
              <div className="career-header-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <div className="career-eyebrow">
                  Career Discovery
                </div>

                <h1>Career Explorer</h1>

                <p>
                  Explore career paths and understand how
                  your current skills align with each option.
                </p>
              </div>
            </section>
          )}

          {/* =================================================
              RECOMMENDATION STATUS
          ================================================= */}

          {!selectedCareer &&
            recommendationLoading && (
              <div className="career-analysis-message">
                <div className="analysis-spinner" />

                <div>
                  <strong>
                    Analyzing your skills
                  </strong>

                  <span>
                    Generating personalized career matches
                    based on your assessment.
                  </span>
                </div>
              </div>
            )}

          {/* =================================================
              TOOLBAR
          ================================================= */}

          {!selectedCareer && (
            <section className="career-toolbar">
              <div className="career-search-box">
                <Search size={19} />

                <input
                  type="text"
                  placeholder="Search careers, skills or descriptions..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="career-filter-box">
                <SlidersHorizontal size={18} />

                <select
                  value={selectedDomain}
                  onChange={(e) =>
                    setSelectedDomain(e.target.value)
                  }
                >
                  {domains.map((domain) => (
                    <option
                      key={domain}
                      value={domain}
                    >
                      {domain === "All"
                        ? "All domains"
                        : domain}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>
            </section>
          )}

          {/* =================================================
              RESULTS SUMMARY
          ================================================= */}

          {!selectedCareer && (
            <div className="career-results-row">
              <div className="career-results-count">
                <strong>
                  {filteredCareers.length}
                </strong>

                <span>
                  {filteredCareers.length === 1
                    ? "career found"
                    : "careers found"}
                </span>
              </div>


            </div>
          )}

          {/* =================================================
              CAREER DETAIL
          ================================================= */}

          {selectedCareer && (
            <section className="career-detail-page">

              {/* Back */}
              <button
                className="career-back-btn"
                onClick={() =>
                  setSelectedCareer(null)
                }
              >
                <ArrowLeft size={17} />
                Back to Careers
              </button>

              {/* Hero */}
              <div className="career-detail-hero">
                <div className="career-detail-main">
                  <div className="career-detail-icon">
                    <BriefcaseBusiness size={28} />
                  </div>

                  <div>
                    <div className="career-detail-domain">
                      {selectedCareer.domain}
                    </div>

                    <h1>
                      {selectedCareer.title}
                    </h1>

                    <p>
                      {selectedCareer.description}
                    </p>
                  </div>
                </div>

                {selectedCareer.matchPercentage !==
                  null && (
                  <div
                    className={`detail-match-card ${getMatchClass(
                      selectedCareer.matchPercentage
                    )}`}
                  >
                    <div className="match-label">
                      <Target size={16} />
                      Your Skill Match
                    </div>

                    <strong>
                      {selectedCareer.matchPercentage}%
                    </strong>

                    <div className="match-progress">
                      <span
                        style={{
                          width: `${Math.min(
                            selectedCareer.matchPercentage,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <small>
                      Based on your latest assessment
                    </small>
                  </div>
                )}
              </div>

              {/* Main Detail Grid */}
              <div className="career-detail-grid">

                {/* Left */}
                <div className="career-detail-left">

                  {/* Required Skills */}
                  <div className="detail-section">
                    <div className="detail-section-heading">
                      <div className="detail-section-icon">
                        <Layers3 size={18} />
                      </div>

                      <div>
                        <h2>Required Skills</h2>
                        <p>
                          Core skills commonly needed for
                          this career.
                        </p>
                      </div>
                    </div>

                    <div className="career-skills detail-skills">
                      {selectedCareer.skills.length > 0 ? (
                        selectedCareer.skills.map(
                          (skill) => (
                            <span key={skill}>
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span className="empty-skill">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {selectedCareer.matchedSkills
                    ?.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-heading">
                        <div className="detail-section-icon success">
                          <CheckCircle2 size={18} />
                        </div>

                        <div>
                          <h2>Your Matched Skills</h2>
                          <p>
                            Skills that already align with
                            this career.
                          </p>
                        </div>
                      </div>

                      <div className="analysis-list">
                        {selectedCareer.matchedSkills.map(
                          (skill, index) => (
                            <div
                              className="analysis-item matched"
                              key={
                                skill.skill ||
                                `matched-${index}`
                              }
                            >
                              <CheckCircle2 size={17} />

                              <span>
                                {skill.skill}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills to Improve */}
                  {selectedCareer.skillsToImprove
                    ?.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-heading">
                        <div className="detail-section-icon warning">
                          <AlertCircle size={18} />
                        </div>

                        <div>
                          <h2>Skills to Improve</h2>
                          <p>
                            Skills where additional practice
                            can help.
                          </p>
                        </div>
                      </div>

                      <div className="analysis-list">
                        {selectedCareer.skillsToImprove.map(
                          (skill, index) => (
                            <div
                              className="analysis-item improve"
                              key={
                                skill.skill ||
                                `improve-${index}`
                              }
                            >
                              <AlertCircle size={17} />

                              <span>
                                {skill.skill}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {selectedCareer.missingSkills
                    ?.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-heading">
                        <div className="detail-section-icon danger">
                          <XCircle size={18} />
                        </div>

                        <div>
                          <h2>Missing Skills</h2>
                          <p>
                            Skills you may need to learn for
                            this career.
                          </p>
                        </div>
                      </div>

                      <div className="analysis-list">
                        {selectedCareer.missingSkills.map(
                          (skill, index) => (
                            <div
                              className="analysis-item missing"
                              key={
                                skill ||
                                `missing-${index}`
                              }
                            >
                              <XCircle size={17} />

                              <span>{skill}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendation Reason */}
                  {selectedCareer.recommendationReason && (
                    <div className="recommendation-card">
                      <div className="recommendation-icon">
                        <Sparkles size={18} />
                      </div>

                      <div>
                        <h2>Skill Analysis</h2>

                        <p>
                          {
                            selectedCareer.recommendationReason
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Career Overview */}
                  <div className="detail-section">
                    <div className="detail-section-heading">
                      <div className="detail-section-icon">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div>
                        <h2>Career Overview</h2>
                        <p>
                          What to focus on while preparing
                          for this career.
                        </p>
                      </div>
                    </div>

                    <p className="career-overview-text">
                      This career requires strong technical
                      knowledge, problem-solving ability and
                      continuous learning. Build practical
                      projects and improve the required skills
                      to prepare for this career path.
                    </p>
                  </div>
                </div>

                {/* Right */}
                <aside className="career-detail-sidebar">
                  <div className="career-action-card">
                    <div className="action-card-top">
                      <div>
                        <span>Career Profile</span>
                        <h3>
                          {selectedCareer.title}
                        </h3>
                      </div>

                      <div className="action-career-icon">
                        <BriefcaseBusiness size={19} />
                      </div>
                    </div>

                    <div className="career-meta">
                      <div>
                        <span>Domain</span>
                        <strong>
                          {selectedCareer.domain}
                        </strong>
                      </div>

                      <div>
                        <span>Difficulty</span>
                        <strong>
                          {selectedCareer.difficulty}
                        </strong>
                      </div>

                      <div>
                        <span>Skills</span>
                        <strong>
                          {selectedCareer.skills.length}
                        </strong>
                      </div>
                    </div>

                    <button
                      className={`detail-save-btn ${
                        isSaved(selectedCareer.id)
                          ? "saved"
                          : ""
                      }`}
                      onClick={() =>
                        toggleSaveCareer(
                          selectedCareer
                        )
                      }
                    >
                      {isSaved(selectedCareer.id) ? (
                        <>
                          <BookmarkCheck size={18} />
                          Saved Career
                        </>
                      ) : (
                        <>
                          <Bookmark size={18} />
                          Save Career
                        </>
                      )}
                    </button>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* =================================================
              SAVED CAREERS
          ================================================= */}

          {!selectedCareer &&
            savedCareers.length > 0 && (
              <section className="saved-careers-section">
                <div className="section-heading-row">
                  <div>
                    <div className="section-eyebrow">
                      Your Collection
                    </div>

                    <h2>Saved Careers</h2>

                    <p>
                      Career options you want to explore
                      later.
                    </p>
                  </div>

                  <div className="saved-count">
                    <BookmarkCheck size={16} />
                    {savedCareers.length} Saved
                  </div>
                </div>

                <div className="saved-careers-grid">
                  {savedCareers.map((career) => (
                    <div
                      className="saved-career-card"
                      key={career.id}
                    >
                      <div className="saved-career-icon">
                        <BriefcaseBusiness size={19} />
                      </div>

                      <div className="saved-career-info">
                        <h3>{career.title}</h3>

                        <span>
                          {career.domain}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          openCareerDetails(career)
                        }
                        className="saved-view-btn"
                      >
                        View
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* =================================================
              CAREER GRID
          ================================================= */}

          {!selectedCareer && (
            <section className="career-list-section">
              <div className="section-heading-row">
                <div>
                  <div className="section-eyebrow">
                    Explore Opportunities
                  </div>

                  <h2>Career Paths</h2>

                  <p>
                    Explore available career options based
                    on your interests and skills.
                  </p>
                </div>
              </div>

              {filteredCareers.length > 0 ? (
                <div className="career-grid">
                  {filteredCareers.map((career) => (
                    <article
                      className="career-card"
                      key={career.id}
                    >
                      {/* Card Header */}
                      <div className="career-card-top">
                        <div className="career-card-icon">
                          <BriefcaseBusiness size={20} />
                        </div>

                        <button
                          className={`card-bookmark ${
                            isSaved(career.id)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSaveCareer(career)
                          }
                          aria-label={
                            isSaved(career.id)
                              ? "Unsave career"
                              : "Save career"
                          }
                        >
                          {isSaved(career.id) ? (
                            <BookmarkCheck size={18} />
                          ) : (
                            <Bookmark size={18} />
                          )}
                        </button>
                      </div>

                      <div className="career-card-heading">
                        <div>
                          <span className="career-domain">
                            {career.domain}
                          </span>

                          <h3>{career.title}</h3>
                        </div>

                        {career.matchPercentage !==
                          null && (
                          <div
                            className={`card-match ${
                              getMatchClass(
                                career.matchPercentage
                              )
                            }`}
                          >
                            <strong>
                              {
                                career.matchPercentage
                              }
                              %
                            </strong>

                            <span>Match</span>
                          </div>
                        )}
                      </div>

                      <p className="career-card-description">
                        {career.description}
                      </p>

                      {/* Skills */}
                      <div className="career-card-skills">
                        {career.skills
                          .slice(0, 5)
                          .map((skill) => (
                            <span key={skill}>
                              {skill}
                            </span>
                          ))}

                        {career.skills.length > 5 && (
                          <span className="more-skills">
                            +{career.skills.length - 5}
                          </span>
                        )}
                      </div>

                      {/* Quick Analysis */}
                      {career.matchPercentage !==
                        null && (
                        <div className="quick-analysis">
                          <div>
                            <CheckCircle2 size={15} />
                            <span>
                              {
                                career.matchedSkills
                                  .length
                              }{" "}
                              matched
                            </span>
                          </div>

                          <div>
                            <AlertCircle size={15} />
                            <span>
                              {
                                career.skillsToImprove
                                  .length
                              }{" "}
                              improve
                            </span>
                          </div>

                          <div>
                            <XCircle size={15} />
                            <span>
                              {
                                career.missingSkills
                                  .length
                              }{" "}
                              missing
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="career-card-footer">
                        <button
                          className="career-view-btn"
                          onClick={() =>
                            openCareerDetails(
                              career
                            )
                          }
                        >
                          View Career
                          <ArrowRight size={16} />
                        </button>

                        <button
                          className={`career-save-btn ${
                            isSaved(career.id)
                              ? "saved"
                              : ""
                          }`}
                          onClick={() =>
                            toggleSaveCareer(
                              career
                            )
                          }
                        >
                          {isSaved(career.id) ? (
                            <>
                              <BookmarkCheck size={16} />
                              Saved
                            </>
                          ) : (
                            <>
                              <Bookmark size={16} />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="career-empty-state">
                  <div className="empty-icon">
                    <Search size={24} />
                  </div>

                  <h3>No careers found</h3>

                  <p>
                    Try changing your search term or
                    selecting a different domain.
                  </p>

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDomain("All");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default CareerExplorer;