import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Route,
} from "lucide-react";

import api from "../services/api";
import "./AdminCareers.css";

const initialForm = {
  name: "",
  category: "",
  description: "",
  requiredSkills: "",
  roadmap: "",
  difficulty: "Intermediate",
};

function AdminCareers() {
  const [careers, setCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedCareer, setExpandedCareer] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingCareer, setEditingCareer] =
    useState(null);

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  // ==========================================
  // Fetch Careers
  // ==========================================

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/admin/careers");

      setCareers(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch careers:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load careers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Form
  // ==========================================

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddModal = () => {
    setEditingCareer(null);
    setForm(initialForm);
    setShowModal(true);
    setError("");
    setSuccessMessage("");
  };

  const openEditModal = (career) => {
    setEditingCareer(career);

    setForm({
      name: career.name || "",
      category: career.category || "",
      description: career.description || "",
      requiredSkills:
        career.requiredSkills?.join(", ") || "",
      roadmap:
        career.roadmap?.join("\n") || "",
      difficulty:
        career.difficulty || "Intermediate",
    });

    setShowModal(true);
    setError("");
    setSuccessMessage("");
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCareer(null);
    setForm(initialForm);
  };

  // ==========================================
  // Create / Update
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Career name, category and description are required."
      );
      return;
    }

    const requiredSkills =
      form.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    const roadmap =
      form.roadmap
        .split("\n")
        .map((step) => step.trim())
        .filter(Boolean);

    const data = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      requiredSkills,
      roadmap,
      difficulty: form.difficulty,
    };

    try {
      setSaving(true);

      if (editingCareer) {
        const response = await api.put(
          `/admin/careers/${editingCareer._id}`,
          data
        );

        setCareers((previous) =>
          previous.map((career) =>
            career._id === editingCareer._id
              ? response.data.career
              : career
          )
        );

        setSuccessMessage(
          "Career updated successfully."
        );
      } else {
        const response = await api.post(
          "/admin/careers",
          data
        );

        setCareers((previous) => [
          response.data.career,
          ...previous,
        ]);

        setSuccessMessage(
          "Career created successfully."
        );
      }

      setShowModal(false);
      setEditingCareer(null);
      setForm(initialForm);
    } catch (error) {
      console.error(
        "Failed to save career:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save career."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete
  // ==========================================

  const handleDelete = async (career) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${career.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(career._id);
      setError("");
      setSuccessMessage("");

      await api.delete(
        `/admin/careers/${career._id}`
      );

      setCareers((previous) =>
        previous.filter(
          (item) => item._id !== career._id
        )
      );

      if (expandedCareer === career._id) {
        setExpandedCareer(null);
      }

      setSuccessMessage(
        "Career deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete career:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete career."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================
  // Toggle
  // ==========================================

  const toggleCareer = (id) => {
    setExpandedCareer((previous) =>
      previous === id ? null : id
    );
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredCareers = careers.filter(
    (career) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) return true;

      return (
        career.name
          ?.toLowerCase()
          .includes(search) ||
        career.category
          ?.toLowerCase()
          .includes(search) ||
        career.description
          ?.toLowerCase()
          .includes(search) ||
        career.requiredSkills?.some(
          (skill) =>
            skill
              .toLowerCase()
              .includes(search)
        )
      );
    }
  );

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="admin-careers-page">
        <div className="careers-loading-header">
          <div>
            <div className="career-skeleton eyebrow" />
            <div className="career-skeleton title" />
            <div className="career-skeleton subtitle" />
          </div>

          <div className="career-skeleton add-button" />
        </div>

        <div className="career-skeleton search-bar" />

        <div className="careers-grid">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                className="career-loading-card"
                key={index}
              >
                <div className="career-loading-top">
                  <div className="career-skeleton career-icon" />

                  <div className="career-loading-info">
                    <div className="career-skeleton career-name" />
                    <div className="career-skeleton career-category" />
                  </div>
                </div>

                <div className="career-skeleton description-line" />
                <div className="career-skeleton description-line short" />

                <div className="career-skeleton difficulty-line" />
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-careers-page">

      {/* ======================================
          Header
      ====================================== */}

      <section className="careers-page-header">
        <div>
          <div className="careers-eyebrow">
            <BriefcaseBusiness size={14} />
            CAREER MANAGEMENT
          </div>

          <h1>Manage Careers</h1>

          <p>
            View and manage career profiles,
            required skills and learning roadmaps.
          </p>
        </div>

        <div className="careers-header-actions">
          <div className="careers-count">
            <BriefcaseBusiness size={17} />

            <div>
              <strong>{careers.length}</strong>
              <span>Total Careers</span>
            </div>
          </div>

          <button
            className="add-career-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Career
          </button>
        </div>
      </section>

      {/* ======================================
          Success
      ====================================== */}

      {successMessage && (
        <div className="career-alert success">
          <CheckCircle2 size={17} />

          <span>{successMessage}</span>

          <button
            onClick={() =>
              setSuccessMessage("")
            }
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ======================================
          Error
      ====================================== */}

      {error && (
        <div className="career-alert error">
          <AlertCircle size={17} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ======================================
          Search
      ====================================== */}

      <section className="career-search-panel">
        <div className="career-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by career, category or skill..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {searchTerm && (
            <button
              className="clear-career-search"
              onClick={() =>
                setSearchTerm("")
              }
            >
              ×
            </button>
          )}
        </div>

        <span className="career-result-count">
          Showing{" "}
          <strong>
            {filteredCareers.length}
          </strong>{" "}
          of{" "}
          <strong>
            {careers.length}
          </strong>
        </span>
      </section>

      {/* ======================================
          Empty
      ====================================== */}

      {filteredCareers.length === 0 && (
        <div className="careers-empty">
          <div className="careers-empty-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <h2>No careers found</h2>

          <p>
            {careers.length === 0
              ? "No career profiles have been added yet."
              : "Try a different search term."}
          </p>

          {searchTerm && (
            <button
              onClick={() =>
                setSearchTerm("")
              }
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* ======================================
          Career Cards
      ====================================== */}

      {filteredCareers.length > 0 && (
        <section className="careers-grid">
          {filteredCareers.map((career) => {
            const isExpanded =
              expandedCareer === career._id;

            const isDeleting =
              deleteLoading === career._id;

            return (
              <article
                className="career-card"
                key={career._id}
              >

                {/* Card Header */}

                <div className="career-card-header">
                  <div className="career-heading">
                    <div className="career-card-icon">
                      <BriefcaseBusiness size={20} />
                    </div>

                    <div className="career-title-area">
                      <h2>{career.name}</h2>

                      <span className="career-category">
                        {career.category}
                      </span>
                    </div>
                  </div>

                  <div className="career-actions">
                    <button
                      className="career-action edit"
                      onClick={() =>
                        openEditModal(career)
                      }
                      title="Edit career"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="career-action delete"
                      onClick={() =>
                        handleDelete(career)
                      }
                      disabled={isDeleting}
                      title="Delete career"
                    >
                      {isDeleting ? (
                        <RefreshCw
                          size={15}
                          className="career-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>

                    <button
                      className="career-action expand"
                      onClick={() =>
                        toggleCareer(
                          career._id
                        )
                      }
                      title={
                        isExpanded
                          ? "Collapse"
                          : "Expand"
                      }
                    >
                      {isExpanded ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Description */}

                <p className="career-description">
                  {career.description}
                </p>

                {/* Difficulty */}

                <div className="career-meta">
                  <span>Difficulty</span>

                  <span className="difficulty-badge">
                    {career.difficulty ||
                      "Intermediate"}
                  </span>
                </div>

                {/* Expanded */}

                {isExpanded && (
                  <div className="career-expanded">

                    <div className="career-expanded-section">
                      <div className="expanded-heading">
                        <BriefcaseBusiness
                          size={15}
                        />

                        <h3>
                          Required Skills
                        </h3>
                      </div>

                      {career.requiredSkills
                        ?.length > 0 ? (
                        <div className="career-skills">
                          {career.requiredSkills.map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={`${skill}-${index}`}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="career-no-data">
                          No skills listed.
                        </p>
                      )}
                    </div>

                    <div className="career-expanded-section">
                      <div className="expanded-heading">
                        <Route size={15} />

                        <h3>
                          Learning Roadmap
                        </h3>
                      </div>

                      {career.roadmap
                        ?.length > 0 ? (
                        <ol className="career-roadmap">
                          {career.roadmap.map(
                            (
                              step,
                              index
                            ) => (
                              <li
                                key={`${step}-${index}`}
                              >
                                <span className="roadmap-number">
                                  {index + 1}
                                </span>

                                <span>
                                  {step}
                                </span>
                              </li>
                            )
                          )}
                        </ol>
                      ) : (
                        <p className="career-no-data">
                          No roadmap available.
                        </p>
                      )}
                    </div>

                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {/* ======================================
          Modal
      ====================================== */}

      {showModal && (
        <div
          className="career-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              closeModal();
            }
          }}
        >
          <div className="career-modal">

            {/* Modal Header */}

            <div className="career-modal-header">
              <div>
                <div className="modal-eyebrow">
                  {editingCareer
                    ? "CAREER EDITOR"
                    : "NEW CAREER"}
                </div>

                <h2>
                  {editingCareer
                    ? "Edit Career"
                    : "Add New Career"}
                </h2>

                <p>
                  {editingCareer
                    ? "Update the career information."
                    : "Create a new career profile for students."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}

            <form
              className="career-form"
              onSubmit={handleSubmit}
            >

              <div className="form-field">
                <label>
                  Career Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Cloud Engineer"
                />
              </div>

              <div className="form-field">
                <label>
                  Category *
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Cloud Computing"
                />
              </div>

              <div className="form-field">
                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this career..."
                  rows={4}
                />
              </div>

              <div className="form-field">
                <label>
                  Required Skills
                </label>

                <input
                  name="requiredSkills"
                  value={
                    form.requiredSkills
                  }
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, MongoDB"
                />

                <small>
                  Separate skills with commas.
                </small>
              </div>

              <div className="form-field">
                <label>
                  Roadmap
                </label>

                <textarea
                  name="roadmap"
                  value={form.roadmap}
                  onChange={handleChange}
                  placeholder={
                    "Programming Fundamentals\nData Structures\nProblem Solving\nAdvanced Development"
                  }
                  rows={6}
                />

                <small>
                  Write each roadmap step on
                  a new line.
                </small>
              </div>

              <div className="form-field">
                <label>
                  Difficulty
                </label>

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

              {/* Modal Actions */}

              <div className="career-modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="career-spin"
                      />
                      Saving...
                    </>
                  ) : editingCareer ? (
                    <>
                      <CheckCircle2 size={15} />
                      Update Career
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      Create Career
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

export default AdminCareers;