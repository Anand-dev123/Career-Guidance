import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  Award,
  Target,
  TrendingUp,
  Lightbulb,
  Route,
  ExternalLink,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [careerRecommendations, setCareerRecommendations] =
    useState([]);

  // ==========================================
  // File Selection
  // ==========================================

  const handleFileChange = (event) => {
    const file =
      event.target.files[0];

    setError("");
    setResult(null);
    setAnalysis(null);
    setCareerRecommendations([]);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PDF and DOCX files are allowed."
      );

      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "File size must be less than 5 MB."
      );

      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // Upload Resume
  // ==========================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(
        "Please select a resume first."
      );

      return;
    }

    try {
      setUploading(true);
      setError("");
      setResult(null);
      setAnalysis(null);
      setCareerRecommendations([]);

      const formData =
        new FormData();

      formData.append(
        "resume",
        selectedFile
      );

      const response =
        await api.post(
          "/resumes/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      setResult(
        response.data
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // AI Analysis
  // ==========================================

  const handleAIAnalysis = async () => {
    if (!result?.text) {
      setError(
        "Please upload your resume first."
      );

      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);
      setCareerRecommendations([]);

      const response =
        await api.post(
          "/resumes/analyze",
          {
            text: result.text,
            fileName: result.fileName,
          }
        );

      setAnalysis(
        response.data.analysis
      );

      setCareerRecommendations(
        response.data
          .careerRecommendations || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to analyze resume with AI."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // Remove Selected File
  // ==========================================

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setResult(null);
    setAnalysis(null);
    setCareerRecommendations([]);
    setError("");
  };

  // ==========================================
  // Match Class
  // ==========================================

  const getMatchClass = (percentage) => {
    if (percentage >= 80) {
      return "match-excellent";
    }

    if (percentage >= 60) {
      return "match-good";
    }

    if (percentage >= 40) {
      return "match-medium";
    }

    return "match-low";
  };

  // ==========================================
  // Analysis Section
  // ==========================================

  const AnalysisSection = ({
    icon: Icon,
    title,
    children,
  }) => {
    return (
      <section className="analysis-section">

        <div className="analysis-section-header">

          <div className="analysis-section-icon">
            <Icon size={16} />
          </div>

          <h3>
            {title}
          </h3>

        </div>

        <div className="analysis-section-content">
          {children}
        </div>

      </section>
    );
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">

        <Navbar />

        <main className="page-content resume-page">

          {/* ==================================
              HEADER
          ================================== */}

          <header className="resume-header">

            <div className="resume-eyebrow">
              <FileText size={14} />
              Career Profile
            </div>

            <h1>
              Resume Analyzer
            </h1>

            <p>
              Upload your resume and get
              AI-powered insights about your
              skills, career fit and improvement
              areas.
            </p>

          </header>


          {/* ==================================
              ERROR
          ================================== */}

          {error && (
            <div className="resume-error">

              <AlertCircle size={17} />

              <span>
                {error}
              </span>

            </div>
          )}


          {/* ==================================
              UPLOAD CARD
          ================================== */}

          <section className="resume-upload-card">

            <div className="upload-card-header">

              <div className="upload-icon">
                <Upload size={22} />
              </div>

              <div>
                <h2>
                  Upload your resume
                </h2>

                <p>
                  Upload a PDF or DOCX file up
                  to 5 MB.
                </p>
              </div>

            </div>


            <label className="resume-dropzone">

              <input
                type="file"
                accept=".pdf,.docx"
                onChange={
                  handleFileChange
                }
              />

              <div className="dropzone-icon">
                <FileText size={24} />
              </div>

              <strong>
                {selectedFile
                  ? "Resume selected"
                  : "Choose your resume"}
              </strong>

              <span>
                {selectedFile
                  ? selectedFile.name
                  : "PDF or DOCX • Maximum 5 MB"}
              </span>

            </label>


            {selectedFile && (
              <div className="selected-file">

                <div className="selected-file-info">

                  <div className="file-icon">
                    <FileText size={16} />
                  </div>

                  <div>
                    <strong>
                      {selectedFile.name}
                    </strong>

                    <span>
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>

                </div>


                <button
                  type="button"
                  className="remove-file"
                  onClick={
                    clearSelectedFile
                  }
                >
                  <X size={15} />
                </button>

              </div>
            )}


            <button
              className="primary-resume-button"
              onClick={handleUpload}
              disabled={
                !selectedFile ||
                uploading
              }
            >
              {uploading ? (
                <>
                  <span className="button-spinner" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Resume
                </>
              )}
            </button>

          </section>


          {/* ==================================
              EXTRACTED RESUME
          ================================== */}

          {result && (
            <section className="resume-extracted-card">

              <div className="success-banner">

                <div className="success-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>
                    Resume extracted successfully
                  </strong>

                  <span>
                    Your resume text is ready
                    for AI analysis.
                  </span>
                </div>

              </div>


              <div className="resume-stat-row">

                <div className="resume-stat">
                  <span>
                    File
                  </span>

                  <strong>
                    {result.fileName}
                  </strong>
                </div>

                <div className="resume-stat">
                  <span>
                    Characters extracted
                  </span>

                  <strong>
                    {result.textLength}
                  </strong>
                </div>

              </div>


              <details className="extracted-text">

                <summary>
                  View extracted resume text
                </summary>

                <div>
                  {result.text}
                </div>

              </details>


              <div className="analysis-action">

                <div>
                  <strong>
                    Ready for career analysis?
                  </strong>

                  <span>
                    Gemini AI will analyze your
                    resume and generate career
                    recommendations.
                  </span>
                </div>

                <button
                  className="ai-analysis-button"
                  onClick={
                    handleAIAnalysis
                  }
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <span className="button-spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Analyze Resume
                    </>
                  )}
                </button>

              </div>

            </section>
          )}


          {/* ==================================
              AI ANALYSIS
          ================================== */}

          {analysis && (
            <section className="analysis-container">

              <div className="analysis-header">

                <div>

                  <div className="resume-eyebrow">
                    <Sparkles size={14} />
                    AI Analysis
                  </div>

                  <h2>
                    Resume career insights
                  </h2>

                  <p>
                    Key information and career
                    insights extracted from your
                    resume.
                  </p>

                </div>

              </div>


              {/* ==================================
                  SKILLS
              ================================== */}

              <AnalysisSection
                icon={Code2}
                title="Skills"
              >

                {analysis.skills?.length > 0 ? (

                  <div className="skills-analysis-grid">

                    {analysis.skills.map(
                      (skill, index) => (
                        <div
                          key={index}
                          className="skill-analysis-card"
                        >

                          <div>
                            <strong>
                              {skill.name}
                            </strong>

                            {skill.evidence && (
                              <span>
                                {skill.evidence}
                              </span>
                            )}
                          </div>

                          <span className="skill-level">
                            {skill.level}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                ) : (
                  <div className="analysis-empty">
                    No skills detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  EDUCATION
              ================================== */}

              <AnalysisSection
                icon={GraduationCap}
                title="Education"
              >

                {analysis.education?.length > 0 ? (

                  <ul className="analysis-list">
                    {analysis.education.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                ) : (
                  <div className="analysis-empty">
                    No education information
                    detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  EXPERIENCE
              ================================== */}

              <AnalysisSection
                icon={BriefcaseBusiness}
                title="Experience"
              >

                {analysis.experience?.length > 0 ? (

                  <ul className="analysis-list">
                    {analysis.experience.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                ) : (
                  <div className="analysis-empty">
                    No experience information
                    detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  PROJECTS
              ================================== */}

              <AnalysisSection
                icon={Code2}
                title="Projects"
              >

                {analysis.projects?.length > 0 ? (

                  <ul className="analysis-list">
                    {analysis.projects.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                ) : (
                  <div className="analysis-empty">
                    No projects detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  CERTIFICATIONS
              ================================== */}

              <AnalysisSection
                icon={Award}
                title="Certifications"
              >

                {analysis.certifications?.length > 0 ? (

                  <ul className="analysis-list">
                    {analysis.certifications.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                ) : (
                  <div className="analysis-empty">
                    No certifications detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  STRENGTHS
              ================================== */}

              <AnalysisSection
                icon={TrendingUp}
                title="Strengths"
              >

                {analysis.strengths?.length > 0 ? (

                  <ul className="analysis-list positive-list">
                    {analysis.strengths.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                ) : (
                  <div className="analysis-empty">
                    No strengths detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  MISSING SKILLS
              ================================== */}

              <AnalysisSection
                icon={Target}
                title="Skills to Improve"
              >

                {analysis.missingSkills?.length > 0 ? (

                  <div className="improvement-list">

                    {analysis.missingSkills.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="improvement-item"
                        >
                          <Lightbulb size={14} />
                          <span>
                            {item}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                ) : (
                  <div className="analysis-empty success">
                    No major missing skills
                    detected.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  CAREER SUGGESTIONS
              ================================== */}

              <AnalysisSection
                icon={Lightbulb}
                title="Career Suggestions"
              >

                {analysis.suggestions?.length > 0 ? (

                  <ul className="analysis-list">
                    {analysis.suggestions.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                ) : (
                  <div className="analysis-empty">
                    No suggestions available.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  SUITABLE CAREERS
              ================================== */}

              <AnalysisSection
                icon={Route}
                title="Suitable Careers"
              >

                {analysis.careerMatches?.length > 0 ? (

                  <div className="career-match-list">

                    {analysis.careerMatches.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="career-match-item"
                        >

                          <div className="career-match-number">
                            {index + 1}
                          </div>

                          <div>
                            <strong>
                              {item.career}
                            </strong>

                            <p>
                              {item.reason}
                            </p>
                          </div>

                        </div>
                      )
                    )}

                  </div>

                ) : (
                  <div className="analysis-empty">
                    No career matches found.
                  </div>
                )}

              </AnalysisSection>


              {/* ==================================
                  DSA CAREER RECOMMENDATIONS
              ================================== */}

              <section className="dsa-recommendation-section">

                <div className="dsa-header">

                  <div className="dsa-icon">
                    <Target size={19} />
                  </div>

                  <div>
                    <div className="section-eyebrow">
                      DSA Matching
                    </div>

                    <h2>
                      Career recommendations
                    </h2>

                    <p>
                      Career matches calculated from
                      your resume skills and the
                      platform's DSA matching logic.
                    </p>
                  </div>

                </div>


                {careerRecommendations.length > 0 ? (

                  <div className="dsa-career-grid">

                    {careerRecommendations.map(
                      (career, index) => (
                        <article
                          key={index}
                          className="dsa-career-card"
                        >

                          <div className="dsa-career-top">

                            <div className="dsa-rank">
                              {index + 1}
                            </div>

                            <div>
                              <h3>
                                {career.career}
                              </h3>

                              <span>
                                Career match
                              </span>
                            </div>

                            <div
                              className={`career-match-percentage ${getMatchClass(
                                career.matchPercentage
                              )}`}
                            >
                              {career.matchPercentage}%
                            </div>

                          </div>


                          {career.matchedSkills
                            ?.length > 0 && (
                            <div className="career-skill-group">

                              <strong>
                                Matched skills
                              </strong>

                              <div className="career-skill-tags">

                                {career.matchedSkills.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (
                                    <span
                                      key={
                                        skillIndex
                                      }
                                      className="matched-tag"
                                    >
                                      {skill.skill}
                                    </span>
                                  )
                                )}

                              </div>

                            </div>
                          )}


                          {career.skillsToImprove
                            ?.length > 0 && (
                            <div className="career-skill-group">

                              <strong>
                                Skills to improve
                              </strong>

                              <div className="career-skill-tags">

                                {career.skillsToImprove.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (
                                    <span
                                      key={
                                        skillIndex
                                      }
                                      className="improve-tag"
                                    >
                                      {skill.skill}
                                    </span>
                                  )
                                )}

                              </div>

                            </div>
                          )}


                          {career.missingSkills
                            ?.length > 0 && (
                            <div className="career-skill-group">

                              <strong>
                                Missing skills
                              </strong>

                              <div className="career-skill-tags">

                                {career.missingSkills.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (
                                    <span
                                      key={
                                        skillIndex
                                      }
                                      className="missing-tag"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}

                              </div>

                            </div>
                          )}


                          {career.recommendationReason && (
                            <div className="career-reason">

                              <strong>
                                Why this career?
                              </strong>

                              <p>
                                {
                                  career.recommendationReason
                                }
                              </p>

                            </div>
                          )}

                        </article>
                      )
                    )}

                  </div>

                ) : (

                  <div className="analysis-empty">
                    No DSA career recommendations
                    available.
                  </div>

                )}

              </section>

            </section>
          )}

        </main>

      </div>
    </div>
  );
};

export default ResumeAnalyzer;