import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const navigate = useNavigate();

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>My Profile</h1>
              <p>View your personal and career information.</p>
            </div>

            <button
              className="profile-back-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              {profile?.name ? profile?.name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2>{profile?.name || "User"}</h2>

            <p className="profile-role">Student</p>

            <div className="profile-details">
              <div className="profile-item">
                <span>Name</span>
                <strong>{profile?.name || "Not available"}</strong>
              </div>

              <div className="profile-item">
                <span>Email</span>
                <strong>{profile?.email || "Not available"}</strong>
              </div>

              <div className="profile-item">
                <span>Target Career</span>
                <strong>{profile?.targetCareer || "Not selected"}</strong>
              </div>
              <div className="profile-item">
                <span>Education</span>
                <strong>{profile?.education || "Not available"}</strong>
              </div>

              <div className="profile-item">
                <span>College</span>
                <strong>{profile?.college || "Not available"}</strong>
              </div>

              <div className="profile-item">
                <span>Year</span>
                <strong>{profile?.year || "Not available"}</strong>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
