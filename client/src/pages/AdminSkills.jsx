import { useEffect, useMemo, useState } from "react";

import {
  Brain,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Layers3,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BookOpen,
} from "lucide-react";

import api from "../services/api";
import "./AdminSkills.css";

const initialForm = {
  name: "",
  category: "",
  difficulty: "Beginner",
  prerequisites: "",
  relatedSkills: "",
};

function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [expandedSkill, setExpandedSkill] = useState(null);

  const [form, setForm] = useState(initialForm);

  // ======================================================
  // FETCH
  // ======================================================

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/skills");

      setSkills(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

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

  const openAddModal = () => {
    setEditingSkill(null);
    setForm(initialForm);

    setError("");
    setSuccessMessage("");

    setShowModal(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      difficulty:
        skill.difficulty || "Beginner",
      prerequisites:
        Array.isArray(skill.prerequisites)
          ? skill.prerequisites.join(", ")
          : "",
      relatedSkills:
        Array.isArray(skill.relatedSkills)
          ? skill.relatedSkills.join(", ")
          : "",
    });

    setError("");
    setSuccessMessage("");

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingSkill(null);
    setForm(initialForm);
    setError("");
  };

  // ======================================================
  // CREATE / UPDATE
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!form.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Skill category is required.");
      return;
    }

    const prerequisites = form.prerequisites
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const relatedSkills = form.relatedSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const data = {
      name: form.name.trim(),
      category: form.category.trim(),
      difficulty: form.difficulty,
      prerequisites,
      relatedSkills,
    };

    try {
      setSaving(true);

      if (editingSkill) {
        const response = await api.put(
          `/admin/skills/${editingSkill._id}`,
          data
        );

        const updatedSkill =
          response.data?.skill ||
          response.data;

        setSkills((previous) =>
          previous.map((skill) =>
            skill._id === editingSkill._id
              ? updatedSkill
              : skill
          )
        );

        setSuccessMessage(
          "Skill updated successfully."
        );
      } else {
        const response = await api.post(
          "/admin/skills",
          data
        );

        const newSkill =
          response.data?.skill ||
          response.data;

        setSkills((previous) => [
          newSkill,
          ...previous,
        ]);

        setSuccessMessage(
          "Skill created successfully."
        );
      }

      setShowModal(false);
      setEditingSkill(null);
      setForm(initialForm);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (skill) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(skill._id);

      setError("");
      setSuccessMessage("");

      await api.delete(
        `/admin/skills/${skill._id}`
      );

      setSkills((previous) =>
        previous.filter(
          (item) => item._id !== skill._id
        )
      );

      if (expandedSkill === skill._id) {
        setExpandedSkill(null);
      }

      setSuccessMessage(
        "Skill deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete skill."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredSkills = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return skills;
    }

    return skills.filter((skill) => {
      const name =
        skill.name?.toLowerCase() || "";

      const category =
        skill.category?.toLowerCase() || "";

      const difficulty =
        skill.difficulty?.toLowerCase() || "";

      const prerequisites =
        Array.isArray(skill.prerequisites)
          ? skill.prerequisites
              .join(" ")
              .toLowerCase()
          : "";

      const relatedSkills =
        Array.isArray(skill.relatedSkills)
          ? skill.relatedSkills
              .join(" ")
              .toLowerCase()
          : "";

      return (
        name.includes(search) ||
        category.includes(search) ||
        difficulty.includes(search) ||
        prerequisites.includes(search) ||
        relatedSkills.includes(search)
      );
    });
  }, [skills, searchTerm]);

  // ======================================================
  // DIFFICULTY
  // ======================================================

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Advanced") {
      return "difficulty-advanced";
    }

    if (difficulty === "Intermediate") {
      return "difficulty-intermediate";
    }

    return "difficulty-beginner";
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="admin-skills-page">

      {/* HEADER */}

      <section className="skills-page-header">

        <div>
          <div className="skills-eyebrow">
            <Brain size={16} />
            <span>SKILL MANAGEMENT</span>
          </div>

          <h1>Manage Skills</h1>

          <p>
            Manage skills used across
            assessments, recommendations
            and learning paths.
          </p>
        </div>

        <div className="skills-header-actions">

          <div className="skills-count-card">

            <div className="skills-count-icon">
              <Layers3 size={19} />
            </div>

            <div>
              <strong>{skills.length}</strong>
              <span>Total Skills</span>
            </div>

          </div>

          <button
            className="primary-action-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Skill
          </button>

        </div>

      </section>


      {/* SUCCESS */}

      {successMessage && (
        <div className="status-message success-message">

          <CheckCircle2 size={18} />

          <span>{successMessage}</span>

          <button
            onClick={() =>
              setSuccessMessage("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}


      {/* ERROR */}

      {error && !showModal && (
        <div className="status-message error-message">

          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>

        </div>
      )}


      {/* SEARCH */}

      <section className="skills-search-panel">

        <div className="skills-search-box">

          <Search size={19} />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search by skill, category, difficulty or related skill..."
          />

          {searchTerm && (
            <button
              className="clear-search-button"
              onClick={() =>
                setSearchTerm("")
              }
            >
              <X size={16} />
            </button>
          )}

        </div>

        <div className="skills-search-meta">

          <SlidersHorizontal size={16} />

          <span>
            Showing{" "}
            <strong>
              {filteredSkills.length}
            </strong>{" "}
            of{" "}
            <strong>
              {skills.length}
            </strong>
          </span>

        </div>

      </section>


      {/* LOADING */}

      {loading && (
        <div className="skills-table">

          {[1, 2, 3, 4, 5].map((item) => (
            <div
              className="skill-skeleton-row"
              key={item}
            >
              <div className="skeleton skeleton-small" />
              <div className="skeleton skeleton-name" />
              <div className="skeleton skeleton-category" />
              <div className="skeleton skeleton-difficulty" />
            </div>
          ))}

        </div>
      )}


      {/* ERROR */}

      {!loading &&
        error &&
        skills.length === 0 && (
          <div className="skills-empty-state">

            <div className="empty-state-icon error-icon">
              <AlertCircle size={28} />
            </div>

            <h3>
              Unable to load skills
            </h3>

            <p>{error}</p>

            <button
              className="secondary-action-button"
              onClick={fetchSkills}
            >
              Try Again
            </button>

          </div>
        )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredSkills.length === 0 && (
          <div className="skills-empty-state">

            <div className="empty-state-icon">
              <Brain size={30} />
            </div>

            <h3>
              {searchTerm
                ? "No matching skills"
                : "No skills available"}
            </h3>

            <p>
              {searchTerm
                ? "Try a different search term."
                : "Create your first skill to start building the skill library."}
            </p>

            <button
              className="primary-action-button"
              onClick={
                searchTerm
                  ? () => setSearchTerm("")
                  : openAddModal
              }
            >
              {searchTerm ? (
                <>
                  <X size={17} />
                  Clear Search
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Skill
                </>
              )}
            </button>

          </div>
        )}


      {/* ==================================================
          SKILL LIST
          ================================================== */}

      {!loading &&
        filteredSkills.length > 0 && (

          <div className="skills-table">

            {/* TABLE HEADER */}

            <div className="skills-table-header">

              <div>SKILL</div>
              <div>CATEGORY</div>
              <div>DIFFICULTY</div>
              <div>ACTIONS</div>

            </div>


            {/* ROWS */}

            {filteredSkills.map((skill) => {

              const isExpanded =
                expandedSkill === skill._id;

              const isDeleting =
                deleteLoading === skill._id;

              return (
                <div
                  className={`skill-row ${
                    isExpanded
                      ? "skill-row-expanded"
                      : ""
                  }`}
                  key={skill._id}
                >

                  {/* MAIN ROW */}

                  <div className="skill-row-main">

                    {/* SKILL */}

                    <div className="skill-name-cell">

                      <div className="skill-list-icon">
                        <Brain size={20} />
                      </div>

                      <div className="skill-name-content">

                        <strong title={skill.name}>
                          {skill.name}
                        </strong>

                        <span>
                          Skill
                        </span>

                      </div>

                    </div>


                    {/* CATEGORY */}

                    <div className="skill-category-cell">

                      <span
                        className="category-badge"
                        title={skill.category}
                      >
                        {skill.category}
                      </span>

                    </div>


                    {/* DIFFICULTY */}

                    <div className="skill-difficulty-cell">

                      <span
                        className={`difficulty-badge ${getDifficultyClass(
                          skill.difficulty
                        )}`}
                      >
                        {skill.difficulty ||
                          "Beginner"}
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="skill-actions-cell">

                      <button
                        className="row-action edit-action"
                        onClick={() =>
                          openEditModal(skill)
                        }
                        title="Edit skill"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="row-action delete-action"
                        onClick={() =>
                          handleDelete(skill)
                        }
                        disabled={isDeleting}
                        title="Delete skill"
                      >
                        {isDeleting ? (
                          <Loader2
                            size={16}
                            className="spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>

                      <button
                        className="row-action expand-action"
                        onClick={() =>
                          setExpandedSkill(
                            isExpanded
                              ? null
                              : skill._id
                          )
                        }
                        title={
                          isExpanded
                            ? "Hide details"
                            : "View details"
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


                  {/* EXPANDED */}

                  {isExpanded && (
                    <div className="skill-details">

                      <div className="detail-box">

                        <div className="detail-title">
                          <BookOpen size={15} />
                          Prerequisites
                        </div>

                        {Array.isArray(
                          skill.prerequisites
                        ) &&
                        skill.prerequisites.length > 0 ? (
                          <div className="detail-tags">

                            {skill.prerequisites.map(
                              (item, index) => (
                                <span
                                  key={`${item}-${index}`}
                                >
                                  {item}
                                </span>
                              )
                            )}

                          </div>
                        ) : (
                          <p>
                            No prerequisites defined.
                          </p>
                        )}

                      </div>


                      <div className="detail-box">

                        <div className="detail-title">
                          <Layers3 size={15} />
                          Related Skills
                        </div>

                        {Array.isArray(
                          skill.relatedSkills
                        ) &&
                        skill.relatedSkills.length > 0 ? (
                          <div className="detail-tags">

                            {skill.relatedSkills.map(
                              (item, index) => (
                                <span
                                  key={`${item}-${index}`}
                                >
                                  {item}
                                </span>
                              )
                            )}

                          </div>
                        ) : (
                          <p>
                            No related skills defined.
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


      {/* ==================================================
          MODAL
          ================================================== */}

      {showModal && (
        <div className="skill-modal-overlay">

          <div className="skill-modal">

            <div className="skill-modal-header">

              <div>

                <div className="modal-eyebrow">
                  <Brain size={15} />

                  <span>
                    {editingSkill
                      ? "EDIT SKILL"
                      : "NEW SKILL"}
                  </span>
                </div>

                <h2>
                  {editingSkill
                    ? "Edit Skill"
                    : "Add New Skill"}
                </h2>

                <p>
                  {editingSkill
                    ? "Update the skill information."
                    : "Create a new skill for the platform."}
                </p>

              </div>

              <button
                className="modal-close-button"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>


            <form
              className="skill-form"
              onSubmit={handleSubmit}
            >

              {error && (
                <div className="modal-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}


              <div className="form-field">

                <label>
                  Skill Name <span>*</span>
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. React"
                />

              </div>


              <div className="form-field">

                <label>
                  Category <span>*</span>
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Development"
                />

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


              <div className="form-field">

                <label>
                  Prerequisites
                </label>

                <input
                  name="prerequisites"
                  value={form.prerequisites}
                  onChange={handleChange}
                  placeholder="HTML, CSS, JavaScript"
                />

                <small>
                  Separate multiple skills
                  with commas.
                </small>

              </div>


              <div className="form-field">

                <label>
                  Related Skills
                </label>

                <input
                  name="relatedSkills"
                  value={form.relatedSkills}
                  onChange={handleChange}
                  placeholder="Vue.js, Angular, Next.js"
                />

                <small>
                  Separate multiple skills
                  with commas.
                </small>

              </div>


              <div className="skill-form-actions">

                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit-button"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingSkill ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingSkill
                        ? "Update Skill"
                        : "Create Skill"}
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

export default AdminSkills;