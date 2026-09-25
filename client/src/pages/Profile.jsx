import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Mail,
  Target,
  UserRound,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Profile
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await api.get(
          "/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="profile-content">
            <div className="profile-loading">
              <div className="profile-skeleton profile-skeleton-avatar" />

              <div className="profile-skeleton profile-skeleton-title" />

              <div className="profile-skeleton profile-skeleton-text" />

              <div className="profile-skeleton-grid">
                <div className="profile-skeleton profile-skeleton-card" />
                <div className="profile-skeleton profile-skeleton-card" />
                <div className="profile-skeleton profile-skeleton-card" />
                <div className="profile-skeleton profile-skeleton-card" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="profile-content">
            <div className="profile-error">
              <div className="profile-error-icon">
                <UserRound size={24} />
              </div>

              <h2>
                Unable to load profile
              </h2>

              <p>{error}</p>

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ==========================================
  // Profile Data
  // ==========================================

  const name =
    profile?.name || "User";

  const firstLetter =
    name.charAt(0).toUpperCase();

  const targetCareer =
    profile?.targetCareer ||
    "Not selected";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="profile-content">

          {/* ======================================
              Header
          ====================================== */}

          <section className="profile-page-header">
            <div>
              <div className="profile-eyebrow">
                <UserRound size={15} />
                ACCOUNT
              </div>

              <h1>My Profile</h1>

              <p>
                View your personal and career
                information.
              </p>
            </div>

            <button
              className="profile-back-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </section>

          {/* ======================================
              Profile Hero
          ====================================== */}

          <section className="profile-hero">
            <div className="profile-avatar">
              {firstLetter}
            </div>

            <div className="profile-hero-info">
              <span className="profile-status">
                <span className="status-dot" />
                Student Account
              </span>

              <h2>{name}</h2>

              <div className="profile-email">
                <Mail size={15} />

                <span>
                  {profile?.email ||
                    "Email not available"}
                </span>
              </div>
            </div>

            <div className="profile-career-highlight">
              <div className="career-highlight-icon">
                <Target size={18} />
              </div>

              <div>
                <span>Target Career</span>

                <strong>
                  {targetCareer}
                </strong>
              </div>
            </div>
          </section>

          {/* ======================================
              Personal Information
          ====================================== */}

          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <UserRound size={18} />
              </div>

              <div>
                <span>
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Personal Details
                </h2>

                <p>
                  Basic information associated
                  with your account.
                </p>
              </div>
            </div>

            <div className="profile-details-grid">

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <UserRound size={17} />
                </div>

                <div>
                  <span>Name</span>

                  <strong>
                    {profile?.name ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <Mail size={17} />
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {profile?.email ||
                      "Not available"}
                  </strong>
                </div>
              </div>

            </div>
          </section>

          {/* ======================================
              Academic Information
          ====================================== */}

          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <GraduationCap size={18} />
              </div>

              <div>
                <span>
                  EDUCATION
                </span>

                <h2>
                  Academic Information
                </h2>

                <p>
                  Your current academic
                  background.
                </p>
              </div>
            </div>

            <div className="profile-details-grid">

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <BookOpen size={17} />
                </div>

                <div>
                  <span>
                    Education
                  </span>

                  <strong>
                    {profile?.education ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <Building2 size={17} />
                </div>

                <div>
                  <span>
                    College
                  </span>

                  <strong>
                    {profile?.college ||
                      "Not available"}
                  </strong>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <GraduationCap size={17} />
                </div>

                <div>
                  <span>
                    Year
                  </span>

                  <strong>
                    {profile?.year ||
                      "Not available"}
                  </strong>
                </div>
              </div>

            </div>
          </section>

          {/* ======================================
              Career Information
          ====================================== */}

          <section className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <BriefcaseBusiness size={18} />
              </div>

              <div>
                <span>
                  CAREER
                </span>

                <h2>
                  Career Information
                </h2>

                <p>
                  Your current career direction
                  within CareerGuide.
                </p>
              </div>
            </div>

            <div className="career-profile-card">
              <div className="career-profile-icon">
                <Target size={21} />
              </div>

              <div className="career-profile-content">
                <span>
                  Target Career
                </span>

                <h3>
                  {targetCareer}
                </h3>

                <p>
                  Your roadmap, assignments,
                  recommendations and learning
                  resources are personalized
                  around this career.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                View Dashboard
                <ArrowLeft
                  size={15}
                  className="profile-arrow-right"
                />
              </button>
            </div>
          </section>

          {/* ======================================
              Quick Navigation
          ====================================== */}

          <section className="profile-quick-actions">

            <button
              onClick={() =>
                navigate("/skills")
              }
            >
              <GraduationCap size={17} />

              <span>
                <strong>
                  My Skills
                </strong>

                <small>
                  View skill progress
                </small>
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/roadmap")
              }
            >
              <Target size={17} />

              <span>
                <strong>
                  Learning Roadmap
                </strong>

                <small>
                  Continue your roadmap
                </small>
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/progress")
              }
            >
              <BriefcaseBusiness size={17} />

              <span>
                <strong>
                  Progress
                </strong>

                <small>
                  View learning analytics
                </small>
              </span>
            </button>

          </section>

        </main>
      </div>
    </div>
  );
}

export default Profile;