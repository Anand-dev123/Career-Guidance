import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Search,
  Clock3,
  Target,
  SlidersHorizontal,
  X,
  CircleAlert,
  Route,
} from "lucide-react";

import api from "../services/api";
import "./Learning.css";

const DIFFICULTIES = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const LearningHub = () => {
  const [resources, setResources] = useState([]);
  const [recommendations, setRecommendations] =
    useState([]);

  const [targetCareer, setTargetCareer] =
    useState("");

  const [recommendationMessage, setRecommendationMessage] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("All");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All");

  const [selectedCareer, setSelectedCareer] =
    useState("All");

  // ==========================================
  // Fetch Data
  // ==========================================

  useEffect(() => {
    fetchResources();
    fetchRecommendations();
  }, []);

  // ==========================================
  // Resources
  // ==========================================

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/learning-resources"
      );

      setResources(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch learning resources:",
        error
      );

      setError(
        "Unable to load learning resources."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Recommendations
  // ==========================================

  const fetchRecommendations = async () => {
    try {
      setRecommendationLoading(true);

      const response = await api.get(
        "/learning-resources/recommendations"
      );

      setTargetCareer(
        response.data?.targetCareer || ""
      );

      setRecommendations(
        response.data?.recommendations || []
      );

      setRecommendationMessage(
        response.data?.message || ""
      );
    } catch (error) {
      console.error(
        "Failed to fetch recommendations:",
        error
      );

      setRecommendationMessage(
        "Unable to load personalized recommendations."
      );
    } finally {
      setRecommendationLoading(false);
    }
  };

  // ==========================================
  // Resource Types
  // ==========================================

  const resourceTypes = useMemo(() => {
    return [
      "All",
      ...new Set(
        resources
          .map((resource) => resource.type)
          .filter(Boolean)
      ),
    ];
  }, [resources]);

  // ==========================================
  // Careers
  // ==========================================

  const careers = useMemo(() => {
    return [
      "All",
      ...new Set(
        resources
          .map((resource) => resource.career)
          .filter(Boolean)
      ),
    ];
  }, [resources]);

  // ==========================================
  // Filter Resources
  // ==========================================

  const filteredResources = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return resources.filter((resource) => {
      const title =
        resource.title || "";

      const skill =
        resource.skill || "";

      const description =
        resource.description || "";

      const matchesSearch =
        !search ||
        title.toLowerCase().includes(search) ||
        skill.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search);

      const matchesType =
        selectedType === "All" ||
        resource.type === selectedType;

      const matchesDifficulty =
        selectedDifficulty === "All" ||
        resource.difficulty ===
          selectedDifficulty;

      const matchesCareer =
        selectedCareer === "All" ||
        resource.career === selectedCareer;

      return (
        matchesSearch &&
        matchesType &&
        matchesDifficulty &&
        matchesCareer
      );
    });
  }, [
    resources,
    searchTerm,
    selectedType,
    selectedDifficulty,
    selectedCareer,
  ]);

  // ==========================================
  // Clear Filters
  // ==========================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedDifficulty("All");
    setSelectedCareer("All");
  };

  const hasFilters =
    Boolean(searchTerm) ||
    selectedType !== "All" ||
    selectedDifficulty !== "All" ||
    selectedCareer !== "All";

  // ==========================================
  // Difficulty Class
  // ==========================================

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "difficulty-beginner";

      case "Intermediate":
        return "difficulty-intermediate";

      case "Advanced":
        return "difficulty-advanced";

      default:
        return "";
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="learning-page">
        <div className="learning-container">

          <div className="learning-header-skeleton">
            <div className="learning-skeleton title" />
            <div className="learning-skeleton subtitle" />
          </div>

          <div className="learning-recommendation-skeleton">
            <div className="learning-skeleton medium" />
            <div className="learning-skeleton large" />

            <div className="learning-skeleton-cards">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="learning-skeleton-card"
                >
                  <div className="learning-skeleton small" />
                  <div className="learning-skeleton medium" />
                  <div className="learning-skeleton text" />
                  <div className="learning-skeleton text short" />
                </div>
              ))}
            </div>
          </div>

          <div className="learning-filter-skeleton" />

          <div className="learning-resource-grid">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="learning-skeleton-card resource"
                >
                  <div className="learning-skeleton small" />
                  <div className="learning-skeleton medium" />
                  <div className="learning-skeleton text" />
                  <div className="learning-skeleton text" />
                  <div className="learning-skeleton button" />
                </div>
              )
            )}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // Main UI
  // ==========================================

  return (
    <div className="learning-page">

      <div className="learning-container">

        {/* ====================================
            HEADER
        ==================================== */}

        <header className="learning-header">

          <div>
            <div className="learning-eyebrow">
              <BookOpen size={14} />
              Learning Center
            </div>

            <h1>
              Learning Hub
            </h1>

            <p>
              Explore resources to strengthen your
              skills and move closer to your career
              goal.
            </p>
          </div>

        </header>


        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="learning-error">
            <CircleAlert size={16} />
            <span>{error}</span>
          </div>
        )}


        {/* ====================================
            PERSONALIZED RECOMMENDATIONS
        ==================================== */}

        <section className="learning-recommendation">

          <div className="recommendation-header">

            <div className="recommendation-title-group">

              <div className="recommendation-icon">
                <Target size={19} />
              </div>

              <div>
                <div className="section-eyebrow">
                  Personalized Learning
                </div>

                <h2>
                  Recommended for you
                </h2>

                {targetCareer && (
                  <p>
                    Based on your target career:{" "}
                    <strong>
                      {targetCareer}
                    </strong>
                  </p>
                )}
              </div>

            </div>


            {targetCareer && (
              <div className="target-career-badge">
                <Target size={13} />
                {targetCareer}
              </div>
            )}

          </div>


          {recommendationLoading ? (

            <div className="recommendation-loading">
              <div className="loading-dot" />
              <span>
                Finding resources based on your
                skill gaps...
              </span>
            </div>

          ) : recommendations.length === 0 ? (

            <div className="recommendation-empty">

              <div className="recommendation-empty-icon">
                <BookOpen size={22} />
              </div>

              <div>
                <strong>
                  No personalized resources yet
                </strong>

                <p>
                  {recommendationMessage ||
                    "Complete your assessment to get personalized learning recommendations."}
                </p>
              </div>

            </div>

          ) : (

            <div className="recommendation-grid">

              {recommendations.map(
                (resource) => (
                  <article
                    key={resource._id}
                    className="recommendation-card"
                  >

                    <div className="recommendation-card-top">

                      <span className="resource-type">
                        {resource.type ||
                          "Resource"}
                      </span>

                      {resource.currentPercentage !==
                        undefined && (
                        <span className="skill-percentage">
                          {resource.currentPercentage}%
                          current
                        </span>
                      )}

                    </div>


                    <h3>
                      {resource.title}
                    </h3>


                    <div className="recommendation-skill">
                      <Route size={13} />

                      <span>
                        {resource.skill ||
                          "Skill development"}
                      </span>
                    </div>


                    <p className="recommendation-reason">
                      {resource.recommendationReason ||
                        resource.description ||
                        "Recommended based on your learning needs."}
                    </p>


                    <div className="resource-duration">
                      <Clock3 size={14} />

                      <span>
                        {resource.estimatedMinutes ||
                          "—"}{" "}
                        minutes
                      </span>
                    </div>


                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-button"
                    >
                      Open resource
                      <ExternalLink size={14} />
                    </a>

                  </article>
                )
              )}

            </div>

          )}

        </section>


        {/* ====================================
            FILTERS
        ==================================== */}

        <section className="learning-filters">

          <div className="filters-header">

            <div>
              <div className="section-eyebrow">
                <SlidersHorizontal size={13} />
                Browse resources
              </div>

              <h2>
                Find something to learn
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


          <div className="learning-filter-row">

            <div className="learning-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search resources or skills..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>


            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
            >
              {resourceTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type === "All"
                    ? "All types"
                    : type}
                </option>
              ))}
            </select>


            <select
              value={selectedDifficulty}
              onChange={(e) =>
                setSelectedDifficulty(
                  e.target.value
                )
              }
            >
              {DIFFICULTIES.map(
                (difficulty) => (
                  <option
                    key={difficulty}
                    value={difficulty}
                  >
                    {difficulty === "All"
                      ? "All difficulties"
                      : difficulty}
                  </option>
                )
              )}
            </select>


            <select
              value={selectedCareer}
              onChange={(e) =>
                setSelectedCareer(e.target.value)
              }
            >
              {careers.map((career) => (
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

          </div>

        </section>


        {/* ====================================
            RESULTS HEADER
        ==================================== */}

        <div className="learning-results-header">

          <div>
            <strong>
              {filteredResources.length}
            </strong>{" "}
            learning resources
          </div>

          {hasFilters && (
            <span>
              Filtered results
            </span>
          )}

        </div>


        {/* ====================================
            RESOURCE GRID
        ==================================== */}

        {filteredResources.length === 0 ? (

          <div className="learning-empty">

            <div className="learning-empty-icon">
              <BookOpen size={25} />
            </div>

            <h3>
              No resources found
            </h3>

            <p>
              Try changing your search or
              filters to find more resources.
            </p>

            {hasFilters && (
              <button
                className="empty-clear-button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}

          </div>

        ) : (

          <div className="learning-resource-grid">

            {filteredResources.map(
              (resource) => (
                <article
                  key={resource._id}
                  className="learning-resource-card"
                >

                  <div className="resource-card-top">

                    <div className="resource-card-icon">
                      <BookOpen size={17} />
                    </div>

                    <span className="resource-card-type">
                      {resource.type ||
                        "Resource"}
                    </span>

                    {resource.difficulty && (
                      <span
                        className={`resource-difficulty ${getDifficultyClass(
                          resource.difficulty
                        )}`}
                      >
                        {resource.difficulty}
                      </span>
                    )}

                  </div>


                  <h3>
                    {resource.title}
                  </h3>


                  {resource.skill && (
                    <div className="resource-skill">
                      <Route size={13} />
                      {resource.skill}
                    </div>
                  )}


                  {resource.career && (
                    <div className="resource-career">
                      Career:{" "}
                      <strong>
                        {resource.career}
                      </strong>
                    </div>
                  )}


                  <p className="resource-description">
                    {resource.description ||
                      "No description available."}
                  </p>


                  <div className="resource-card-footer">

                    <div className="resource-duration">
                      <Clock3 size={14} />

                      {resource.estimatedMinutes ||
                        "—"}{" "}
                      minutes
                    </div>


                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-button"
                    >
                      Open resource
                      <ExternalLink size={14} />
                    </a>

                  </div>

                </article>
              )
            )}

          </div>
        )}


        {/* ====================================
            FOOTER NOTE
        ==================================== */}

        {filteredResources.length > 0 && (
          <div className="learning-footer-note">
            Learning resources and external links
            may change over time. Verify the
            resource before starting.
          </div>
        )}

      </div>
    </div>
  );
};

export default LearningHub;