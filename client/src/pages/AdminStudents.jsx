import { useEffect, useState } from "react";
import {
  Users,
  Search,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  AlertCircle,
  RefreshCw,
  Building2,
} from "lucide-react";

import api from "../services/api";
import "./AdminStudents.css";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // Fetch Students
  // ==========================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch students:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "Access denied. Admin privileges are required."
        );
      } else {
        setError(
          "Failed to load students."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredStudents = students.filter(
    (student) => {
      const search =
        searchTerm.trim().toLowerCase();

      if (!search) return true;

      return (
        student.name
          ?.toLowerCase()
          .includes(search) ||
        student.email
          ?.toLowerCase()
          .includes(search) ||
        student.college
          ?.toLowerCase()
          .includes(search) ||
        student.targetCareer
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="admin-students-page">
        <div className="students-page-header">
          <div>
            <div className="students-skeleton eyebrow" />
            <div className="students-skeleton title" />
            <div className="students-skeleton subtitle" />
          </div>
        </div>

        <div className="students-search-skeleton">
          <div className="students-skeleton search" />
        </div>

        <div className="students-grid">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                className="student-skeleton-card"
                key={index}
              >
                <div className="student-skeleton-top">
                  <div className="students-skeleton avatar" />

                  <div>
                    <div className="students-skeleton name" />
                    <div className="students-skeleton email" />
                  </div>
                </div>

                <div className="student-skeleton-lines">
                  <div className="students-skeleton line" />
                  <div className="students-skeleton line" />
                  <div className="students-skeleton line" />
                  <div className="students-skeleton line" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // Error State
  // ==========================================

  if (error) {
    return (
      <div className="admin-students-page">
        <div className="students-page-header">
          <div>
            <div className="students-eyebrow">
              <Users size={14} />
              STUDENT MANAGEMENT
            </div>

            <h1>Manage Students</h1>

            <p>
              View registered students and their
              career information.
            </p>
          </div>
        </div>

        <div className="students-error">
          <div className="students-error-icon">
            <AlertCircle size={23} />
          </div>

          <div>
            <h2>
              Unable to load students
            </h2>

            <p>{error}</p>
          </div>

          <button
            onClick={fetchStudents}
            className="students-retry-button"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-students-page">

      {/* ======================================
          Header
      ====================================== */}

      <section className="students-page-header">
        <div>
          <div className="students-eyebrow">
            <Users size={14} />
            STUDENT MANAGEMENT
          </div>

          <h1>Manage Students</h1>

          <p>
            View registered students and their
            career information.
          </p>
        </div>

        <div className="students-count">
          <Users size={17} />

          <div>
            <strong>
              {students.length}
            </strong>

            <span>
              Total Students
            </span>
          </div>
        </div>
      </section>

      {/* ======================================
          Search
      ====================================== */}

      <section className="students-search-panel">
        <div className="students-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, college or career..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {searchTerm && (
            <button
              className="students-clear-search"
              onClick={() =>
                setSearchTerm("")
              }
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="students-search-info">
          <span>
            Showing{" "}
            <strong>
              {filteredStudents.length}
            </strong>{" "}
            of{" "}
            <strong>
              {students.length}
            </strong>{" "}
            students
          </span>
        </div>
      </section>

      {/* ======================================
          Empty State
      ====================================== */}

      {filteredStudents.length === 0 && (
        <div className="students-empty">
          <div className="students-empty-icon">
            <Users size={24} />
          </div>

          <h2>
            No students found
          </h2>

          <p>
            {students.length === 0
              ? "No student accounts have been registered yet."
              : "Try searching with a different name, email, college or career."}
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
          Student Cards
      ====================================== */}

      {filteredStudents.length > 0 && (
        <section className="students-grid">
          {filteredStudents.map(
            (student) => {
              const initial =
                student.name
                  ?.charAt(0)
                  .toUpperCase() || "S";

              return (
                <article
                  className="student-card"
                  key={student._id}
                >

                  {/* Student Header */}

                  <div className="student-card-header">

                    <div className="student-avatar">
                      {initial}
                    </div>

                    <div className="student-main-info">
                      <h2>
                        {student.name ||
                          "Unknown Student"}
                      </h2>

                      <div className="student-email">
                        <Mail size={13} />

                        <span>
                          {student.email ||
                            "Email not provided"}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Student Details */}

                  <div className="student-details">

                    <div className="student-detail">
                      <div className="student-detail-icon">
                        <Building2 size={16} />
                      </div>

                      <div>
                        <span>
                          College
                        </span>

                        <strong>
                          {student.college ||
                            "Not provided"}
                        </strong>
                      </div>
                    </div>

                    <div className="student-detail">
                      <div className="student-detail-icon">
                        <GraduationCap size={16} />
                      </div>

                      <div>
                        <span>
                          Year
                        </span>

                        <strong>
                          {student.year ||
                            "Not provided"}
                        </strong>
                      </div>
                    </div>

                    <div className="student-detail">
                      <div className="student-detail-icon">
                        <BriefcaseBusiness size={16} />
                      </div>

                      <div>
                        <span>
                          Target Career
                        </span>

                        {student.targetCareer ? (
                          <strong className="student-career">
                            {student.targetCareer}
                          </strong>
                        ) : (
                          <strong className="student-not-selected">
                            Not selected
                          </strong>
                        )}
                      </div>
                    </div>

                    <div className="student-detail">
                      <div className="student-detail-icon">
                        <CalendarDays size={16} />
                      </div>

                      <div>
                        <span>
                          Registered
                        </span>

                        <strong>
                          {formatDate(
                            student.createdAt
                          )}
                        </strong>
                      </div>
                    </div>

                  </div>

                </article>
              );
            }
          )}
        </section>
      )}

    </div>
  );
}

export default AdminStudents;