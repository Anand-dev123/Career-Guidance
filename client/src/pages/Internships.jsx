import { useEffect, useMemo, useState } from "react";
import {
  Search,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  IndianRupee,
  CalendarDays,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  X,
  Target,
  Route,
  CircleAlert,
} from "lucide-react";

import api from "../services/api";
import "./Internships.css";

const CAREERS = [
  "All",
  "Software Developer",
  "Full Stack Developer",
  "Data Scientist",
  "AI/ML Engineer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
];

const MODES = ["All", "Remote", "On-site", "Hybrid"];

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");

  // ==========================================
  // Recommendations
  // ==========================================

  const [recommendedInternships, setRecommendedInternships] =
    useState([]);

  const [recommendationLoading, setRecommendationLoading] =
    useState(true);

  const [recommendationError, setRecommendationError] =
    useState("");

  const [targetCareer, setTargetCareer] = useState("");

  // ==========================================
  // Saved / Applications
  // ==========================================

  const [savedInternships, setSavedInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  const [actionLoading, setActionLoading] = useState("");
  const [showApplications, setShowApplications] =
    useState(false);

  // ==========================================
  // Initial Data
  // ==========================================

  useEffect(() => {
    fetchInternships();
    fetchSavedInternships();
    fetchApplications();
    fetchRecommendedInternships();
  }, []);

  // ==========================================
  // Fetch Live Internships
  // ==========================================

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/internships/live", {
        params: {
          keyword: "software developer internship",
        },
      });

      const liveJobs = response.data?.jobs || [];

      setInternships(liveJobs);
    } catch (error) {
      console.error(
        "Failed to fetch live internships:",
        error
      );

      setError(
        "Live opportunities could not be loaded. Showing available opportunities."
      );

      try {
        const fallbackResponse = await api.get(
          "/internships"
        );

        setInternships(fallbackResponse.data || []);
      } catch (fallbackError) {
        console.error(
          "Failed to fetch fallback internships:",
          fallbackError
        );

        setInternships([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch Recommendations
  // ==========================================

  const fetchRecommendedInternships = async () => {
    try {
      setRecommendationLoading(true);
      setRecommendationError("");

      const response = await api.get(
        "/internships/recommended"
      );

      setRecommendedInternships(
        response.data?.recommendations || []
      );

      setTargetCareer(
        response.data?.targetCareer || ""
      );
    } catch (error) {
      console.error(
        "Failed to fetch recommendations:",
        error
      );

      setRecommendationError(
        error.response?.data?.message ||
          "Personalized recommendations are unavailable."
      );
    } finally {
      setRecommendationLoading(false);
    }
  };

  // ==========================================
  // Saved Internships
  // ==========================================

  const fetchSavedInternships = async () => {
    try {
      const response = await api.get(
        "/internship-applications/saved"
      );

      const saved =
        response.data?.savedInternships ||
        response.data?.internships ||
        response.data?.data ||
        [];

      setSavedInternships(saved);
    } catch (error) {
      console.error(
        "Failed to fetch saved internships:",
        error
      );

      setSavedInternships([]);
    }
  };

  // ==========================================
  // Applications
  // ==========================================

  const fetchApplications = async () => {
    try {
      const response = await api.get(
        "/internship-applications/applications"
      );

      const applicationData =
        response.data?.applications ||
        response.data?.data ||
        [];

      setApplications(applicationData);
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error
      );

      setApplications([]);
    }
  };

  // ==========================================
  // Skills
  // ==========================================

  const skills = useMemo(() => {
    const allSkills = internships.flatMap(
      (internship) => internship.skills || []
    );

    return [
      "All",
      ...new Set(allSkills.filter(Boolean)),
    ];
  }, [internships]);

  // ==========================================
  // Saved Check
  // ==========================================

  const isSaved = (internshipId) => {
    return savedInternships.some(
      (item) =>
        String(item?._id || item) ===
        String(internshipId)
    );
  };

  // ==========================================
  // Application
  // ==========================================

  const getApplication = (internshipId) => {
    return applications.find(
      (application) =>
        String(
          application?.internship?._id ||
            application?.internship
        ) === String(internshipId)
    );
  };

  // ==========================================
  // Save / Unsave
  // ==========================================

  const handleSave = async (internship) => {
    const internshipId = internship?._id;

    if (!internshipId) return;

    try {
      setActionLoading(`save-${internshipId}`);

      if (isSaved(internshipId)) {
        await api.delete(
          `/internship-applications/${internshipId}/save`
        );

        setSavedInternships((prev) =>
          prev.filter(
            (item) =>
              String(item?._id || item) !==
              String(internshipId)
          )
        );
      } else {
        await api.post(
          `/internship-applications/${internshipId}/save`
        );

        setSavedInternships((prev) => [
          ...prev,
          internship,
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to save internship:",
        error
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // Apply
  // ==========================================

  const handleApply = async (internship) => {
    const internshipId = internship?._id;

    if (!internshipId) {
      if (internship.applyUrl) {
        window.open(
          internship.applyUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }

      return;
    }

    try {
      setActionLoading(`apply-${internshipId}`);

      await api.post(
        `/internship-applications/${internshipId}/apply`
      );

      await fetchApplications();
      await fetchSavedInternships();

      if (internship.applyUrl) {
        window.open(
          internship.applyUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error(
        "Failed to track application:",
        error
      );

      if (internship.applyUrl) {
        window.open(
          internship.applyUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // Update Application Status
  // ==========================================

  const updateApplicationStatus = async (
    internshipId,
    status
  ) => {
    try {
      setActionLoading(`status-${internshipId}`);

      await api.patch(
        `/internship-applications/${internshipId}/status`,
        {
          status,
        }
      );

      await fetchApplications();
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // Filters
  // ==========================================

  const filteredInternships = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return internships.filter((internship) => {
      const title = internship.title || "";
      const company = internship.company || "";
      const description =
        internship.description || "";

      const internshipSkills =
        internship.skills || [];

      const matchesSearch =
        !search ||
        title.toLowerCase().includes(search) ||
        company.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search) ||
        internshipSkills.some((skill) =>
          skill.toLowerCase().includes(search)
        );

      const matchesCareer =
        selectedCareer === "All" ||
        internship.career === selectedCareer;

      const matchesMode =
        selectedMode === "All" ||
        internship.mode === selectedMode;

      const matchesSkill =
        selectedSkill === "All" ||
        internshipSkills.includes(selectedSkill);

      return (
        matchesSearch &&
        matchesCareer &&
        matchesMode &&
        matchesSkill
      );
    });
  }, [
    internships,
    searchTerm,
    selectedCareer,
    selectedMode,
    selectedSkill,
  ]);

  // ==========================================
  // Format Deadline
  // ==========================================

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "No deadline";
    }

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return "No deadline";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Clear Filters
  // ==========================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCareer("All");
    setSelectedMode("All");
    setSelectedSkill("All");
  };

  const hasFilters =
    Boolean(searchTerm) ||
    selectedCareer !== "All" ||
    selectedMode !== "All" ||
    selectedSkill !== "All";

  // ==========================================
  // Status Style
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Interview":
        return "status-interview";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-saved";
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="internship-page">
        <div className="internship-container">

          <div className="internship-skeleton-header">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />
          </div>

          <div className="skeleton-feature-row">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="internship-skeleton-card"
              >
                <div className="skeleton skeleton-small" />
                <div className="skeleton skeleton-medium" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text short" />
              </div>
            ))}
          </div>

          <div className="skeleton-filter" />

          <div className="internship-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="internship-skeleton-card large"
              >
                <div className="skeleton skeleton-small" />
                <div className="skeleton skeleton-medium" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text short" />
                <div className="skeleton skeleton-button" />
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // Main UI
  // ==========================================

  return (
    <div className="internship-page">

      <div className="internship-container">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <header className="internship-header">

          <div>
            <div className="internship-eyebrow">
              <BriefcaseBusiness size={15} />
              Career Opportunities
            </div>

            <h1>
              Find your next internship
            </h1>

            <p>
              Discover opportunities aligned with
              your career goals and current skills.
            </p>
          </div>

          <button
            className="applications-button"
            onClick={() =>
              setShowApplications(!showApplications)
            }
          >
            <CheckCircle2 size={17} />

            Applications

            {applications.length > 0 && (
              <span className="application-count">
                {applications.length}
              </span>
            )}
          </button>

        </header>


        {/* ======================================
            SOURCE
        ====================================== */}

        <div className="source-note">
          Job listings powered by{" "}
          <a
            href="https://www.adzuna.co.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Adzuna
          </a>
        </div>


        {/* ======================================
            APPLICATION TRACKER
        ====================================== */}

        {showApplications && (
          <section className="application-panel">

            <div className="application-panel-header">

              <div>
                <div className="panel-eyebrow">
                  APPLICATION TRACKER
                </div>

                <h2>
                  Your applications
                </h2>

                <p>
                  Track the status of internship
                  opportunities you have applied to.
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowApplications(false)
                }
                aria-label="Close applications"
              >
                <X size={18} />
              </button>

            </div>


            {applications.length === 0 ? (
              <div className="application-empty">
                <CheckCircle2 size={26} />

                <strong>
                  No applications tracked yet
                </strong>

                <p>
                  Apply to an internship and your
                  application will appear here.
                </p>
              </div>
            ) : (
              <div className="application-list">

                {applications.map((application) => {
                  const internship =
                    application.internship;

                  if (!internship) {
                    return null;
                  }

                  const status =
                    application.status || "Applied";

                  return (
                    <div
                      key={application._id}
                      className="application-row"
                    >

                      <div className="application-info">

                        <div className="application-icon">
                          <BriefcaseBusiness
                            size={17}
                          />
                        </div>

                        <div>
                          <strong>
                            {internship.title}
                          </strong>

                          <span>
                            {internship.company}
                          </span>
                        </div>

                      </div>


                      <select
                        value={status}
                        disabled={
                          actionLoading ===
                          `status-${internship._id}`
                        }
                        onChange={(e) =>
                          updateApplicationStatus(
                            internship._id,
                            e.target.value
                          )
                        }
                        className={`status-select ${getStatusClass(
                          status
                        )}`}
                      >
                        <option value="Saved">
                          Saved
                        </option>

                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Interview">
                          Interview
                        </option>

                        <option value="Selected">
                          Selected
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                    </div>
                  );
                })}

              </div>
            )}

          </section>
        )}


        {/* ======================================
            RECOMMENDED
        ====================================== */}

        {!recommendationLoading &&
          recommendedInternships.length > 0 && (
            <section className="recommended-section">

              <div className="section-heading-row">

                <div>
                  <div className="section-eyebrow">
                    <Target size={14} />
                    Personalized
                  </div>

                  <h2>
                    Recommended for you
                  </h2>

                  <p>
                    Opportunities selected using
                    your career, skills and roadmap.
                  </p>
                </div>

                {targetCareer && (
                  <div className="career-focus-tag">
                    <Target size={13} />
                    {targetCareer}
                  </div>
                )}

              </div>


              <div className="recommended-grid">

                {recommendedInternships
                  .slice(0, 3)
                  .map((internship) => {
                    const application =
                      getApplication(internship._id);

                    return (
                      <article
                        key={internship._id}
                        className="recommended-card"
                      >

                        <div className="recommended-card-top">

                          <div className="company-icon">
                            <BriefcaseBusiness
                              size={17}
                            />
                          </div>

                          <div className="recommended-career">
                            {internship.career}
                          </div>

                          <div className="match-badge">
                            {internship.matchPercentage}%
                            <span> match</span>
                          </div>

                        </div>


                        <h3>
                          {internship.title}
                        </h3>

                        <p className="recommended-company">
                          {internship.company}
                        </p>


                        <div className="recommended-meta">
                          <span>
                            <MapPin size={13} />
                            {internship.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            <Clock3 size={13} />
                            {internship.duration ||
                              "Duration not specified"}
                          </span>
                        </div>


                        {internship.matchedSkills
                          ?.length > 0 && (
                          <div className="match-section">

                            <div className="match-section-label">
                              Matching skills
                            </div>

                            <div className="skill-tags">
                              {internship.matchedSkills
                                .slice(0, 4)
                                .map((item) => (
                                  <span
                                    key={item.skill}
                                  >
                                    {item.skill}
                                  </span>
                                ))}
                            </div>

                          </div>
                        )}


                        {internship.missingSkills
                          ?.length > 0 && (
                          <div className="learning-note">
                            <Route size={14} />

                            <span>
                              {internship.missingSkills
                                .length}{" "}
                              skill
                              {internship.missingSkills
                                .length > 1
                                ? "s"
                                : ""}{" "}
                              to strengthen
                            </span>
                          </div>
                        )}


                        {application && (
                          <div className="application-mini-status">
                            Application:
                            <strong>
                              {application.status}
                            </strong>
                          </div>
                        )}


                        <div className="recommended-actions">

                          <button
                            className={`save-button ${
                              isSaved(internship._id)
                                ? "saved"
                                : ""
                            }`}
                            onClick={() =>
                              handleSave(internship)
                            }
                            disabled={
                              actionLoading ===
                              `save-${internship._id}`
                            }
                            title={
                              isSaved(internship._id)
                                ? "Remove saved internship"
                                : "Save internship"
                            }
                          >
                            {isSaved(
                              internship._id
                            ) ? (
                              <BookmarkCheck
                                size={16}
                              />
                            ) : (
                              <Bookmark size={16} />
                            )}
                          </button>

                          <button
                            className="recommended-apply"
                            onClick={() =>
                              handleApply(internship)
                            }
                            disabled={
                              actionLoading ===
                              `apply-${internship._id}`
                            }
                          >
                            {application
                              ? "Open application"
                              : "Apply now"}

                            <ExternalLink size={14} />
                          </button>

                        </div>

                      </article>
                    );
                  })}

              </div>

            </section>
          )}


        {/* ======================================
            RECOMMENDATION ERROR
        ====================================== */}

        {recommendationError &&
          recommendedInternships.length === 0 && (
            <div className="recommendation-note">
              <CircleAlert size={16} />
              <span>
                {recommendationError}
              </span>
            </div>
          )}


        {/* ======================================
            SEARCH + FILTERS
        ====================================== */}

        <section className="filters-panel">

          <div className="filters-header">

            <div>
              <div className="section-eyebrow">
                <SlidersHorizontal size={14} />
                Browse opportunities
              </div>

              <h2>
                Find an internship
              </h2>
            </div>

            {hasFilters && (
              <button
                className="clear-filters"
                onClick={clearFilters}
              >
                <X size={14} />
                Clear filters
              </button>
            )}

          </div>


          <div className="filters-row">

            <div className="search-field">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search by role, company or skill"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>


            <select
              value={selectedCareer}
              onChange={(e) =>
                setSelectedCareer(e.target.value)
              }
            >
              {CAREERS.map((career) => (
                <option
                  key={career}
                  value={career}
                >
                  {career === "All"
                    ? "All careers"
                    : career}
                </option>
              ))}
            </select>


            <select
              value={selectedMode}
              onChange={(e) =>
                setSelectedMode(e.target.value)
              }
            >
              {MODES.map((mode) => (
                <option
                  key={mode}
                  value={mode}
                >
                  {mode === "All"
                    ? "All modes"
                    : mode}
                </option>
              ))}
            </select>


            <select
              value={selectedSkill}
              onChange={(e) =>
                setSelectedSkill(e.target.value)
              }
            >
              {skills.map((skill) => (
                <option
                  key={skill}
                  value={skill}
                >
                  {skill === "All"
                    ? "All skills"
                    : skill}
                </option>
              ))}
            </select>

          </div>

        </section>


        {/* ======================================
            ERROR / FALLBACK
        ====================================== */}

        {error && (
          <div className="data-warning">
            <CircleAlert size={16} />
            <span>{error}</span>
          </div>
        )}


        {/* ======================================
            RESULTS HEADER
        ====================================== */}

        <div className="results-header">

          <div>
            <strong>
              {filteredInternships.length}
            </strong>{" "}
            opportunities
          </div>

          {savedInternships.length > 0 && (
            <div className="saved-count">
              <Bookmark size={14} />
              {savedInternships.length} saved
            </div>
          )}

        </div>


        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {filteredInternships.length === 0 ? (

          <div className="internship-empty">

            <div className="empty-icon">
              <BriefcaseBusiness size={25} />
            </div>

            <h3>
              No internships found
            </h3>

            <p>
              Try adjusting your search or filters
              to find more opportunities.
            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="empty-action"
              >
                Clear filters
              </button>
            )}

          </div>

        ) : (

          /* ====================================
             INTERNSHIP GRID
          ==================================== */

          <div className="internship-grid">

            {filteredInternships.map((internship) => {
              const application =
                getApplication(internship._id);

              const saved = isSaved(
                internship._id
              );

              return (
                <article
                  key={internship._id}
                  className="internship-card"
                >

                  {/* CARD HEADER */}

                  <div className="internship-card-header">

                    <div className="role-icon">
                      <BriefcaseBusiness size={16} />
                    </div>

                    <div className="card-career">
                      {internship.career ||
                        "Career opportunity"}
                    </div>

                    <button
                      className={`bookmark-button ${
                        saved ? "saved" : ""
                      }`}
                      onClick={() =>
                        handleSave(internship)
                      }
                      disabled={
                        actionLoading ===
                        `save-${internship._id}`
                      }
                      title={
                        saved
                          ? "Remove saved internship"
                          : "Save internship"
                      }
                    >
                      {saved ? (
                        <BookmarkCheck size={16} />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>

                  </div>


                  {/* TITLE */}

                  <h3 className="internship-title">
                    {internship.title}
                  </h3>


                  {/* COMPANY */}

                  <p className="internship-company">
                    {internship.company}
                  </p>


                  {/* DESCRIPTION */}

                  <p className="internship-description">
                    {internship.description ||
                      "No description available."}
                  </p>


                  {/* META */}

                  <div className="internship-meta">

                    <span>
                      <MapPin size={14} />
                      {internship.location ||
                        "Not specified"}
                    </span>

                    <span>
                      <Clock3 size={14} />
                      {internship.jobType ||
                        internship.duration ||
                        "Not specified"}
                    </span>

                    <span>
                      <IndianRupee size={14} />
                      {internship.stipend ||
                        "Not specified"}
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      {formatDeadline(
                        internship.deadline
                      )}
                    </span>

                  </div>


                  {/* SKILLS */}

                  {internship.skills?.length > 0 && (
                    <div className="internship-skills">

                      {internship.skills
                        .slice(0, 5)
                        .map((skill) => (
                          <span key={skill}>
                            {skill}
                          </span>
                        ))}

                      {internship.skills.length > 5 && (
                        <span className="more-skills">
                          +
                          {internship.skills.length - 5}
                        </span>
                      )}

                    </div>
                  )}


                  {/* APPLICATION */}

                  {application && (
                    <div className="card-application-status">

                      <span>
                        Application
                      </span>

                      <select
                        value={application.status}
                        disabled={
                          actionLoading ===
                          `status-${internship._id}`
                        }
                        onChange={(e) =>
                          updateApplicationStatus(
                            internship._id,
                            e.target.value
                          )
                        }
                        className={`status-select compact ${getStatusClass(
                          application.status
                        )}`}
                      >
                        <option value="Saved">
                          Saved
                        </option>

                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Interview">
                          Interview
                        </option>

                        <option value="Selected">
                          Selected
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                    </div>
                  )}


                  {/* FOOTER */}

                  <div className="internship-card-footer">

                    {internship.source && (
                      <span className="source-label">
                        Source: {internship.source}
                      </span>
                    )}

                    <button
                      className={`apply-button ${
                        application
                          ? "applied"
                          : ""
                      }`}
                      onClick={() =>
                        handleApply(internship)
                      }
                      disabled={
                        actionLoading ===
                        `apply-${internship._id}`
                      }
                    >
                      {application
                        ? "Open application"
                        : "Apply now"}

                      <ExternalLink size={14} />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}


        {/* ======================================
            FOOTER NOTE
        ====================================== */}

        {filteredInternships.length > 0 && (
          <div className="internship-footer-note">
            Internship availability and details may
            change on the source platform. Verify the
            opportunity before applying.
          </div>
        )}

      </div>
    </div>
  );
};

export default Internships;