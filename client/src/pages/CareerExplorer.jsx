import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CareerExplorer() {
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get("/careers");

        const formattedCareers = response.data.map((career) => ({
          id: career._id,
          title: career.name,
          domain: career.category,
          description: career.description,
          skills: career.requiredSkills,
        }));

        setCareers(formattedCareers);
      } catch (error) {
        console.error("Failed to fetch careers:", error);
      }
    };

    fetchCareers();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [savedCareers, setSavedCareers] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("savedCareers");

    if (saved) {
      setSavedCareers(JSON.parse(saved));
    }
  }, []);
  const toggleSaveCareer = (career) => {
    const alreadySaved = savedCareers.some(
      (savedCareer) => savedCareer.id === career.id,
    );

    let updatedCareers;

    if (alreadySaved) {
      updatedCareers = savedCareers.filter(
        (savedCareer) => savedCareer.id !== career.id,
      );
    } else {
      updatedCareers = [...savedCareers, career];
    }

    setSavedCareers(updatedCareers);

    localStorage.setItem("savedCareers", JSON.stringify(updatedCareers));
  };

  const domains = ["All", ...new Set(careers.map((career) => career.domain))];

  const filteredCareers = careers.filter((career) => {
    const matchesSearch = career.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDomain =
      selectedDomain === "All" || career.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>Career Explorer</h1>

              <p>
                Explore career options and discover the skills required for each
                career.
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="career-filters">
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* Career Details */}
          {selectedCareer && (
            <div className="career-detail-card">
              <button
                className="career-back-btn"
                onClick={() => setSelectedCareer(null)}
              >
                ← Back to Careers
              </button>

              <h2>{selectedCareer.title}</h2>

              <span className="career-domain">{selectedCareer.domain}</span>

              <p>{selectedCareer.description}</p>

              <h3>Required Skills</h3>

              <div className="career-skills">
                {selectedCareer.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <h3>Career Overview</h3>

              <p>
                This career requires strong technical knowledge, problem-solving
                ability and continuous learning. Build practical projects and
                improve the required skills to prepare for this career path.
              </p>
            </div>
          )}
          {/* Saved Careers */}
          {!selectedCareer && savedCareers.length > 0 && (
            <div className="saved-careers-section">
              <div className="saved-careers-header">
                <div>
                  <h2>Saved Careers</h2>
                  <p>Your saved career options.</p>
                </div>

                <span className="saved-careers-count">
                  {savedCareers.length} Saved
                </span>
              </div>

              <div className="saved-careers-list">
                {savedCareers.map((career) => (
                  <div className="saved-career-item" key={career.id}>
                    <div>
                      <h3>{career.title}</h3>
                      <span>{career.domain}</span>
                    </div>

                    <button
                      className="saved-career-view-btn"
                      onClick={() => setSelectedCareer(career)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Cards */}
          {!selectedCareer && (
            <div className="career-grid">
              {filteredCareers.length > 0 ? (
                filteredCareers.map((career) => (
                  <div className="career-card" key={career.id}>
                    <h2>{career.title}</h2>

                    <span className="career-domain">{career.domain}</span>

                    <p>{career.description}</p>

                    <div className="career-skills">
                      {career.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <div className="career-actions">
                      <button
                        className="career-view-btn"
                        onClick={() => setSelectedCareer(career)}
                      >
                        View Career
                      </button>

                      <button
                        className="career-save-btn"
                        onClick={() => toggleSaveCareer(career)}
                      >
                        {savedCareers.some(
                          (savedCareer) => savedCareer.id === career.id,
                        )
                          ? "Unsave"
                          : "Save Career"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-careers">No careers found.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CareerExplorer;
