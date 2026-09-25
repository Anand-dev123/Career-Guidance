import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";

import api from "../services/api";
import "./AdminQuestions.css";

// ======================================================
// INITIAL FORM
// ======================================================

const initialForm = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  skill: "",
  career: "",
  difficulty: "Easy",
  marks: 1,
};

// ======================================================
// ADMIN QUESTIONS
// ======================================================

function AdminQuestions() {
  const [questions, setQuestions] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [skillFilter, setSkillFilter] = useState("");

  const [careerFilter, setCareerFilter] = useState("");

  const [difficultyFilter, setDifficultyFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingQuestion, setEditingQuestion] =
    useState(null);

  const [expandedQuestion, setExpandedQuestion] =
    useState(null);

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  // ====================================================
  // FETCH QUESTIONS
  // ====================================================

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/questions"
      );

      setQuestions(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch questions:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UNIQUE FILTER VALUES
  // ====================================================

  const skills = useMemo(() => {
    return [
      ...new Set(
        questions
          .map((item) => item.skill)
          .filter(Boolean)
      ),
    ].sort();
  }, [questions]);

  const careers = useMemo(() => {
    return [
      ...new Set(
        questions
          .map((item) => item.career)
          .filter(Boolean)
      ),
    ].sort();
  }, [questions]);

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ====================================================
  // OPTION CHANGE
  // ====================================================

  const handleOptionChange = (index, value) => {
    setForm((previous) => {
      const options = [...previous.options];

      options[index] = value;

      return {
        ...previous,
        options,
      };
    });
  };

  // ====================================================
  // ADD OPTION
  // ====================================================

  const addOption = () => {
    if (form.options.length >= 6) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      options: [
        ...previous.options,
        "",
      ],
    }));
  };

  // ====================================================
  // REMOVE OPTION
  // ====================================================

  const removeOption = (index) => {
    if (form.options.length <= 2) {
      return;
    }

    const removedOption =
      form.options[index];

    setForm((previous) => ({
      ...previous,

      options: previous.options.filter(
        (_, optionIndex) =>
          optionIndex !== index
      ),

      correctAnswer:
        previous.correctAnswer ===
        removedOption
          ? ""
          : previous.correctAnswer,
    }));
  };

  // ====================================================
  // OPEN ADD MODAL
  // ====================================================

  const openAddModal = () => {
    setEditingQuestion(null);

    setForm({
      ...initialForm,
      options: ["", "", "", ""],
    });

    setShowModal(true);

    setError("");
    setSuccessMessage("");
  };

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  const openEditModal = (question) => {
    setEditingQuestion(question);

    setForm({
      question:
        question.question || "",

      options:
        question.options?.length >= 2
          ? [...question.options]
          : ["", "", "", ""],

      correctAnswer:
        question.correctAnswer || "",

      skill:
        question.skill || "",

      career:
        question.career || "",

      difficulty:
        question.difficulty || "Easy",

      marks:
        question.marks || 1,
    });

    setShowModal(true);

    setError("");
    setSuccessMessage("");
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingQuestion(null);

    setForm({
      ...initialForm,
      options: ["", "", "", ""],
    });

    setError("");
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    const cleanOptions =
      form.options
        .map((item) => item.trim())
        .filter(Boolean);

    if (!form.question.trim()) {
      setError(
        "Question text is required."
      );
      return;
    }

    if (cleanOptions.length < 2) {
      setError(
        "At least 2 options are required."
      );
      return;
    }

    if (!form.correctAnswer) {
      setError(
        "Please select the correct answer."
      );
      return;
    }

    if (
      !cleanOptions.includes(
        form.correctAnswer
      )
    ) {
      setError(
        "Correct answer must be one of the options."
      );
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

    const data = {
      question:
        form.question.trim(),

      options: cleanOptions,

      correctAnswer:
        form.correctAnswer,

      skill:
        form.skill.trim(),

      career:
        form.career.trim(),

      difficulty:
        form.difficulty,

      marks:
        Number(form.marks) || 1,
    };

    try {
      setSaving(true);

      // ==================================================
      // UPDATE
      // ==================================================

      if (editingQuestion) {
        const response =
          await api.put(
            `/admin/questions/${editingQuestion._id}`,
            data
          );

        setQuestions((previous) =>
          previous.map((item) =>
            item._id ===
            editingQuestion._id
              ? response.data.question
              : item
          )
        );

        setSuccessMessage(
          "Question updated successfully."
        );
      }

      // ==================================================
      // CREATE
      // ==================================================

      else {
        const response =
          await api.post(
            "/admin/questions",
            data
          );

        setQuestions((previous) => [
          response.data.question,
          ...previous,
        ]);

        setSuccessMessage(
          "Question created successfully."
        );
      }

      setShowModal(false);

      setEditingQuestion(null);

      setForm({
        ...initialForm,
        options: ["", "", "", ""],
      });
    } catch (error) {
      console.error(
        "Failed to save question:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save question."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async (question) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete this question?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(question._id);

      setError("");
      setSuccessMessage("");

      await api.delete(
        `/admin/questions/${question._id}`
      );

      setQuestions((previous) =>
        previous.filter(
          (item) =>
            item._id !== question._id
        )
      );

      if (
        expandedQuestion ===
        question._id
      ) {
        setExpandedQuestion(null);
      }

      setSuccessMessage(
        "Question deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete question:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete question."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ====================================================
  // FILTER QUESTIONS
  // ====================================================

  const filteredQuestions = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    return questions.filter((item) => {
      const matchesSearch =
        !search ||
        item.question
          ?.toLowerCase()
          .includes(search) ||
        item.skill
          ?.toLowerCase()
          .includes(search) ||
        item.career
          ?.toLowerCase()
          .includes(search) ||
        item.options?.some((option) =>
          option
            .toLowerCase()
            .includes(search)
        );

      const matchesSkill =
        !skillFilter ||
        item.skill === skillFilter;

      const matchesCareer =
        !careerFilter ||
        item.career === careerFilter;

      const matchesDifficulty =
        !difficultyFilter ||
        item.difficulty ===
          difficultyFilter;

      return (
        matchesSearch &&
        matchesSkill &&
        matchesCareer &&
        matchesDifficulty
      );
    });
  }, [
    questions,
    searchTerm,
    skillFilter,
    careerFilter,
    difficultyFilter,
  ]);

  // ====================================================
  // TOGGLE
  // ====================================================

  const toggleQuestion = (id) => {
    setExpandedQuestion((previous) =>
      previous === id ? null : id
    );
  };

  // ====================================================
  // DIFFICULTY CLASS
  // ====================================================

  const getDifficultyClass = (
    difficulty
  ) => {
    switch (difficulty) {
      case "Hard":
        return "question-difficulty-hard";

      case "Medium":
        return "question-difficulty-medium";

      default:
        return "question-difficulty-easy";
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="admin-questions-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="questions-page-header">

        <div className="questions-header-content">

          <div className="questions-eyebrow">
            <ClipboardList size={16} />
            <span>QUESTION MANAGEMENT</span>
          </div>

          <h1>Manage Questions</h1>

          <p>
            Manage assessment questions,
            answers and difficulty levels.
          </p>

        </div>

        <div className="questions-header-actions">

          <div className="questions-count-card">

            <div className="questions-count-icon">
              <ClipboardList size={19} />
            </div>

            <div>
              <strong>
                {questions.length}
              </strong>

              <span>
                Total Questions
              </span>
            </div>

          </div>

          <button
            className="question-primary-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Question
          </button>

        </div>

      </section>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (
        <div className="question-status success">

          <CheckCircle2 size={18} />

          <span>
            {successMessage}
          </span>

          <button
            onClick={() =>
              setSuccessMessage("")
            }
            aria-label="Close success message"
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && !showModal && (
        <div className="question-status error">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError("")
            }
            aria-label="Close error message"
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* =================================================
          FILTER PANEL
      ================================================= */}

      <section className="questions-filter-panel">

        <div className="question-search-wrapper">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search by question, skill, career or option..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          {searchTerm && (
            <button
              className="clear-filter-button"
              onClick={() =>
                setSearchTerm("")
              }
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

        </div>

        <div className="question-select-wrapper">

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

            {skills.map((skill) => (
              <option
                key={skill}
                value={skill}
              >
                {skill}
              </option>
            ))}
          </select>

        </div>

        <div className="question-select-wrapper">

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

        <div className="question-select-wrapper">

          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All Difficulty
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>
          </select>

        </div>

        <div className="question-filter-meta">

          <SlidersHorizontal size={16} />

          <span>
            Showing{" "}
            <strong>
              {filteredQuestions.length}
            </strong>{" "}
            of{" "}
            <strong>
              {questions.length}
            </strong>
          </span>

        </div>

      </section>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="questions-list">

          {[1, 2, 3, 4].map((item) => (
            <div
              className="question-skeleton"
              key={item}
            >

              <div className="skeleton-number" />

              <div className="skeleton-question-content">

                <div className="skeleton-question-line large" />

                <div className="skeleton-question-line medium" />

                <div className="skeleton-question-tags" />

              </div>

              <div className="skeleton-actions" />

            </div>
          ))}

        </div>
      )}

      {/* =================================================
          ERROR STATE
      ================================================= */}

      {!loading &&
        error &&
        questions.length === 0 && (

          <div className="questions-empty-state">

            <div className="questions-empty-icon error">
              <AlertCircle size={28} />
            </div>

            <h3>
              Unable to load questions
            </h3>

            <p>
              {error}
            </p>

            <button
              className="question-secondary-button"
              onClick={fetchQuestions}
            >
              Try Again
            </button>

          </div>
        )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        filteredQuestions.length === 0 && (

          <div className="questions-empty-state">

            <div className="questions-empty-icon">
              <ClipboardList size={30} />
            </div>

            <h3>
              {searchTerm ||
              skillFilter ||
              careerFilter ||
              difficultyFilter
                ? "No matching questions"
                : "No questions available"}
            </h3>

            <p>
              {searchTerm ||
              skillFilter ||
              careerFilter ||
              difficultyFilter
                ? "Try changing your search or filters."
                : "Create your first assessment question to get started."}
            </p>

            {searchTerm ||
            skillFilter ||
            careerFilter ||
            difficultyFilter ? (
              <button
                className="question-secondary-button"
                onClick={() => {
                  setSearchTerm("");
                  setSkillFilter("");
                  setCareerFilter("");
                  setDifficultyFilter("");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                className="question-primary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Question
              </button>
            )}

          </div>
        )}

      {/* =================================================
          QUESTION LIST
      ================================================= */}

      {!loading &&
        filteredQuestions.length > 0 && (

          <div className="questions-list">

            {filteredQuestions.map(
              (item, index) => {

                const expanded =
                  expandedQuestion ===
                  item._id;

                const deleting =
                  deleteLoading ===
                  item._id;

                return (
                  <article
                    className={`question-card ${
                      expanded
                        ? "question-card-expanded"
                        : ""
                    }`}
                    key={item._id}
                  >

                    {/* CARD HEADER */}

                    <div className="question-card-header">

                      <div className="question-main">

                        <div className="question-number">
                          {index + 1}
                        </div>

                        <div className="question-content">

                          <h2>
                            {item.question}
                          </h2>

                          <div className="question-tags">

                            {item.skill && (
                              <span className="question-tag">
                                {item.skill}
                              </span>
                            )}

                            {item.career && (
                              <span className="question-tag">
                                {item.career}
                              </span>
                            )}

                            <span
                              className={`question-difficulty ${getDifficultyClass(
                                item.difficulty
                              )}`}
                            >
                              {item.difficulty}
                            </span>

                            <span className="question-marks">
                              {item.marks || 1}{" "}
                              {Number(item.marks) === 1
                                ? "Mark"
                                : "Marks"}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="question-actions">

                        <button
                          className="question-icon-button edit"
                          onClick={() =>
                            openEditModal(
                              item
                            )
                          }
                          title="Edit question"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="question-icon-button delete"
                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }
                          disabled={deleting}
                          title="Delete question"
                        >
                          {deleting ? (
                            <Loader2
                              size={17}
                              className="question-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>

                        <button
                          className="question-icon-button expand"
                          onClick={() =>
                            toggleQuestion(
                              item._id
                            )
                          }
                          title={
                            expanded
                              ? "Collapse"
                              : "View answers"
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

                    {/* EXPANDED ANSWERS */}

                    {expanded && (
                      <div className="question-expanded">

                        <div className="answers-header">

                          <div>
                            <h3>
                              Answer Options
                            </h3>

                            <p>
                              Correct answer is highlighted.
                            </p>
                          </div>

                        </div>

                        <div className="answers-grid">

                          {item.options?.map(
                            (
                              option,
                              optionIndex
                            ) => {

                              const isCorrect =
                                option ===
                                item.correctAnswer;

                              return (
                                <div
                                  className={`answer-option ${
                                    isCorrect
                                      ? "correct"
                                      : ""
                                  }`}
                                  key={`${item._id}-${optionIndex}`}
                                >

                                  <div className="answer-letter">
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                  </div>

                                  <span className="answer-text">
                                    {option}
                                  </span>

                                  {isCorrect && (
                                    <span className="correct-label">
                                      <Check
                                        size={14}
                                      />
                                      Correct
                                    </span>
                                  )}

                                </div>
                              );
                            }
                          )}

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
        <div className="question-modal-overlay">

          <div className="question-modal">

            {/* MODAL HEADER */}

            <div className="question-modal-header">

              <div>

                <div className="question-modal-eyebrow">
                  <ClipboardList size={15} />

                  <span>
                    {editingQuestion
                      ? "EDIT QUESTION"
                      : "NEW QUESTION"}
                  </span>
                </div>

                <h2>
                  {editingQuestion
                    ? "Edit Question"
                    : "Add New Question"}
                </h2>

                <p>
                  {editingQuestion
                    ? "Update the assessment question and its answer."
                    : "Create an assessment question with options and the correct answer."}
                </p>

              </div>

              <button
                className="question-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              className="question-form"
              onSubmit={handleSubmit}
            >

              {error && (
                <div className="question-modal-error">

                  <AlertCircle size={17} />

                  <span>
                    {error}
                  </span>

                </div>
              )}

              {/* QUESTION */}

              <div className="question-form-field">

                <label htmlFor="question-text">
                  Question{" "}
                  <span>*</span>
                </label>

                <textarea
                  id="question-text"
                  name="question"
                  value={
                    form.question
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter the assessment question..."
                  rows={4}
                />

              </div>

              {/* OPTIONS */}

              <div className="options-heading">

                <div>

                  <label>
                    Answer Options{" "}
                    <span>*</span>
                  </label>

                  <p>
                    Add between 2 and 6 options.
                  </p>

                </div>

                <button
                  type="button"
                  className="add-option-button"
                  onClick={addOption}
                  disabled={
                    form.options.length >= 6
                  }
                >
                  <Plus size={15} />
                  Add Option
                </button>

              </div>

              <div className="form-options-list">

                {form.options.map(
                  (option, index) => (
                    <div
                      className="form-option-row"
                      key={index}
                    >

                      <div className="form-option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </div>

                      <input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )}`}
                        autoComplete="off"
                      />

                      {form.options.length >
                        2 && (
                        <button
                          type="button"
                          className="remove-option-button"
                          onClick={() =>
                            removeOption(
                              index
                            )
                          }
                          title="Remove option"
                        >
                          <X size={16} />
                        </button>
                      )}

                    </div>
                  )
                )}

              </div>

              {/* CORRECT ANSWER */}

              <div className="question-form-field">

                <label htmlFor="correct-answer">
                  Correct Answer{" "}
                  <span>*</span>
                </label>

                <select
                  id="correct-answer"
                  name="correctAnswer"
                  value={
                    form.correctAnswer
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="">
                    Select correct answer
                  </option>

                  {form.options
                    .filter(Boolean)
                    .map(
                      (
                        option,
                        index
                      ) => (
                        <option
                          key={`${option}-${index}`}
                          value={option}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                          . {option}
                        </option>
                      )
                    )}

                </select>

              </div>

              {/* SKILL + CAREER */}

              <div className="question-form-grid">

                <div className="question-form-field">

                  <label htmlFor="question-skill">
                    Skill{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="question-skill"
                    name="skill"
                    value={
                      form.skill
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Java"
                    autoComplete="off"
                  />

                </div>

                <div className="question-form-field">

                  <label htmlFor="question-career">
                    Career{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="question-career"
                    name="career"
                    value={
                      form.career
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Software Developer"
                    autoComplete="off"
                  />

                </div>

              </div>

              {/* DIFFICULTY + MARKS */}

              <div className="question-form-grid">

                <div className="question-form-field">

                  <label htmlFor="question-difficulty">
                    Difficulty
                  </label>

                  <select
                    id="question-difficulty"
                    name="difficulty"
                    value={
                      form.difficulty
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="Easy">
                      Easy
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Hard">
                      Hard
                    </option>

                  </select>

                </div>

                <div className="question-form-field">

                  <label htmlFor="question-marks">
                    Marks
                  </label>

                  <input
                    id="question-marks"
                    type="number"
                    name="marks"
                    min="1"
                    value={
                      form.marks
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="question-form-actions">

                <button
                  type="button"
                  className="question-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="question-submit-button"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="question-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingQuestion ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingQuestion
                        ? "Update Question"
                        : "Create Question"}
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

export default AdminQuestions;