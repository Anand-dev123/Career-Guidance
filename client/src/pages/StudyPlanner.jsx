import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Plus,
  Target,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./StudyPlanner.css";

// ==========================================
// Get Today's Date
// ==========================================

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ==========================================
// Format Date
// ==========================================

function formatDisplayDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ==========================================
// Study Planner
// ==========================================

function StudyPlanner() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [studyPlans, setStudyPlans] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [addingRecommendation, setAddingRecommendation] =
    useState(null);

  const [selectedDate, setSelectedDate] =
    useState(getTodayDate());

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    title: "",
    description: "",
    skill: "",
    duration: 60,
  });

  // ==========================================
  // Fetch User + Study Plans
  // ==========================================

  useEffect(() => {
    const fetchStudyPlannerData = async () => {
      try {
        setLoading(true);

        const [profileResponse, plansResponse] =
          await Promise.all([
            api.get("/users/profile"),
            api.get("/study-plans"),
          ]);

        const profile = profileResponse.data;

        setUser(profile);
        setStudyPlans(plansResponse.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch study planner data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudyPlannerData();
  }, []);

  // ==========================================
  // Fetch Personalized Recommendations
  // ==========================================

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setRecommendationLoading(true);

        const response = await api.get(
          "/study-plans/recommendations"
        );

        setRecommendations(response.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch study recommendations:",
          error
        );

        setRecommendations([]);
      } finally {
        setRecommendationLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // ==========================================
  // Filter Plans By Selected Date
  // ==========================================

  const selectedDatePlans = useMemo(() => {
    return studyPlans.filter((plan) => {
      const planDate = new Date(plan.date);

      const year = planDate.getFullYear();

      const month = String(
        planDate.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        planDate.getDate()
      ).padStart(2, "0");

      const formattedDate =
        `${year}-${month}-${day}`;

      return formattedDate === selectedDate;
    });
  }, [studyPlans, selectedDate]);

  // ==========================================
  // Daily Statistics
  // ==========================================

  const completedPlans =
    selectedDatePlans.filter(
      (plan) => plan.completed
    ).length;

  const totalPlans =
    selectedDatePlans.length;

  const totalMinutes =
    selectedDatePlans.reduce(
      (total, plan) =>
        total + Number(plan.duration || 0),
      0
    );

  const completedMinutes =
    selectedDatePlans
      .filter((plan) => plan.completed)
      .reduce(
        (total, plan) =>
          total + Number(plan.duration || 0),
        0
      );

  const dailyProgress =
    totalPlans > 0
      ? Math.round(
          (completedPlans / totalPlans) * 100
        )
      : 0;

  // ==========================================
  // Form Change
  // ==========================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Create Manual Study Plan
  // ==========================================

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/study-plans",
        {
          date: formData.date,
          title: formData.title.trim(),
          description:
            formData.description.trim(),
          skill: formData.skill.trim(),
          duration:
            Number(formData.duration) || 60,
        }
      );

      const newPlan =
        response.data.studyPlan;

      setStudyPlans((prev) =>
        [...prev, newPlan].sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
      );

      setSelectedDate(formData.date);

      setFormData({
        date: formData.date,
        title: "",
        description: "",
        skill: "",
        duration: 60,
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create study plan:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Add Recommendation To Plan
  // ==========================================

  const addRecommendation = async (
    recommendation
  ) => {
    try {
      setAddingRecommendation(
        recommendation.title
      );

      const recommendationSkills =
        recommendation.skills?.length > 0
          ? recommendation.skills.join(", ")
          : recommendation.skill || "";

      const response = await api.post(
        "/study-plans",
        {
          date: selectedDate,
          title: recommendation.title,
          description:
            recommendation.description || "",
          skill: recommendationSkills,
          duration: 60,
        }
      );

      const newPlan =
        response.data.studyPlan;

      setStudyPlans((prev) =>
        [...prev, newPlan].sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
      );

      setRecommendations((prev) =>
        prev.filter(
          (item) =>
            !(
              item.title ===
                recommendation.title &&
              item.skill ===
                recommendation.skill
            )
        )
      );
    } catch (error) {
      console.error(
        "Failed to add recommended task:",
        error
      );
    } finally {
      setAddingRecommendation(null);
    }
  };

  // ==========================================
  // Toggle Completion
  // ==========================================

  const toggleCompletion = async (plan) => {
    try {
      const response = await api.put(
        `/study-plans/${plan._id}`,
        {
          completed: !plan.completed,
        }
      );

      const updatedPlan =
        response.data.studyPlan;

      setStudyPlans((prev) =>
        prev.map((item) =>
          item._id === updatedPlan._id
            ? updatedPlan
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to update study plan:",
        error
      );
    }
  };

  // ==========================================
  // Delete Study Plan
  // ==========================================

  const deleteStudyPlan = async (id) => {
    try {
      await api.delete(
        `/study-plans/${id}`
      );

      setStudyPlans((prev) =>
        prev.filter(
          (plan) => plan._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete study plan:",
        error
      );
    }
  };

  // ==========================================
  // Date Change
  // ==========================================

  const handleDateChange = (e) => {
    const date = e.target.value;

    setSelectedDate(date);

    setFormData((prev) => ({
      ...prev,
      date,
    }));
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="planner-content">
            <div className="planner-skeleton-header">
              <div className="planner-skeleton skeleton-title" />
              <div className="planner-skeleton skeleton-text" />
            </div>

            <div className="planner-skeleton-grid">
              <div className="planner-skeleton skeleton-box" />
              <div className="planner-skeleton skeleton-box" />
              <div className="planner-skeleton skeleton-box" />
            </div>

            <div className="planner-skeleton skeleton-large" />
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

        <main className="planner-content">

          {/* ======================================
              Header
          ====================================== */}

          <section className="planner-header">
            <div className="planner-header-text">
              <div className="planner-eyebrow">
                <CalendarDays size={15} />
                DAILY LEARNING
              </div>

              <h1>Study Planner</h1>

              <p>
                Plan your daily learning tasks
                and stay consistent with your
                career goals.
              </p>
            </div>

            <button
              className="planner-add-btn"
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              {showForm ? (
                <>
                  <X size={17} />
                  Close
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Study Task
                </>
              )}
            </button>
          </section>

          {/* ======================================
              Career Target
          ====================================== */}

          <section className="planner-career-card">
            <div className="planner-career-icon">
              <Target size={20} />
            </div>

            <div className="planner-career-content">
              <span>Target Career</span>

              <h2>
                {user?.targetCareer ||
                  "Not selected"}
              </h2>
            </div>

            {!user?.targetCareer && (
              <button
                className="planner-career-action"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Select Career
                <ArrowRight size={16} />
              </button>
            )}
          </section>

          {/* ======================================
              Recommendations
          ====================================== */}

          <section className="recommended-study-section">
            <div className="recommended-study-header">
              <div>
                <div className="planner-section-eyebrow">
                  <Lightbulb size={15} />
                  PERSONALIZED
                </div>

                <h2>Recommended For You</h2>

                <p>
                  Study tasks suggested from
                  your current skill gaps and
                  career roadmap.
                </p>
              </div>

              <span className="recommended-badge">
                Personalized
              </span>
            </div>

            {recommendationLoading ? (
              <div className="planner-inline-loading">
                <span className="planner-spinner" />
                Analyzing your skill gaps...
              </div>
            ) : recommendations.length === 0 ? (
              <div className="planner-recommendation-empty">
                <BookOpen size={22} />

                <p>
                  {user?.targetCareer
                    ? "No personalized study recommendations are available right now. Complete or update your assessment to get new suggestions."
                    : "Select a target career and complete your assessment to get personalized study recommendations."}
                </p>
              </div>
            ) : (
              <div className="recommended-study-list">
                {recommendations.map(
                  (recommendation, index) => {
                    const recommendationSkills =
                      recommendation.skills?.length > 0
                        ? recommendation.skills.join(
                            ", "
                          )
                        : recommendation.skill ||
                          "General";

                    const isAdding =
                      addingRecommendation ===
                      recommendation.title;

                    return (
                      <article
                        className="recommended-study-card"
                        key={`${recommendation.title}-${index}`}
                      >
                        <div className="recommendation-number">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="recommended-study-content">
                          <span className="recommended-priority">
                            Priority {index + 1}
                          </span>

                          <h3>
                            {recommendation.title}
                          </h3>

                          <p>
                            {
                              recommendation.description
                            }
                          </p>

                          <div className="recommended-meta">
                            <span>
                              Skills
                              <strong>
                                {recommendationSkills}
                              </strong>
                            </span>

                            <span>
                              Current
                              <strong>
                                {
                                  recommendation.currentPercentage
                                }
                                %
                              </strong>
                            </span>

                            <span>
                              Level
                              <strong>
                                {recommendation.difficulty ||
                                  "Beginner"}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <button
                          className="recommended-add-btn"
                          onClick={() =>
                            addRecommendation(
                              recommendation
                            )
                          }
                          disabled={isAdding}
                        >
                          {isAdding ? (
                            <>
                              <span className="button-spinner" />
                              Adding...
                            </>
                          ) : (
                            <>
                              Add to Plan
                              <Plus size={15} />
                            </>
                          )}
                        </button>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* ======================================
              Add Study Task Form
          ====================================== */}

          {showForm && (
            <form
              className="planner-form"
              onSubmit={handleCreatePlan}
            >
              <div className="planner-form-header">
                <div>
                  <span className="planner-section-eyebrow">
                    NEW TASK
                  </span>

                  <h2>Create Study Task</h2>

                  <p>
                    Add a task to your personal
                    study schedule.
                  </p>
                </div>
              </div>

              <div className="planner-form-grid">
                <div className="planner-field">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="planner-field">
                  <label>Skill / Topic</label>

                  <input
                    type="text"
                    name="skill"
                    placeholder="e.g. JavaScript"
                    value={formData.skill}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="planner-field planner-field-full">
                  <label>Task Title</label>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Practice JavaScript Arrays"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="planner-field planner-field-full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    placeholder="Describe what you want to complete..."
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                  />
                </div>

                <div className="planner-field">
                  <label>Duration (minutes)</label>

                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={formData.duration}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="planner-form-actions">
                <button
                  type="button"
                  className="planner-cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="planner-submit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Create Task
                      <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ======================================
              Date Selector
          ====================================== */}

          <section className="planner-date-card">
            <div className="planner-date-info">
              <div className="planner-date-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <span>Select Date</span>

                <h2>
                  {formatDisplayDate(
                    selectedDate
                  )}
                </h2>
              </div>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </section>

          {/* ======================================
              Daily Summary
          ====================================== */}

          <section className="planner-summary-grid">
            <div className="planner-summary-card">
              <span>Tasks</span>
              <strong>{totalPlans}</strong>
              <small>Planned today</small>
            </div>

            <div className="planner-summary-card">
              <span>Completed</span>
              <strong>{completedPlans}</strong>
              <small>
                {totalPlans > 0
                  ? `${dailyProgress}% complete`
                  : "No tasks yet"}
              </small>
            </div>

            <div className="planner-summary-card">
              <span>Planned Time</span>
              <strong>{totalMinutes}</strong>
              <small>Minutes planned</small>
            </div>

            <div className="planner-summary-card">
              <span>Completed Time</span>
              <strong>{completedMinutes}</strong>
              <small>Minutes completed</small>
            </div>
          </section>

          {/* ======================================
              Daily Progress
          ====================================== */}

          <section className="planner-progress-section">
            <div className="planner-progress-header">
              <div>
                <span className="planner-section-eyebrow">
                  DAILY PROGRESS
                </span>

                <h2>
                  {dailyProgress === 100 &&
                  totalPlans > 0
                    ? "All tasks completed"
                    : "Keep making progress"}
                </h2>

                <p>
                  {completedPlans} of{" "}
                  {totalPlans} tasks completed
                  for this date.
                </p>
              </div>

              <strong>{dailyProgress}%</strong>
            </div>

            <div className="planner-progress-bar">
              <div
                className="planner-progress-fill"
                style={{
                  width: `${dailyProgress}%`,
                }}
              />
            </div>
          </section>

          {/* ======================================
              Study Tasks
          ====================================== */}

          <section className="planner-tasks-section">
            <div className="planner-section-header">
              <div>
                <span className="planner-section-eyebrow">
                  SCHEDULE
                </span>

                <h2>Study Tasks</h2>

                <p>
                  Tasks planned for{" "}
                  {formatDisplayDate(
                    selectedDate
                  )}
                  .
                </p>
              </div>

              <span className="task-count-badge">
                {selectedDatePlans.length}{" "}
                {selectedDatePlans.length === 1
                  ? "Task"
                  : "Tasks"}
              </span>
            </div>

            {selectedDatePlans.length === 0 ? (
              <div className="planner-empty">
                <div className="planner-empty-icon">
                  <BookOpen size={25} />
                </div>

                <h3>
                  No study tasks planned
                </h3>

                <p>
                  Add a study task for this
                  date to start building your
                  schedule.
                </p>

                <button
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  <Plus size={16} />
                  Add Study Task
                </button>
              </div>
            ) : (
              <div className="planner-task-list">
                {selectedDatePlans.map(
                  (plan, index) => (
                    <article
                      className={`planner-task-card ${
                        plan.completed
                          ? "completed"
                          : ""
                      }`}
                      key={plan._id}
                    >
                      <div
                        className={`planner-task-number ${
                          plan.completed
                            ? "completed-number"
                            : ""
                        }`}
                      >
                        {plan.completed ? (
                          <Check size={16} />
                        ) : (
                          String(index + 1).padStart(
                            2,
                            "0"
                          )
                        )}
                      </div>

                      <div className="planner-task-content">
                        <div className="planner-task-top">
                          <div>
                            <h3>
                              {plan.title}
                            </h3>

                            {plan.skill && (
                              <span className="planner-skill-tag">
                                {plan.skill}
                              </span>
                            )}
                          </div>

                          <div className="planner-duration">
                            <Clock3 size={14} />
                            {plan.duration} min
                          </div>
                        </div>

                        {plan.description && (
                          <p>
                            {plan.description}
                          </p>
                        )}

                        <div className="planner-task-footer">
                          <div
                            className={
                              plan.completed
                                ? "planner-status completed-status"
                                : "planner-status"
                            }
                          >
                            {plan.completed ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <Clock3 size={15} />
                            )}

                            {plan.completed
                              ? "Completed"
                              : "Pending"}
                          </div>

                          <div className="planner-task-actions">
                            <button
                              className={
                                plan.completed
                                  ? "planner-complete-btn completed-btn"
                                  : "planner-complete-btn"
                              }
                              onClick={() =>
                                toggleCompletion(
                                  plan
                                )
                              }
                            >
                              {plan.completed ? (
                                <>
                                  <Check size={15} />
                                  Completed
                                </>
                              ) : (
                                <>
                                  Mark Complete
                                  <ArrowRight
                                    size={15}
                                  />
                                </>
                              )}
                            </button>

                            <button
                              className="planner-delete-btn"
                              onClick={() =>
                                deleteStudyPlan(
                                  plan._id
                                )
                              }
                              aria-label="Delete study task"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default StudyPlanner;