import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="main-area">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>Welcome back, {user?.name || "Student"} 👋</h1>

              <p>Here is your career guidance overview.</p>
            </div>

            <button className="dashboard-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="career-info">
            <h2>Your Target Career</h2>

            <p>{user?.targetCareer || "Not selected"}</p>
          </div>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>My Skills</h3>
              <strong>0</strong>
              <p>Skills assessed</p>
            </div>

            <div className="summary-card">
              <h3>Assessment</h3>

              <strong>
                {localStorage.getItem("assessmentScore")
                  ? `${localStorage.getItem("assessmentScore")}%`
                  : "Not Started"}
              </strong>

              <p>Career assessment score</p>
            </div>

            <div className="summary-card">
              <h3>Roadmap</h3>
              <strong>0%</strong>
              <p>Learning progress</p>
            </div>

            <div className="summary-card">
              <h3>Progress</h3>
              <strong>0%</strong>
              <p>Overall career progress</p>
            </div>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Career Assessment</h3>
              <p>Discover careers based on your skills.</p>

              <button onClick={() => navigate("/assessment")}>
                Start Assessment
              </button>
            </div>

            <div className="dashboard-card">
              <h3>My Skills</h3>
              <p>Track your current skills and gaps.</p>

              <button onClick={() => navigate("/skills")}>View Skills</button>
            </div>

            <div className="dashboard-card">
              <h3>Career Roadmap</h3>
              <p>Follow a structured path toward your career.</p>

              <button onClick={() => navigate("/roadmap")}>View Roadmap</button>
            </div>

            <div className="dashboard-card">
              <h3>DSA Lab</h3>
              <p>Practice DSA concepts and algorithms.</p>

              <button onClick={() => navigate("/dsa-lab")}>Open DSA Lab</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
