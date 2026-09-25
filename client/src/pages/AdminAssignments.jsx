import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock3,
  ExternalLink,
  X,
  ClipboardList,
  BookOpen,
  Layers3,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import api from "../services/api";
import "./AdminAssignments.css";

const initialForm = {
  title: "",
  description: "",
  career: "",
  skill: "",
  difficulty: "Beginner",
  estimatedTime: 30,
  resources: [""],
  order: 1,
};

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [careerFilter, setCareerFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [expandedId, setExpandedId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchCareers();
    fetchSkills();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/assignments");

      setAssignments(
        response.data.assignments || response.data || []
      );
    } catch (err) {
      console.error("Failed to fetch assignments:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async () => {
    try {
      const response = await api.get("/careers");

      setCareers(
        response.data.careers || response.data || []
      );
    } catch (err) {
      console.error("Failed to fetch careers:", err);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get("/admin/skills");

      setSkills(
        response.data.skills || response.data || []
      );
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        assignment.title?.toLowerCase().includes(search) ||
        assignment.description?.toLowerCase().includes(search) ||
        assignment.career?.toLowerCase().includes(search) ||
        assignment.skill?.toLowerCase().includes(search);

      const matchesCareer =
        !careerFilter ||
        assignment.career === careerFilter;

      const matchesSkill =
        !skillFilter ||
        assignment.skill === skillFilter;

      const matchesDifficulty =
        !difficultyFilter ||
        assignment.difficulty === difficultyFilter;

      return (
        matchesSearch &&
        matchesCareer &&
        matchesSkill &&
        matchesDifficulty
      );
    });
  }, [
    assignments,
    searchTerm,
    careerFilter,
    skillFilter,
    difficultyFilter,
  ]);

  const uniqueCareers = useMemo(
    () => [
      ...new Set(
        assignments
          .map((assignment) => assignment.career)
          .filter(Boolean)
      ),
    ],
    [assignments]
  );

  const uniqueSkills = useMemo(
    () => [
      ...new Set(
        assignments
          .map((assignment) => assignment.skill)
          .filter(Boolean)
      ),
    ],
    [assignments]
  );

  const beginnerCount = assignments.filter(
    (item) => item.difficulty === "Beginner"
  ).length;

  const intermediateCount = assignments.filter(
    (item) => item.difficulty === "Intermediate"
  ).length;

  const advancedCount = assignments.filter(
    (item) => item.difficulty === "Advanced"
  ).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResourceChange = (index, value) => {
    setForm((prev) => {
      const resources = [...prev.resources];
      resources[index] = value;

      return {
        ...prev,
        resources,
      };
    });
  };

  const addResourceField = () => {
    setForm((prev) => ({
      ...prev,
      resources: [...prev.resources, ""],
    }));
  };

  const removeResourceField = (index) => {
    setForm((prev) => {
      const resources = prev.resources.filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        resources: resources.length ? resources : [""],
      };
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      resources: [""],
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (assignment) => {
    setEditingId(assignment._id);

    setForm({
      title: assignment.title || "",
      description: assignment.description || "",
      career: assignment.career || "",
      skill: assignment.skill || "",
      difficulty: assignment.difficulty || "Beginner",
      estimatedTime: assignment.estimatedTime || 30,
      resources: assignment.resources?.length
        ? assignment.resources
        : [""],
      order: assignment.order || 1,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm({
      ...initialForm,
      resources: [""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Assignment title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Assignment description is required.");
      return;
    }

    if (!form.career.trim()) {
      setError("Career is required.");
      return;
    }

    if (!form.skill.trim()) {
      setError("Skill is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        career: form.career.trim(),
        skill: form.skill.trim(),
        difficulty: form.difficulty,
        estimatedTime: Number(form.estimatedTime) || 30,
        resources: form.resources
          .map((resource) => resource.trim())
          .filter(Boolean),
        order: Number(form.order) || 1,
      };

      if (editingId) {
        await api.put(
          `/admin/assignments/${editingId}`,
          payload
        );

        setSuccess("Assignment updated successfully.");
      } else {
        await api.post("/admin/assignments", payload);

        setSuccess("Assignment added successfully.");
      }

      await fetchAssignments();

      setShowModal(false);
      setEditingId(null);

      setForm({
        ...initialForm,
        resources: [""],
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/assignments/${id}`);

      setSuccess("Assignment deleted successfully.");
      setError("");

      if (expandedId === id) {
        setExpandedId(null);
      }

      await fetchAssignments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete assignment."
      );
    }
  };

  const getDifficultyClass = (difficulty) => {
    return difficulty?.toLowerCase() || "beginner";
  };

  return (
    <div className="admin-assignments-page">
      <div className="assignments-container">

        {/* Header */}
        <div className="assignments-header">
          <div className="assignments-heading">
            <div className="page-icon">
              <ClipboardList size={22} />
            </div>

            <div>
              <h1>Assignments</h1>
              <p>
                Manage practical tasks and learning activities
                for students.
              </p>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Assignment
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="alert success-alert">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && !showModal && (
          <div className="alert error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="assignment-stats">

          <div className="assignment-stat">
            <div className="stat-icon blue">
              <ClipboardList size={20} />
            </div>

            <div>
              <span>Total Assignments</span>
              <strong>{assignments.length}</strong>
            </div>
          </div>

          <div className="assignment-stat">
            <div className="stat-icon green">
              <BookOpen size={20} />
            </div>

            <div>
              <span>Beginner</span>
              <strong>{beginnerCount}</strong>
            </div>
          </div>

          <div className="assignment-stat">
            <div className="stat-icon amber">
              <Layers3 size={20} />
            </div>

            <div>
              <span>Intermediate</span>
              <strong>{intermediateCount}</strong>
            </div>
          </div>

          <div className="assignment-stat">
            <div className="stat-icon red">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Advanced</span>
              <strong>{advancedCount}</strong>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-panel">

          <div className="search-field">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={careerFilter}
            onChange={(e) =>
              setCareerFilter(e.target.value)
            }
          >
            <option value="">All Careers</option>

            {uniqueCareers.map((career) => (
              <option key={career} value={career}>
                {career}
              </option>
            ))}
          </select>

          <select
            value={skillFilter}
            onChange={(e) =>
              setSkillFilter(e.target.value)
            }
          >
            <option value="">All Skills</option>

            {uniqueSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value)
            }
          >
            <option value="">All Difficulties</option>

            {difficulties.map((difficulty) => (
              <option
                key={difficulty}
                value={difficulty}
              >
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Section */}
        <div className="assignment-section">

          <div className="section-header">
            <div>
              <h2>Assignment Library</h2>
              <span>
                {filteredAssignments.length} assignment
                {filteredAssignments.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="state-box">
              <Loader2
                size={28}
                className="loading-spinner"
              />
              <h3>Loading assignments</h3>
              <p>
                Please wait while the assignment library
                loads.
              </p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="state-box">
              <div className="empty-icon">
                <ClipboardList size={28} />
              </div>

              <h3>No assignments found</h3>

              <p>
                Try changing your filters or create a new
                assignment.
              </p>

              <button
                className="secondary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Assignment
              </button>
            </div>
          ) : (
            <div className="assignment-list">

              {filteredAssignments.map((assignment) => {
                const isExpanded =
                  expandedId === assignment._id;

                return (
                  <div
                    className="assignment-card"
                    key={assignment._id}
                  >
                    <div className="assignment-card-main">

                      <div className="assignment-content">

                        <div className="assignment-title-row">
                          <h3>{assignment.title}</h3>

                          <span
                            className={`difficulty-tag ${getDifficultyClass(
                              assignment.difficulty
                            )}`}
                          >
                            {assignment.difficulty}
                          </span>
                        </div>

                        <p className="assignment-description">
                          {assignment.description}
                        </p>

                        <div className="assignment-meta">

                          <span>
                            <strong>Career</strong>
                            {assignment.career}
                          </span>

                          <span>
                            <strong>Skill</strong>
                            {assignment.skill}
                          </span>

                          <span>
                            <strong>Time</strong>
                            {assignment.estimatedTime} min
                          </span>

                          <span>
                            <strong>Order</strong>
                            {assignment.order}
                          </span>
                        </div>
                      </div>

                      <div className="assignment-actions">

                        <button
                          className="action-button"
                          title="Edit assignment"
                          onClick={() =>
                            openEditModal(assignment)
                          }
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          className="action-button danger"
                          title="Delete assignment"
                          onClick={() =>
                            handleDelete(assignment._id)
                          }
                        >
                          <Trash2 size={17} />
                        </button>

                        <button
                          className="action-button"
                          title={
                            isExpanded
                              ? "Hide details"
                              : "View details"
                          }
                          onClick={() =>
                            setExpandedId(
                              isExpanded
                                ? null
                                : assignment._id
                            )
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="assignment-details">

                        <div className="detail-block">
                          <h4>Description</h4>

                          <p>
                            {assignment.description}
                          </p>
                        </div>

                        <div className="detail-block">
                          <h4>Learning Resources</h4>

                          {assignment.resources?.length ? (
                            <div className="resource-list">
                              {assignment.resources.map(
                                (resource, index) => (
                                  <a
                                    key={index}
                                    href={resource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span>
                                      Resource {index + 1}
                                    </span>

                                    <ExternalLink
                                      size={14}
                                    />
                                  </a>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="muted-text">
                              No resources added.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="assignment-modal">

            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  Assignment Management
                </span>

                <h2>
                  {editingId
                    ? "Edit Assignment"
                    : "Add Assignment"}
                </h2>

                <p>
                  Create a practical learning task for
                  students.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="alert error-alert modal-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form
              className="assignment-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">
                <label>Assignment Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Build a JavaScript To-Do App"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Describe what the student needs to complete..."
                  rows={4}
                />
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>Career *</label>

                  <input
                    type="text"
                    name="career"
                    value={form.career}
                    onChange={handleInputChange}
                    placeholder="e.g. Full Stack Developer"
                    list="assignment-careers"
                  />

                  <datalist id="assignment-careers">
                    {careers.map((career) => (
                      <option
                        key={career._id}
                        value={career.name}
                      />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label>Skill *</label>

                  <input
                    type="text"
                    name="skill"
                    value={form.skill}
                    onChange={handleInputChange}
                    placeholder="e.g. JavaScript"
                    list="assignment-skills"
                  />

                  <datalist id="assignment-skills">
                    {skills.map((skill) => (
                      <option
                        key={skill._id}
                        value={skill.name}
                      />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>Difficulty</label>

                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleInputChange}
                  >
                    {difficulties.map((difficulty) => (
                      <option
                        key={difficulty}
                        value={difficulty}
                      >
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Time (minutes)</label>

                  <input
                    type="number"
                    name="estimatedTime"
                    min="1"
                    value={form.estimatedTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Learning Order</label>

                <input
                  type="number"
                  name="order"
                  min="1"
                  value={form.order}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">

                <div className="resource-header">
                  <label>Learning Resource Links</label>

                  <button
                    type="button"
                    className="add-resource-button"
                    onClick={addResourceField}
                  >
                    <Plus size={15} />
                    Add Link
                  </button>
                </div>

                {form.resources.map(
                  (resource, index) => (
                    <div
                      className="resource-row"
                      key={index}
                    >
                      <input
                        type="url"
                        value={resource}
                        onChange={(e) =>
                          handleResourceChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                      />

                      {form.resources.length > 1 && (
                        <button
                          type="button"
                          className="remove-resource-button"
                          onClick={() =>
                            removeResourceField(index)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="loading-spinner"
                      />
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <CheckCircle2 size={17} />
                      Update Assignment
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Assignment
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
};

export default AdminAssignments;