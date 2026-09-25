import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  X,
  Video,
  FileText,
  GraduationCap,
  Code2,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock3,
  Layers3,
} from "lucide-react";

import api from "../services/api";
import "./AdminLearningResources.css";

// ======================================================
// INITIAL FORM
// ======================================================

const initialForm = {
  title: "",
  description: "",
  skill: "",
  career: "",
  type: "Article",
  url: "",
  difficulty: "Beginner",
  estimatedMinutes: 30,
  order: 1,
  isActive: true,
};

const resourceTypes = [
  "Video",
  "Article",
  "Course",
  "Documentation",
  "Practice",
  "Project",
];

const difficulties = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

// ======================================================
// ADMIN LEARNING RESOURCES
// ======================================================

function AdminLearningResources() {
  const [resources, setResources] = useState([]);
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [careerFilter, setCareerFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [expandedId, setExpandedId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  // ====================================================
  // FETCH
  // ====================================================

  useEffect(() => {
    fetchResources();
    fetchCareers();
    fetchSkills();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/learning-resources"
      );

      setResources(
        response.data.resources ||
          response.data ||
          []
      );
    } catch (err) {
      console.error(
        "Failed to load resources:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load learning resources."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async () => {
    try {
      const response = await api.get("/careers");

      setCareers(
        response.data.careers ||
          response.data ||
          []
      );
    } catch (err) {
      console.error(
        "Failed to load careers:",
        err
      );
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get(
        "/admin/skills"
      );

      setSkills(
        response.data.skills ||
          response.data ||
          []
      );
    } catch (err) {
      console.error(
        "Failed to load skills:",
        err
      );
    }
  };

  // ====================================================
  // FILTER VALUES
  // ====================================================

  const uniqueCareers = useMemo(() => {
    return [
      ...new Set(
        resources
          .map((resource) => resource.career)
          .filter(Boolean)
      ),
    ].sort();
  }, [resources]);

  const uniqueSkills = useMemo(() => {
    return [
      ...new Set(
        resources
          .map((resource) => resource.skill)
          .filter(Boolean)
      ),
    ].sort();
  }, [resources]);

  // ====================================================
  // FILTERED RESOURCES
  // ====================================================

  const filteredResources = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return resources.filter((resource) => {
      const matchesSearch =
        !search ||
        resource.title
          ?.toLowerCase()
          .includes(search) ||
        resource.description
          ?.toLowerCase()
          .includes(search) ||
        resource.skill
          ?.toLowerCase()
          .includes(search) ||
        resource.career
          ?.toLowerCase()
          .includes(search);

      const matchesCareer =
        !careerFilter ||
        resource.career === careerFilter;

      const matchesSkill =
        !skillFilter ||
        resource.skill === skillFilter;

      const matchesType =
        !typeFilter ||
        resource.type === typeFilter;

      return (
        matchesSearch &&
        matchesCareer &&
        matchesSkill &&
        matchesType
      );
    });
  }, [
    resources,
    searchTerm,
    careerFilter,
    skillFilter,
    typeFilter,
  ]);

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ====================================================
  // OPEN ADD
  // ====================================================

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      ...initialForm,
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ====================================================
  // OPEN EDIT
  // ====================================================

  const openEditModal = (resource) => {
    setEditingId(resource._id);

    setForm({
      title: resource.title || "",
      description:
        resource.description || "",
      skill: resource.skill || "",
      career: resource.career || "",
      type: resource.type || "Article",
      url: resource.url || "",
      difficulty:
        resource.difficulty || "Beginner",
      estimatedMinutes:
        resource.estimatedMinutes || 30,
      order: resource.order || 1,
      isActive:
        resource.isActive !== false,
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);

    setForm({
      ...initialForm,
    });

    setError("");
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.skill.trim()) {
      setError("Skill is required.");
      return;
    }

    if (!form.career.trim()) {
      setError("Career is required.");
      return;
    }

    if (!form.url.trim()) {
      setError("Resource URL is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,

        title: form.title.trim(),
        description:
          form.description.trim(),
        skill: form.skill.trim(),
        career: form.career.trim(),
        url: form.url.trim(),

        estimatedMinutes:
          Number(form.estimatedMinutes) || 30,

        order:
          Number(form.order) || 1,
      };

      if (editingId) {
        await api.put(
          `/admin/learning-resources/${editingId}`,
          payload
        );

        setSuccess(
          "Learning resource updated successfully."
        );
      } else {
        await api.post(
          "/admin/learning-resources",
          payload
        );

        setSuccess(
          "Learning resource added successfully."
        );
      }

      await fetchResources();

      setShowModal(false);
      setEditingId(null);

      setForm({
        ...initialForm,
      });
    } catch (err) {
      console.error(
        "Failed to save resource:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save learning resource."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async (resource) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(resource._id);

      setError("");
      setSuccess("");

      await api.delete(
        `/admin/learning-resources/${resource._id}`
      );

      if (expandedId === resource._id) {
        setExpandedId(null);
      }

      setSuccess(
        "Learning resource deleted successfully."
      );

      await fetchResources();
    } catch (err) {
      console.error(
        "Failed to delete resource:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete learning resource."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ====================================================
  // STATUS
  // ====================================================

  const toggleStatus = async (resource) => {
    try {
      setStatusLoading(resource._id);

      setError("");
      setSuccess("");

      await api.patch(
        `/admin/learning-resources/${resource._id}/status`,
        {
          isActive: !resource.isActive,
        }
      );

      setSuccess(
        `Resource ${
          !resource.isActive
            ? "activated"
            : "deactivated"
        } successfully.`
      );

      await fetchResources();
    } catch (err) {
      console.error(
        "Failed to update status:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update resource status."
      );
    } finally {
      setStatusLoading(null);
    }
  };

  // ====================================================
  // TYPE ICON
  // ====================================================

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return <Video size={19} />;

      case "Course":
        return <GraduationCap size={19} />;

      case "Documentation":
        return <FileText size={19} />;

      case "Practice":
        return <Code2 size={19} />;

      case "Project":
        return <FolderKanban size={19} />;

      default:
        return <BookOpen size={19} />;
    }
  };

  // ====================================================
  // DIFFICULTY CLASS
  // ====================================================

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Advanced") {
      return "resource-difficulty advanced";
    }

    if (difficulty === "Intermediate") {
      return "resource-difficulty intermediate";
    }

    return "resource-difficulty beginner";
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="admin-learning-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="learning-header">

        <div>
          <div className="learning-eyebrow">
            <BookOpen size={16} />
            <span>LEARNING MANAGEMENT</span>
          </div>

          <h1>
            Learning Resources
          </h1>

          <p>
            Manage learning content available
            to students across different
            careers and skills.
          </p>
        </div>

        <button
          className="learning-primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Resource
        </button>

      </section>


      {/* =================================================
          STATUS
      ================================================= */}

      {success && (
        <div className="learning-status success">

          <CheckCircle2 size={18} />

          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
          >
            <X size={16} />
          </button>

        </div>
      )}

      {error && !showModal && (
        <div className="learning-status error">

          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>

        </div>
      )}


      {/* =================================================
          STATS
      ================================================= */}

      <section className="learning-stats">

        <div className="learning-stat-card">

          <div className="learning-stat-icon blue">
            <Layers3 size={20} />
          </div>

          <div>
            <span>Total Resources</span>
            <strong>
              {resources.length}
            </strong>
          </div>

        </div>


        <div className="learning-stat-card">

          <div className="learning-stat-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>
              {
                resources.filter(
                  (resource) =>
                    resource.isActive
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="learning-stat-card">

          <div className="learning-stat-icon gray">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>
              {
                resources.filter(
                  (resource) =>
                    !resource.isActive
                ).length
              }
            </strong>
          </div>

        </div>

      </section>


      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="learning-filter-panel">

        <div className="learning-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search resources, skills or careers..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          {searchTerm && (
            <button
              onClick={() =>
                setSearchTerm("")
              }
            >
              <X size={16} />
            </button>
          )}

        </div>


        <select
          value={careerFilter}
          onChange={(e) =>
            setCareerFilter(
              e.target.value
            )
          }
        >
          <option value="">
            All Careers
          </option>

          {uniqueCareers.map(
            (career) => (
              <option
                key={career}
                value={career}
              >
                {career}
              </option>
            )
          )}

        </select>


        <select
          value={skillFilter}
          onChange={(e) =>
            setSkillFilter(
              e.target.value
            )
          }
        >
          <option value="">
            All Skills
          </option>

          {uniqueSkills.map(
            (skill) => (
              <option
                key={skill}
                value={skill}
              >
                {skill}
              </option>
            )
          )}

        </select>


        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(
              e.target.value
            )
          }
        >
          <option value="">
            All Types
          </option>

          {resourceTypes.map(
            (type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            )
          )}

        </select>

      </section>


      {/* =================================================
          RESULTS
      ================================================= */}

      <div className="learning-results-bar">

        <div>
          <strong>
            {filteredResources.length}
          </strong>{" "}
          resources found
        </div>

        {(searchTerm ||
          careerFilter ||
          skillFilter ||
          typeFilter) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCareerFilter("");
              setSkillFilter("");
              setTypeFilter("");
            }}
          >
            Clear filters
          </button>
        )}

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="learning-list">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                className="learning-skeleton"
                key={item}
              >

                <div className="skeleton learning-skeleton-icon" />

                <div className="learning-skeleton-content">

                  <div className="skeleton learning-skeleton-title" />

                  <div className="skeleton learning-skeleton-line" />

                  <div className="skeleton learning-skeleton-line short" />

                </div>

              </div>
            )
          )}

        </div>
      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        filteredResources.length === 0 && (
          <div className="learning-empty">

            <div className="learning-empty-icon">
              <BookOpen size={30} />
            </div>

            <h3>
              {searchTerm ||
              careerFilter ||
              skillFilter ||
              typeFilter
                ? "No matching resources"
                : "No learning resources"}
            </h3>

            <p>
              {searchTerm ||
              careerFilter ||
              skillFilter ||
              typeFilter
                ? "Try changing your search or filters."
                : "Create your first learning resource for students."}
            </p>

            {searchTerm ||
            careerFilter ||
            skillFilter ||
            typeFilter ? (
              <button
                className="learning-secondary-button"
                onClick={() => {
                  setSearchTerm("");
                  setCareerFilter("");
                  setSkillFilter("");
                  setTypeFilter("");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                className="learning-primary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Resource
              </button>
            )}

          </div>
        )}


      {/* =================================================
          RESOURCE LIST
      ================================================= */}

      {!loading &&
        filteredResources.length > 0 && (

          <div className="learning-list">

            {filteredResources.map(
              (resource) => {

                const expanded =
                  expandedId ===
                  resource._id;

                const deleting =
                  deleteLoading ===
                  resource._id;

                const statusUpdating =
                  statusLoading ===
                  resource._id;

                return (
                  <article
                    className={`learning-card ${
                      expanded
                        ? "expanded"
                        : ""
                    }`}
                    key={resource._id}
                  >

                    {/* CARD MAIN */}

                    <div className="learning-card-main">

                      <div className="learning-resource-icon">

                        {getTypeIcon(
                          resource.type
                        )}

                      </div>


                      <div className="learning-resource-content">

                        <div className="learning-title-row">

                          <h2>
                            {resource.title}
                          </h2>

                          <span
                            className={`learning-status-badge ${
                              resource.isActive
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {resource.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>


                        <p className="learning-description">
                          {resource.description ||
                            "No description available."}
                        </p>


                        <div className="learning-meta">

                          <span className="learning-career">
                            {resource.career}
                          </span>

                          <span>
                            {resource.skill}
                          </span>

                          <span>
                            {resource.type}
                          </span>

                          <span
                            className={getDifficultyClass(
                              resource.difficulty
                            )}
                          >
                            {
                              resource.difficulty
                            }
                          </span>

                          <span className="learning-time">
                            <Clock3 size={13} />
                            {
                              resource.estimatedMinutes
                            }{" "}
                            min
                          </span>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="learning-actions">

                        <button
                          className="learning-icon-button open"
                          title="Open resource"
                          onClick={() =>
                            window.open(
                              resource.url,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          <ExternalLink
                            size={17}
                          />
                        </button>


                        <button
                          className="learning-icon-button edit"
                          title="Edit resource"
                          onClick={() =>
                            openEditModal(
                              resource
                            )
                          }
                        >
                          <Pencil
                            size={17}
                          />
                        </button>


                        <button
                          className="learning-icon-button delete"
                          title="Delete resource"
                          disabled={
                            deleting
                          }
                          onClick={() =>
                            handleDelete(
                              resource
                            )
                          }
                        >
                          {deleting ? (
                            <Loader2
                              size={17}
                              className="learning-spin"
                            />
                          ) : (
                            <Trash2
                              size={17}
                            />
                          )}
                        </button>


                        <button
                          className={`learning-icon-button ${
                            resource.isActive
                              ? "status-active"
                              : "status-inactive"
                          }`}
                          title={
                            resource.isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                          disabled={
                            statusUpdating
                          }
                          onClick={() =>
                            toggleStatus(
                              resource
                            )
                          }
                        >
                          {statusUpdating ? (
                            <Loader2
                              size={17}
                              className="learning-spin"
                            />
                          ) : resource.isActive ? (
                            <CheckCircle2
                              size={17}
                            />
                          ) : (
                            <AlertCircle
                              size={17}
                            />
                          )}
                        </button>


                        <button
                          className="learning-icon-button expand"
                          title={
                            expanded
                              ? "Collapse"
                              : "View details"
                          }
                          onClick={() =>
                            setExpandedId(
                              expanded
                                ? null
                                : resource._id
                            )
                          }
                        >
                          {expanded ? (
                            <ChevronUp
                              size={18}
                            />
                          ) : (
                            <ChevronDown
                              size={18}
                            />
                          )}
                        </button>

                      </div>

                    </div>


                    {/* EXPANDED */}

                    {expanded && (
                      <div className="learning-details">

                        <div className="learning-detail-grid">

                          <div>
                            <span>
                              Description
                            </span>

                            <p>
                              {resource.description ||
                                "No description available."}
                            </p>
                          </div>


                          <div>
                            <span>
                              Resource URL
                            </span>

                            <a
                              href={
                                resource.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {resource.url}
                              <ExternalLink
                                size={14}
                              />
                            </a>
                          </div>


                          <div>
                            <span>
                              Order
                            </span>

                            <p>
                              {resource.order}
                            </p>
                          </div>


                          <div>
                            <span>
                              Estimated Time
                            </span>

                            <p>
                              {
                                resource.estimatedMinutes
                              }{" "}
                              minutes
                            </p>
                          </div>

                        </div>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}


      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (
        <div
          className="learning-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="learning-modal">

            <div className="learning-modal-header">

              <div>

                <div className="learning-modal-eyebrow">
                  <BookOpen size={15} />

                  <span>
                    {editingId
                      ? "EDIT RESOURCE"
                      : "NEW RESOURCE"}
                  </span>
                </div>

                <h2>
                  {editingId
                    ? "Edit Learning Resource"
                    : "Add Learning Resource"}
                </h2>

                <p>
                  Add useful learning content
                  for students.
                </p>

              </div>


              <button
                className="learning-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>


            {error && (
              <div className="learning-modal-error">

                <AlertCircle size={17} />

                <span>
                  {error}
                </span>

              </div>
            )}


            <form
              className="learning-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="learning-form-field">

                <label>
                  Title <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={
                    handleInputChange
                  }
                  placeholder="e.g. JavaScript Fundamentals"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="learning-form-field">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Short description of the resource"
                  rows={3}
                />

              </div>


              {/* SKILL / CAREER */}

              <div className="learning-form-grid">

                <div className="learning-form-field">

                  <label>
                    Skill <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="skill"
                    value={
                      form.skill
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. JavaScript"
                    list="admin-skills-list"
                  />

                  <datalist
                    id="admin-skills-list"
                  >
                    {skills.map(
                      (skill) => (
                        <option
                          key={
                            skill._id
                          }
                          value={
                            skill.name
                          }
                        />
                      )
                    )}
                  </datalist>

                </div>


                <div className="learning-form-field">

                  <label>
                    Career <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="career"
                    value={
                      form.career
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. Full Stack Developer"
                    list="admin-careers-list"
                  />

                  <datalist
                    id="admin-careers-list"
                  >
                    {careers.map(
                      (career) => (
                        <option
                          key={
                            career._id
                          }
                          value={
                            career.name
                          }
                        />
                      )
                    )}
                  </datalist>

                </div>

              </div>


              {/* TYPE / DIFFICULTY */}

              <div className="learning-form-grid">

                <div className="learning-form-field">

                  <label>
                    Type <span>*</span>
                  </label>

                  <select
                    name="type"
                    value={
                      form.type
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    {resourceTypes.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div className="learning-form-field">

                  <label>
                    Difficulty{" "}
                    <span>*</span>
                  </label>

                  <select
                    name="difficulty"
                    value={
                      form.difficulty
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    {difficulties.map(
                      (
                        difficulty
                      ) => (
                        <option
                          key={
                            difficulty
                          }
                          value={
                            difficulty
                          }
                        >
                          {difficulty}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>


              {/* URL */}

              <div className="learning-form-field">

                <label>
                  Resource URL{" "}
                  <span>*</span>
                </label>

                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={
                    handleInputChange
                  }
                  placeholder="https://..."
                />

              </div>


              {/* TIME / ORDER */}

              <div className="learning-form-grid">

                <div className="learning-form-field">

                  <label>
                    Estimated Time
                  </label>

                  <input
                    type="number"
                    name="estimatedMinutes"
                    min="1"
                    value={
                      form.estimatedMinutes
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  <span className="learning-field-help">
                    Time in minutes.
                  </span>

                </div>


                <div className="learning-form-field">

                  <label>
                    Order
                  </label>

                  <input
                    type="number"
                    name="order"
                    min="1"
                    value={form.order}
                    onChange={
                      handleInputChange
                    }
                  />

                  <span className="learning-field-help">
                    Display order.
                  </span>

                </div>

              </div>


              {/* ACTIVE */}

              <label className="learning-checkbox">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleInputChange
                  }
                />

                <span>
                  Make resource active
                </span>

              </label>


              {/* ACTIONS */}

              <div className="learning-modal-actions">

                <button
                  type="button"
                  className="learning-cancel-button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="learning-submit-button"
                  disabled={
                    saving
                  }
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="learning-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingId ? (
                        <Pencil
                          size={17}
                        />
                      ) : (
                        <Plus
                          size={17}
                        />
                      )}

                      {editingId
                        ? "Update Resource"
                        : "Add Resource"}
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

export default AdminLearningResources;