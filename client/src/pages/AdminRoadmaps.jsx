import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Map,
  Clock3,
  Layers3,
  ListOrdered,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Filter,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";
import "./AdminRoadmaps.css";

const initialForm = {
  career: "",
  title: "",
  description: "",
  skills: "",
  prerequisites: "",
  difficulty: "Beginner",
  estimatedWeeks: 1,
  resources: "",
  order: 1,
};

function AdminRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [careerFilter, setCareerFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [expandedRoadmap, setExpandedRoadmap] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ======================================================
  // FETCH
  // ======================================================

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/roadmaps");

      setRoadmaps(response.data);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load roadmaps."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UNIQUE CAREERS
  // ======================================================

  const careers = useMemo(() => {
    return [
      ...new Set(
        roadmaps
          .map((item) => item.career)
          .filter(Boolean)
      ),
    ].sort();
  }, [roadmaps]);

  // ======================================================
  // FORM
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
    });
  };

  // ======================================================
  // ADD
  // ======================================================

  const openAddModal = () => {
    setEditingRoadmap(null);
    resetForm();

    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  // ======================================================
  // EDIT
  // ======================================================

  const openEditModal = (roadmap) => {
    setEditingRoadmap(roadmap);

    setForm({
      career: roadmap.career || "",
      title: roadmap.title || "",
      description: roadmap.description || "",
      skills: roadmap.skills?.join(", ") || "",
      prerequisites:
        roadmap.prerequisites?.join(", ") || "",
      difficulty: roadmap.difficulty || "Beginner",
      estimatedWeeks: roadmap.estimatedWeeks || 1,
      resources:
        roadmap.resources?.join("\n") || "",
      order: roadmap.order || 1,
    });

    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingRoadmap(null);
    resetForm();
    setError("");
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !form.career.trim() ||
      !form.title.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Career, title and description are required."
      );
      return;
    }

    const skills = form.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const prerequisites = form.prerequisites
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const resources = form.resources
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const data = {
      career: form.career.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      skills,
      prerequisites,
      difficulty: form.difficulty,
      estimatedWeeks:
        Number(form.estimatedWeeks) || 1,
      resources,
      order: Number(form.order) || 1,
    };

    try {
      setSaving(true);

      if (editingRoadmap) {
        const response = await api.put(
          `/admin/roadmaps/${editingRoadmap._id}`,
          data
        );

        setRoadmaps((previous) =>
          previous.map((item) =>
            item._id === editingRoadmap._id
              ? response.data.roadmap
              : item
          )
        );

        setSuccessMessage(
          "Roadmap updated successfully."
        );
      } else {
        const response = await api.post(
          "/admin/roadmaps",
          data
        );

        setRoadmaps((previous) => [
          response.data.roadmap,
          ...previous,
        ]);

        setSuccessMessage(
          "Roadmap created successfully."
        );
      }

      setShowModal(false);
      setEditingRoadmap(null);
      resetForm();
    } catch (error) {
      console.error(
        "Failed to save roadmap:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save roadmap."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (roadmap) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${roadmap.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(roadmap._id);
      setError("");
      setSuccessMessage("");

      await api.delete(
        `/admin/roadmaps/${roadmap._id}`
      );

      setRoadmaps((previous) =>
        previous.filter(
          (item) => item._id !== roadmap._id
        )
      );

      if (expandedRoadmap === roadmap._id) {
        setExpandedRoadmap(null);
      }

      setSuccessMessage(
        "Roadmap deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete roadmap:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete roadmap."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ======================================================
  // FILTER
  // ======================================================

  const filteredRoadmaps = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return roadmaps.filter((item) => {
      const matchesSearch =
        !search ||
        item.title
          ?.toLowerCase()
          .includes(search) ||
        item.career
          ?.toLowerCase()
          .includes(search) ||
        item.description
          ?.toLowerCase()
          .includes(search) ||
        item.skills?.some((skill) =>
          skill.toLowerCase().includes(search)
        ) ||
        item.prerequisites?.some((item) =>
          item.toLowerCase().includes(search)
        );

      const matchesCareer =
        !careerFilter ||
        item.career === careerFilter;

      const matchesDifficulty =
        !difficultyFilter ||
        item.difficulty === difficultyFilter;

      return (
        matchesSearch &&
        matchesCareer &&
        matchesDifficulty
      );
    });
  }, [
    roadmaps,
    searchTerm,
    careerFilter,
    difficultyFilter,
  ]);

  // ======================================================
  // TOGGLE
  // ======================================================

  const toggleRoadmap = (id) => {
    setExpandedRoadmap((previous) =>
      previous === id ? null : id
    );
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Advanced") {
      return "roadmap-difficulty advanced";
    }

    if (difficulty === "Intermediate") {
      return "roadmap-difficulty intermediate";
    }

    return "roadmap-difficulty beginner";
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="admin-roadmaps-page">
      {/* HEADER */}

      <section className="roadmaps-header">
        <div className="roadmaps-header-content">
          <div className="roadmaps-eyebrow">
            <Map size={16} />
            <span>ROADMAP MANAGEMENT</span>
          </div>

          <h1>Manage Roadmaps</h1>

          <p>
            Create and manage personalized career
            learning roadmap steps.
          </p>
        </div>

        <div className="roadmaps-header-actions">
          <div className="roadmaps-count-card">
            <div className="roadmaps-count-icon">
              <Layers3 size={19} />
            </div>

            <div>
              <strong>{roadmaps.length}</strong>
              <span>Total Steps</span>
            </div>
          </div>

          <button
            className="roadmaps-primary-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Roadmap
          </button>
        </div>
      </section>

      {/* SUCCESS */}

      {successMessage && (
        <div className="roadmaps-status success">
          <CheckCircle2 size={18} />

          <span>{successMessage}</span>

          <button
            onClick={() => setSuccessMessage("")}
            aria-label="Close success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ERROR */}

      {error && !showModal && (
        <div className="roadmaps-status error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* FILTER PANEL */}

      <section className="roadmaps-filter-panel">
        <div className="roadmaps-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search by title, career, skill or description..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {searchTerm && (
            <button
              className="roadmaps-clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="roadmaps-filter">
          <Filter size={17} />

          <select
            value={careerFilter}
            onChange={(e) =>
              setCareerFilter(e.target.value)
            }
          >
            <option value="">All Careers</option>

            {careers.map((career) => (
              <option
                key={career}
                value={career}
              >
                {career}
              </option>
            ))}
          </select>
        </div>

        <div className="roadmaps-filter">
          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value)
            }
          >
            <option value="">
              All Difficulty
            </option>

            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>
          </select>
        </div>

        <div className="roadmaps-results">
          <span>Showing</span>

          <strong>
            {filteredRoadmaps.length}
          </strong>

          <span>of</span>

          <strong>{roadmaps.length}</strong>
        </div>
      </section>

      {/* LOADING */}

      {loading && (
        <div className="roadmaps-list">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="roadmap-skeleton"
              key={item}
            >
              <div className="skeleton roadmap-skeleton-icon" />

              <div className="roadmap-skeleton-content">
                <div className="skeleton roadmap-skeleton-title" />
                <div className="skeleton roadmap-skeleton-line" />
                <div className="skeleton roadmap-skeleton-line short" />
              </div>

              <div className="skeleton roadmap-skeleton-action" />
            </div>
          ))}
        </div>
      )}

      {/* ERROR EMPTY */}

      {!loading &&
        error &&
        roadmaps.length === 0 && (
          <div className="roadmaps-empty-state">
            <div className="roadmaps-empty-icon error">
              <AlertCircle size={28} />
            </div>

            <h3>Unable to load roadmaps</h3>

            <p>{error}</p>

            <button
              className="roadmaps-secondary-button"
              onClick={fetchRoadmaps}
            >
              Try Again
            </button>
          </div>
        )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredRoadmaps.length === 0 && (
          <div className="roadmaps-empty-state">
            <div className="roadmaps-empty-icon">
              <Map size={30} />
            </div>

            <h3>
              {searchTerm ||
              careerFilter ||
              difficultyFilter
                ? "No matching roadmaps"
                : "No roadmaps available"}
            </h3>

            <p>
              {searchTerm ||
              careerFilter ||
              difficultyFilter
                ? "Try changing your search or filters."
                : "Create your first roadmap step to build a career learning path."}
            </p>

            {searchTerm ||
            careerFilter ||
            difficultyFilter ? (
              <button
                className="roadmaps-secondary-button"
                onClick={() => {
                  setSearchTerm("");
                  setCareerFilter("");
                  setDifficultyFilter("");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                className="roadmaps-primary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Roadmap
              </button>
            )}
          </div>
        )}

      {/* ROADMAP LIST */}

      {!loading &&
        filteredRoadmaps.length > 0 && (
          <div className="roadmaps-list">
            {filteredRoadmaps.map((roadmap) => {
              const expanded =
                expandedRoadmap === roadmap._id;

              const deleting =
                deleteLoading === roadmap._id;

              return (
                <article
                  className={`roadmap-card ${
                    expanded ? "expanded" : ""
                  }`}
                  key={roadmap._id}
                >
                  {/* CARD TOP */}

                  <div className="roadmap-card-top">
                    <div className="roadmap-main">
                      <div className="roadmap-step-icon">
                        <Map size={22} />
                      </div>

                      <div className="roadmap-content">
                        <div className="roadmap-title-row">
                          <h2>{roadmap.title}</h2>

                          <span className="roadmap-order">
                            Step {roadmap.order}
                          </span>
                        </div>

                        <div className="roadmap-meta">
                          <span className="roadmap-career">
                            {roadmap.career}
                          </span>

                          <span
                            className={getDifficultyClass(
                              roadmap.difficulty
                            )}
                          >
                            {roadmap.difficulty}
                          </span>

                          <span className="roadmap-neutral-tag">
                            <Clock3 size={13} />
                            {roadmap.estimatedWeeks}{" "}
                            {roadmap.estimatedWeeks === 1
                              ? "week"
                              : "weeks"}
                          </span>
                        </div>

                        <p className="roadmap-description">
                          {roadmap.description}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="roadmap-actions">
                      <button
                        className="roadmap-icon-button edit"
                        onClick={() =>
                          openEditModal(roadmap)
                        }
                        title="Edit roadmap"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="roadmap-icon-button delete"
                        onClick={() =>
                          handleDelete(roadmap)
                        }
                        disabled={deleting}
                        title="Delete roadmap"
                      >
                        {deleting ? (
                          <Loader2
                            size={17}
                            className="roadmap-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>

                      <button
                        className="roadmap-icon-button expand"
                        onClick={() =>
                          toggleRoadmap(roadmap._id)
                        }
                        title={
                          expanded
                            ? "Collapse"
                            : "View details"
                        }
                      >
                        {expanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* QUICK SKILLS */}

                  {roadmap.skills?.length > 0 && (
                    <div className="roadmap-preview-skills">
                      <span className="preview-label">
                        Skills
                      </span>

                      <div className="preview-tags">
                        {roadmap.skills
                          .slice(0, 5)
                          .map((skill, index) => (
                            <span
                              className="preview-tag"
                              key={`${skill}-${index}`}
                            >
                              {skill}
                            </span>
                          ))}

                        {roadmap.skills.length > 5 && (
                          <span className="preview-more">
                            +{roadmap.skills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* EXPANDED DETAILS */}

                  {expanded && (
                    <div className="roadmap-details">
                      <div className="roadmap-detail-grid">
                        {/* SKILLS */}

                        <section className="roadmap-detail-section">
                          <div className="detail-heading">
                            <Layers3 size={16} />
                            <h3>Skills</h3>
                          </div>

                          {roadmap.skills?.length > 0 ? (
                            <div className="detail-tags">
                              {roadmap.skills.map(
                                (skill, index) => (
                                  <span
                                    className="detail-tag blue"
                                    key={`${skill}-${index}`}
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="detail-muted">
                              No skills added.
                            </p>
                          )}
                        </section>

                        {/* PREREQUISITES */}

                        <section className="roadmap-detail-section">
                          <div className="detail-heading">
                            <BookOpen size={16} />
                            <h3>Prerequisites</h3>
                          </div>

                          {roadmap.prerequisites?.length >
                          0 ? (
                            <div className="detail-tags">
                              {roadmap.prerequisites.map(
                                (item, index) => (
                                  <span
                                    className="detail-tag gray"
                                    key={`${item}-${index}`}
                                  >
                                    {item}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="detail-muted">
                              No prerequisites added.
                            </p>
                          )}
                        </section>
                      </div>

                      {/* RESOURCES */}

                      <section className="roadmap-resources">
                        <div className="detail-heading">
                          <BookOpen size={16} />
                          <h3>Resources</h3>
                        </div>

                        {roadmap.resources?.length > 0 ? (
                          <div className="resource-list">
                            {roadmap.resources.map(
                              (resource, index) => (
                                <div
                                  className="resource-item"
                                  key={`${resource}-${index}`}
                                >
                                  <span>
                                    {resource}
                                  </span>

                                  {/^https?:\/\//i.test(
                                    resource
                                  ) && (
                                    <a
                                      href={resource}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Open resource"
                                    >
                                      <ExternalLink
                                        size={15}
                                      />
                                    </a>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="detail-muted">
                            No resources added.
                          </p>
                        )}
                      </section>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      {/* MODAL */}

      {showModal && (
        <div
          className="roadmap-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="roadmap-modal">
            <div className="roadmap-modal-header">
              <div>
                <div className="modal-eyebrow">
                  <Map size={15} />
                  <span>
                    {editingRoadmap
                      ? "EDIT ROADMAP"
                      : "NEW ROADMAP"}
                  </span>
                </div>

                <h2>
                  {editingRoadmap
                    ? "Edit Roadmap"
                    : "Add New Roadmap"}
                </h2>

                <p>
                  Create a personalized career
                  learning step.
                </p>
              </div>

              <button
                className="roadmap-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="roadmap-modal-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            <form
              className="roadmap-form"
              onSubmit={handleSubmit}
            >
              {/* CAREER */}

              <div className="roadmap-form-field">
                <label>
                  Career <span>*</span>
                </label>

                <input
                  name="career"
                  value={form.career}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  autoComplete="off"
                />
              </div>

              {/* TITLE */}

              <div className="roadmap-form-field">
                <label>
                  Step Title <span>*</span>
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Learn JavaScript Fundamentals"
                  autoComplete="off"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="roadmap-form-field">
                <label>
                  Description <span>*</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what the student should learn..."
                  rows={4}
                />
              </div>

              {/* SKILLS */}

              <div className="roadmap-form-field">
                <label>Skills</label>

                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js"
                />

                <span className="roadmap-help">
                  Separate multiple skills with commas.
                </span>
              </div>

              {/* PREREQUISITES */}

              <div className="roadmap-form-field">
                <label>Prerequisites</label>

                <input
                  name="prerequisites"
                  value={form.prerequisites}
                  onChange={handleChange}
                  placeholder="HTML, CSS"
                />

                <span className="roadmap-help">
                  Separate prerequisites with commas.
                </span>
              </div>

              {/* DIFFICULTY / WEEKS */}

              <div className="roadmap-form-grid">
                <div className="roadmap-form-field">
                  <label>Difficulty</label>

                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                  >
                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>

                <div className="roadmap-form-field">
                  <label>Estimated Weeks</label>

                  <input
                    type="number"
                    name="estimatedWeeks"
                    min="1"
                    value={form.estimatedWeeks}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ORDER */}

              <div className="roadmap-form-field">
                <label>Step Order</label>

                <input
                  type="number"
                  name="order"
                  min="1"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>

              {/* RESOURCES */}

              <div className="roadmap-form-field">
                <label>Resources</label>

                <textarea
                  name="resources"
                  value={form.resources}
                  onChange={handleChange}
                  placeholder={
                    "https://example.com/resource1\nhttps://example.com/resource2"
                  }
                  rows={4}
                />

                <span className="roadmap-help">
                  Add one resource URL per line.
                </span>
              </div>

              {/* ACTIONS */}

              <div className="roadmap-form-actions">
                <button
                  type="button"
                  className="roadmap-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="roadmap-submit-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="roadmap-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingRoadmap ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingRoadmap
                        ? "Update Roadmap"
                        : "Create Roadmap"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRoadmaps;