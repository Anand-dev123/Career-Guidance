import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    MapPin,
    BriefcaseBusiness,
    X,
    Power,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
    title: "",
    company: "",
    description: "",
    location: "",
    mode: "Remote",
    career: "",
    skills: [""],
    duration: "",
    stipend: "",
    applyUrl: "",
    source: "Manual",
    isActive: true,
    deadline: "",
};

const modes = ["Remote", "On-site", "Hybrid"];

const AdminInternships = () => {
    const [internships, setInternships] = useState([]);
    const [careers, setCareers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [careerFilter, setCareerFilter] = useState("");
    const [modeFilter, setModeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(initialForm);

    // ======================================================
    // Initial Load
    // ======================================================

    useEffect(() => {
        fetchInternships();
        fetchCareers();
    }, []);

    // ======================================================
    // Fetch Internships
    // ======================================================

    const fetchInternships = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/internships");

            setInternships(
                response.data.internships ||
                    response.data ||
                    []
            );
        } catch (err) {
            console.error(
                "Failed to fetch internships:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to load internships."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // Fetch Careers
    // ======================================================

    const fetchCareers = async () => {
        try {
            const response = await api.get("/careers");

            setCareers(
                response.data.careers ||
                    response.data ||
                    []
            );
        } catch (err) {
            console.error(
                "Failed to fetch careers:",
                err
            );
        }
    };

    // ======================================================
    // Filters
    // ======================================================

    const filteredInternships = useMemo(() => {
        return internships.filter((internship) => {
            const search =
                searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                internship.title
                    ?.toLowerCase()
                    .includes(search) ||
                internship.company
                    ?.toLowerCase()
                    .includes(search) ||
                internship.description
                    ?.toLowerCase()
                    .includes(search) ||
                internship.career
                    ?.toLowerCase()
                    .includes(search) ||
                internship.location
                    ?.toLowerCase()
                    .includes(search) ||
                internship.skills?.some((skill) =>
                    skill
                        ?.toLowerCase()
                        .includes(search)
                );

            const matchesCareer =
                !careerFilter ||
                internship.career === careerFilter;

            const matchesMode =
                !modeFilter ||
                internship.mode === modeFilter;

            const matchesStatus =
                !statusFilter ||
                (statusFilter === "Active"
                    ? internship.isActive
                    : !internship.isActive);

            return (
                matchesSearch &&
                matchesCareer &&
                matchesMode &&
                matchesStatus
            );
        });
    }, [
        internships,
        searchTerm,
        careerFilter,
        modeFilter,
        statusFilter,
    ]);

    // ======================================================
    // Form Change
    // ======================================================

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // ======================================================
    // Skill Change
    // ======================================================

    const handleSkillChange = (index, value) => {
        setForm((prev) => {
            const skills = [...prev.skills];

            skills[index] = value;

            return {
                ...prev,
                skills,
            };
        });
    };

    // ======================================================
    // Add Skill
    // ======================================================

    const addSkillField = () => {
        setForm((prev) => ({
            ...prev,
            skills: [...prev.skills, ""],
        }));
    };

    // ======================================================
    // Remove Skill
    // ======================================================

    const removeSkillField = (index) => {
        setForm((prev) => {
            const skills = prev.skills.filter(
                (_, i) => i !== index
            );

            return {
                ...prev,
                skills:
                    skills.length > 0
                        ? skills
                        : [""],
            };
        });
    };

    // ======================================================
    // Open Add Modal
    // ======================================================

    const openAddModal = () => {
        setEditingId(null);

        setForm({
            ...initialForm,
            skills: [""],
        });

        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // ======================================================
    // Open Edit Modal
    // ======================================================

    const openEditModal = (internship) => {
        setEditingId(internship._id);

        setForm({
            title: internship.title || "",
            company: internship.company || "",
            description:
                internship.description || "",
            location:
                internship.location || "",
            mode:
                internship.mode || "Remote",
            career:
                internship.career || "",
            skills:
                internship.skills?.length
                    ? internship.skills
                    : [""],
            duration:
                internship.duration || "",
            stipend:
                internship.stipend || "",
            applyUrl:
                internship.applyUrl || "",
            source:
                internship.source || "Manual",
            isActive:
                internship.isActive !== false,
            deadline: internship.deadline
                ? new Date(internship.deadline)
                      .toISOString()
                      .split("T")[0]
                : "",
        });

        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // ======================================================
    // Close Modal
    // ======================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingId(null);

        setForm({
            ...initialForm,
            skills: [""],
        });
    };

    // ======================================================
    // Submit
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            setError(
                "Internship title is required."
            );
            return;
        }

        if (!form.company.trim()) {
            setError("Company is required.");
            return;
        }

        if (!form.career.trim()) {
            setError("Career is required.");
            return;
        }

        if (!form.applyUrl.trim()) {
            setError(
                "Application URL is required."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                title: form.title.trim(),

                company: form.company.trim(),

                description:
                    form.description.trim(),

                location:
                    form.location.trim() ||
                    "Remote",

                mode: form.mode,

                career:
                    form.career.trim(),

                skills: form.skills
                    .map((skill) =>
                        skill.trim()
                    )
                    .filter(Boolean),

                duration:
                    form.duration.trim(),

                stipend:
                    form.stipend.trim() ||
                    "Not specified",

                applyUrl:
                    form.applyUrl.trim(),

                source:
                    form.source.trim() ||
                    "Manual",

                isActive:
                    Boolean(form.isActive),

                deadline:
                    form.deadline || null,
            };

            if (editingId) {
                await api.put(
                    `/admin/internships/${editingId}`,
                    payload
                );

                setSuccess(
                    "Internship updated successfully."
                );
            } else {
                await api.post(
                    "/admin/internships",
                    payload
                );

                setSuccess(
                    "Internship added successfully."
                );
            }

            await fetchInternships();

            setShowModal(false);
            setEditingId(null);

            setForm({
                ...initialForm,
                skills: [""],
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                    "Failed to save internship."
            );
        } finally {
            setSaving(false);
        }
    };

    // ======================================================
    // Delete
    // ======================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this internship?"
        );

        if (!confirmed) return;

        try {
            await api.delete(
                `/admin/internships/${id}`
            );

            setSuccess(
                "Internship deleted successfully."
            );

            setError("");

            await fetchInternships();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                    "Failed to delete internship."
            );
        }
    };

    // ======================================================
    // Toggle Active / Inactive
    // ======================================================

    const handleToggleStatus = async (
        internship
    ) => {
        try {
            await api.patch(
                `/admin/internships/${internship._id}/toggle`
            );

            setSuccess(
                internship.isActive
                    ? "Internship deactivated successfully."
                    : "Internship activated successfully."
            );

            setError("");

            await fetchInternships();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                    "Failed to update internship status."
            );
        }
    };

    // ======================================================
    // Unique Careers
    // ======================================================

    const uniqueCareers = [
        ...new Set(
            internships
                .map(
                    (internship) =>
                        internship.career
                )
                .filter(Boolean)
        ),
    ];

    // ======================================================
    // Stats
    // ======================================================

    const totalInternships =
        internships.length;

    const activeInternships =
        internships.filter(
            (internship) =>
                internship.isActive
        ).length;

    const inactiveInternships =
        internships.filter(
            (internship) =>
                !internship.isActive
        ).length;

    // ======================================================
    // Render
    // ======================================================

    return (
        <div className="admin-page">

            {/* Header */}

            <div className="admin-page-header">
                <div>
                    <h1>Internships</h1>

                    <p>
                        Manage internship opportunities
                        for students.
                    </p>
                </div>

                <button
                    className="admin-primary-btn"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    Add Internship
                </button>
            </div>

            {/* Messages */}

            {success && (
                <div className="admin-success-message">
                    {success}
                </div>
            )}

            {error && !showModal && (
                <div className="admin-error-message">
                    {error}
                </div>
            )}

            {/* Stats */}

            <div className="admin-stats-row">

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <BriefcaseBusiness
                            size={22}
                        />
                    </div>

                    <div>
                        <span>
                            Total Internships
                        </span>

                        <strong>
                            {totalInternships}
                        </strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <Power size={22} />
                    </div>

                    <div>
                        <span>
                            Active
                        </span>

                        <strong>
                            {activeInternships}
                        </strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <Power size={22} />
                    </div>

                    <div>
                        <span>
                            Inactive
                        </span>

                        <strong>
                            {inactiveInternships}
                        </strong>
                    </div>
                </div>

            </div>

            {/* Filters */}

            <div className="admin-filter-card">

                <div className="admin-search-box">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search internships..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />
                </div>

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

                    {uniqueCareers.map(
                        (career) => (
                            <option
                                key={career}
                                value={career}
                            >
                                {career}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={modeFilter}
                    onChange={(e) =>
                        setModeFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Modes
                    </option>

                    {modes.map((mode) => (
                        <option
                            key={mode}
                            value={mode}
                        >
                            {mode}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>
                </select>

            </div>

            {/* Internship List */}

            <div className="admin-table-card">

                <div className="admin-table-header">
                    <h2>
                        Internships (
                        {
                            filteredInternships.length
                        }
                        )
                    </h2>
                </div>

                {loading ? (
                    <div className="admin-empty-state">
                        Loading internships...
                    </div>
                ) : filteredInternships.length ===
                  0 ? (
                    <div className="admin-empty-state">
                        No internships found.
                    </div>
                ) : (
                    <div className="admin-internship-list">

                        {filteredInternships.map(
                            (internship) => (
                                <div
                                    className="admin-internship-card"
                                    key={
                                        internship._id
                                    }
                                >

                                    <div className="admin-internship-main">

                                        <div className="admin-internship-info">

                                            <div className="admin-internship-title-row">

                                                <h3>
                                                    {
                                                        internship.title
                                                    }
                                                </h3>

                                                <span
                                                    className={
                                                        internship.isActive
                                                            ? "status-badge active"
                                                            : "status-badge inactive"
                                                    }
                                                >
                                                    {
                                                        internship.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                </span>

                                            </div>

                                            <p className="company-name">
                                                {
                                                    internship.company
                                                }
                                            </p>

                                            <div className="admin-internship-meta">

                                                <span>
                                                    <strong>
                                                        Career:
                                                    </strong>{" "}
                                                    {
                                                        internship.career
                                                    }
                                                </span>

                                                <span>
                                                    <strong>
                                                        Mode:
                                                    </strong>{" "}
                                                    {
                                                        internship.mode
                                                    }
                                                </span>

                                                <span>
                                                    <MapPin
                                                        size={14}
                                                    />{" "}
                                                    {
                                                        internship.location
                                                    }
                                                </span>

                                                <span>
                                                    <strong>
                                                        Stipend:
                                                    </strong>{" "}
                                                    {
                                                        internship.stipend ||
                                                        "Not specified"
                                                    }
                                                </span>

                                            </div>

                                            {internship.skills
                                                ?.length >
                                                0 && (
                                                <div className="internship-skills">
                                                    {internship.skills.map(
                                                        (
                                                            skill
                                                        ) => (
                                                            <span
                                                                key={
                                                                    skill
                                                                }
                                                            >
                                                                {
                                                                    skill
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        </div>

                                        <div className="admin-internship-actions">

                                            <button
                                                className="icon-btn"
                                                title="Edit"
                                                onClick={() =>
                                                    openEditModal(
                                                        internship
                                                    )
                                                }
                                            >
                                                <Edit
                                                    size={17}
                                                />
                                            </button>

                                            <button
                                                className="icon-btn"
                                                title={
                                                    internship.isActive
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                                onClick={() =>
                                                    handleToggleStatus(
                                                        internship
                                                    )
                                                }
                                            >
                                                <Power
                                                    size={17}
                                                />
                                            </button>

                                            <button
                                                className="icon-btn danger"
                                                title="Delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        internship._id
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>

                                            {internship.applyUrl && (
                                                <a
                                                    className="icon-btn"
                                                    title="Open application"
                                                    href={
                                                        internship.applyUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink
                                                        size={17}
                                                    />
                                                </a>
                                            )}

                                        </div>

                                    </div>

                                    <div className="admin-internship-details">

                                        <span>
                                            <strong>
                                                Duration:
                                            </strong>{" "}
                                            {internship.duration ||
                                                "Not specified"}
                                        </span>

                                        <span>
                                            <strong>
                                                Source:
                                            </strong>{" "}
                                            {internship.source ||
                                                "Manual"}
                                        </span>

                                        <span>
                                            <strong>
                                                Deadline:
                                            </strong>{" "}
                                            {internship.deadline
                                                ? new Date(
                                                      internship.deadline
                                                  ).toLocaleDateString()
                                                : "Not specified"}
                                        </span>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* ==================================================
                Modal
            ================================================== */}

            {showModal && (
                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <div className="admin-modal-header">

                            <div>
                                <h2>
                                    {editingId
                                        ? "Edit Internship"
                                        : "Add Internship"}
                                </h2>

                                <p>
                                    Add an internship
                                    opportunity for
                                    students.
                                </p>
                            </div>

                            <button
                                className="modal-close-btn"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {error && (
                            <div className="admin-error-message">
                                {error}
                            </div>
                        )}

                        <form
                            className="admin-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* Title */}

                            <div className="form-group">
                                <label>
                                    Internship Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="e.g. Software Developer Intern"
                                />
                            </div>

                            {/* Company */}

                            <div className="form-group">
                                <label>
                                    Company *
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={
                                        form.company
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="e.g. ABC Technologies"
                                />
                            </div>

                            {/* Description */}

                            <div className="form-group">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="Describe the internship..."
                                    rows="4"
                                />
                            </div>

                            {/* Career + Mode */}

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Career *
                                    </label>

                                    <input
                                        type="text"
                                        name="career"
                                        value={
                                            form.career
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="e.g. Software Developer"
                                        list="internship-careers"
                                    />

                                    <datalist id="internship-careers">
                                        {careers.map(
                                            (
                                                career
                                            ) => (
                                                <option
                                                    key={
                                                        career._id
                                                    }
                                                    value={
                                                        career.name
                                                    }
                                                />
                                            )
                                        )}
                                    </datalist>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Mode
                                    </label>

                                    <select
                                        name="mode"
                                        value={
                                            form.mode
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >
                                        {modes.map(
                                            (
                                                mode
                                            ) => (
                                                <option
                                                    key={
                                                        mode
                                                    }
                                                    value={
                                                        mode
                                                    }
                                                >
                                                    {
                                                        mode
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                            </div>

                            {/* Location + Duration */}

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="e.g. Noida, India"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Duration
                                    </label>

                                    <input
                                        type="text"
                                        name="duration"
                                        value={
                                            form.duration
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="e.g. 3 Months"
                                    />
                                </div>

                            </div>

                            {/* Stipend + Deadline */}

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Stipend
                                    </label>

                                    <input
                                        type="text"
                                        name="stipend"
                                        value={
                                            form.stipend
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="e.g. ₹15,000/month"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Application Deadline
                                    </label>

                                    <input
                                        type="date"
                                        name="deadline"
                                        value={
                                            form.deadline
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>

                            </div>

                            {/* Skills */}

                            <div className="form-group">

                                <div className="resource-header">
                                    <label>
                                        Required Skills
                                    </label>

                                    <button
                                        type="button"
                                        className="add-resource-btn"
                                        onClick={
                                            addSkillField
                                        }
                                    >
                                        <Plus
                                            size={15}
                                        />
                                        Add Skill
                                    </button>
                                </div>

                                {form.skills.map(
                                    (
                                        skill,
                                        index
                                    ) => (
                                        <div
                                            className="resource-input-row"
                                            key={
                                                index
                                            }
                                        >

                                            <input
                                                type="text"
                                                value={
                                                    skill
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleSkillChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. JavaScript"
                                            />

                                            {form
                                                .skills
                                                .length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    className="remove-resource-btn"
                                                    onClick={() =>
                                                        removeSkillField(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>
                                            )}

                                        </div>
                                    )
                                )}

                            </div>

                            {/* Apply URL */}

                            <div className="form-group">
                                <label>
                                    Application URL *
                                </label>

                                <input
                                    type="url"
                                    name="applyUrl"
                                    value={
                                        form.applyUrl
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="https://example.com/apply"
                                />
                            </div>

                            {/* Source */}

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Source
                                    </label>

                                    <input
                                        type="text"
                                        name="source"
                                        value={
                                            form.source
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Manual"
                                    />
                                </div>

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <label className="checkbox-row">

                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={
                                                form.isActive
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        />

                                        <span>
                                            Active
                                        </span>

                                    </label>

                                </div>

                            </div>

                            {/* Actions */}

                            <div className="admin-modal-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                        ? "Update Internship"
                                        : "Add Internship"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* ==================================================
                Styles
            ================================================== */}

            <style>{`

                .admin-page {
                    padding: 28px;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    gap: 20px;
                }

                .admin-page-header h1 {
                    margin: 0 0 6px;
                    font-size: 28px;
                    color: #0f172a;
                }

                .admin-page-header p {
                    margin: 0;
                    color: #64748b;
                }

                .admin-primary-btn,
                .admin-secondary-btn {
                    border: none;
                    border-radius: 8px;
                    padding: 11px 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .admin-primary-btn {
                    background: #2563eb;
                    color: white;
                }

                .admin-primary-btn:hover {
                    background: #1d4ed8;
                }

                .admin-primary-btn:disabled,
                .admin-secondary-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .admin-secondary-btn {
                    background: #e2e8f0;
                    color: #334155;
                }

                .admin-success-message,
                .admin-error-message {
                    padding: 12px 15px;
                    border-radius: 8px;
                    margin-bottom: 18px;
                    font-size: 14px;
                }

                .admin-success-message {
                    background: #dcfce7;
                    color: #166534;
                }

                .admin-error-message {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .admin-stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                    margin-bottom: 20px;
                }

                .admin-stat-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 18px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .admin-stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .admin-stat-card span {
                    display: block;
                    color: #64748b;
                    font-size: 13px;
                    margin-bottom: 4px;
                }

                .admin-stat-card strong {
                    font-size: 22px;
                    color: #0f172a;
                }

                .admin-filter-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 16px;
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .admin-search-box {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 0 12px;
                }

                .admin-search-box svg {
                    color: #64748b;
                }

                .admin-search-box input {
                    width: 100%;
                    border: none;
                    outline: none;
                    padding: 11px 0;
                    font-size: 14px;
                }

                .admin-filter-card select,
                .admin-form select,
                .admin-form input,
                .admin-form textarea {
                    width: 100%;
                    box-sizing: border-box;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 11px 12px;
                    outline: none;
                    font-size: 14px;
                    background: white;
                }

                .admin-form textarea {
                    resize: vertical;
                }

                .admin-filter-card select:focus,
                .admin-form input:focus,
                .admin-form select:focus,
                .admin-form textarea:focus {
                    border-color: #2563eb;
                }

                .admin-table-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .admin-table-header {
                    padding: 18px 20px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .admin-table-header h2 {
                    margin: 0;
                    font-size: 18px;
                    color: #0f172a;
                }

                .admin-internship-list {
                    padding: 14px;
                }

                .admin-internship-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    margin-bottom: 12px;
                    overflow: hidden;
                }

                .admin-internship-main {
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }

                .admin-internship-info {
                    flex: 1;
                    min-width: 0;
                }

                .admin-internship-title-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .admin-internship-title-row h3 {
                    margin: 0;
                    color: #0f172a;
                    font-size: 16px;
                }

                .company-name {
                    color: #475569;
                    font-weight: 600;
                    margin: 6px 0 12px;
                }

                .status-badge {
                    padding: 4px 9px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 700;
                }

                .status-badge.active {
                    background: #dcfce7;
                    color: #166534;
                }

                .status-badge.inactive {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .admin-internship-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px 18px;
                    color: #475569;
                    font-size: 12px;
                }

                .admin-internship-meta span {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .internship-skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 12px;
                }

                .internship-skills span {
                    background: #eff6ff;
                    color: #2563eb;
                    border-radius: 999px;
                    padding: 5px 9px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .admin-internship-actions {
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                    flex-shrink: 0;
                }

                .icon-btn {
                    width: 34px;
                    height: 34px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #475569;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    text-decoration: none;
                }

                .icon-btn:hover {
                    background: #f8fafc;
                }

                .icon-btn.danger {
                    color: #dc2626;
                }

                .admin-internship-details {
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    padding: 12px 16px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px 24px;
                    color: #64748b;
                    font-size: 12px;
                }

                .admin-empty-state {
                    padding: 50px 20px;
                    text-align: center;
                    color: #64748b;
                }

                .admin-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.55);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    z-index: 1000;
                    overflow-y: auto;
                }

                .admin-modal {
                    width: 100%;
                    max-width: 720px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background: white;
                    border-radius: 14px;
                    padding: 24px;
                    box-sizing: border-box;
                }

                .admin-modal-header {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .admin-modal-header h2 {
                    margin: 0 0 5px;
                    color: #0f172a;
                }

                .admin-modal-header p {
                    margin: 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .modal-close-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: #f1f5f9;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .admin-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }

                .form-group label {
                    color: #334155;
                    font-size: 13px;
                    font-weight: 600;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }

                .resource-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 4px;
                }

                .add-resource-btn {
                    border: 1px solid #bfdbfe;
                    background: #eff6ff;
                    color: #2563eb;
                    border-radius: 7px;
                    padding: 7px 10px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                .resource-input-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .resource-input-row input {
                    flex: 1;
                }

                .remove-resource-btn {
                    width: 38px;
                    height: 38px;
                    flex-shrink: 0;
                    border: 1px solid #fecaca;
                    background: #fef2f2;
                    color: #dc2626;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .checkbox-row {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    margin-top: 8px;
                }

                .checkbox-row input {
                    width: auto !important;
                }

                .admin-modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 6px;
                }

                @media (max-width: 900px) {
                    .admin-filter-card {
                        grid-template-columns: 1fr 1fr;
                    }

                    .admin-stats-row {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 650px) {
                    .admin-page {
                        padding: 16px;
                    }

                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .admin-filter-card {
                        grid-template-columns: 1fr;
                    }

                    .admin-internship-main {
                        flex-direction: column;
                    }

                    .admin-internship-actions {
                        justify-content: flex-end;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .resource-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }
                }

            `}</style>
        </div>
    );
};

export default AdminInternships;