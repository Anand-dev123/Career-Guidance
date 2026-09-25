import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    GraduationCap,
    Building2,
    CalendarDays,
    BriefcaseBusiness,
} from "lucide-react";

import api from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        education: "",
        college: "",
        year: "",
        targetCareer: "",
    });

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [agreeTerms, setAgreeTerms] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] =
        useState(false);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        if (error) {
            setError("");
        }
    };

    // ==========================================
    // PASSWORD STRENGTH
    // ==========================================

    const getPasswordStrength = () => {
        const password = form.password;

        if (!password) {
            return {
                label: "",
                width: "0%",
                level: 0,
            };
        }

        let score = 0;

        if (password.length >= 6) {
            score++;
        }

        if (password.length >= 10) {
            score++;
        }

        if (/[A-Z]/.test(password)) {
            score++;
        }

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }

        if (score <= 1) {
            return {
                label: "Weak",
                width: "25%",
                level: 1,
            };
        }

        if (score <= 3) {
            return {
                label: "Medium",
                width: "55%",
                level: 2,
            };
        }

        return {
            label: "Strong",
            width: "100%",
            level: 3,
        };
    };

    const passwordStrength =
        getPasswordStrength();

    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {
        if (!form.name.trim()) {
            return "Please enter your full name.";
        }

        if (form.name.trim().length < 2) {
            return "Please enter a valid name.";
        }

        if (!form.email.trim()) {
            return "Please enter your email address.";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            return "Please enter a valid email address.";
        }

        if (!form.password) {
            return "Please create a password.";
        }

        if (form.password.length < 6) {
            return "Password must contain at least 6 characters.";
        }

        if (form.password !== confirmPassword) {
            return "Passwords do not match.";
        }

        if (!form.education.trim()) {
            return "Please enter your education.";
        }

        if (!form.college.trim()) {
            return "Please enter your college.";
        }

        if (!form.year.trim()) {
            return "Please enter your current year.";
        }

        if (!form.targetCareer) {
            return "Please select your target career.";
        }

        if (!agreeTerms) {
            return "Please accept the Terms & Conditions.";
        }

        return "";
    };

    // ==========================================
    // SIGNUP
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const response =
                await api.post(
                    "/auth/signup",
                    {
                        name:
                            form.name.trim(),

                        email:
                            form.email
                                .trim()
                                .toLowerCase(),

                        password:
                            form.password,

                        education:
                            form.education.trim(),

                        college:
                            form.college.trim(),

                        year:
                            form.year.trim(),

                        targetCareer:
                            form.targetCareer,
                    }
                );

            // ==================================
            // SAVE AUTH DATA
            // ==================================

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );

            // ==================================
            // REDIRECT
            // ==================================

            navigate("/dashboard");
        } catch (error) {
            console.error(
                "Signup error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                    "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INPUT STYLE HELPERS
    // ==========================================

    const inputWrapperStyle = {
        position: "relative",
    };

    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px 11px 39px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "13px",
        color: "#0f172a",
        outline: "none",
        background: "#ffffff",
    };

    const iconStyle = {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1080px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns:
                        "0.85fr 1.15fr",
                    boxShadow:
                        "0 12px 40px rgba(15, 23, 42, 0.08)",
                }}
            >
                {/* ==================================
                    LEFT BRAND SECTION
                ================================== */}

                <div
                    style={{
                        background: "#0f172a",
                        color: "#ffffff",
                        padding: "45px",
                        display: "flex",
                        flexDirection:
                            "column",
                        justifyContent:
                            "space-between",
                    }}
                >
                    <div>
                        {/* LOGO */}

                        <div
                            style={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                                marginBottom:
                                    "55px",
                            }}
                        >
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    background:
                                        "#2563eb",
                                    borderRadius:
                                        "9px",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <ShieldCheck
                                    size={23}
                                />
                            </div>

                            <span
                                style={{
                                    fontSize:
                                        "21px",
                                    fontWeight:
                                        "700",
                                }}
                            >
                                CareerGuide
                            </span>
                        </div>

                        <h2
                            style={{
                                margin:
                                    "0 0 18px",
                                fontSize:
                                    "31px",
                                lineHeight:
                                    "1.2",
                                letterSpacing:
                                    "-0.6px",
                            }}
                        >
                            Start building your
                            career today.
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#cbd5e1",
                                fontSize:
                                    "14px",
                                lineHeight:
                                    "1.7",
                                maxWidth:
                                    "340px",
                            }}
                        >
                            Create your profile and
                            get personalized career
                            guidance, skill analysis,
                            roadmaps and internship
                            recommendations.
                        </p>
                    </div>

                    {/* BENEFITS */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: "13px",
                            marginTop:
                                "50px",
                        }}
                    >
                        {[
                            "Personalized career recommendations",
                            "Skill assessment and gap analysis",
                            "Learning roadmaps and resources",
                            "Internship opportunities",
                        ].map(
                            (item) => (
                                <div
                                    key={item}
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "9px",
                                        color:
                                            "#cbd5e1",
                                        fontSize:
                                            "12px",
                                    }}
                                >
                                    <CheckCircle2
                                        size={15}
                                        color="#60a5fa"
                                    />

                                    {item}
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* ==================================
                    RIGHT SIGNUP SECTION
                ================================== */}

                <div
                    style={{
                        padding:
                            "38px 45px",
                    }}
                >
                    <div
                        style={{
                            maxWidth:
                                "540px",
                            width: "100%",
                            margin:
                                "0 auto",
                        }}
                    >
                        {/* HEADER */}

                        <div
                            style={{
                                marginBottom:
                                    "24px",
                            }}
                        >
                            <h1
                                style={{
                                    margin:
                                        "0 0 7px",
                                    fontSize:
                                        "27px",
                                    color:
                                        "#0f172a",
                                    letterSpacing:
                                        "-0.5px",
                                }}
                            >
                                Create your account
                            </h1>

                            <p
                                style={{
                                    margin: 0,
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "13px",
                                }}
                            >
                                Tell us a little about
                                yourself to personalize
                                your experience.
                            </p>
                        </div>

                        {/* ERROR */}

                        {error && (
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "flex-start",
                                    gap: "9px",
                                    padding:
                                        "10px 12px",
                                    background:
                                        "#fef2f2",
                                    border:
                                        "1px solid #fecaca",
                                    borderRadius:
                                        "8px",
                                    color:
                                        "#b91c1c",
                                    fontSize:
                                        "12px",
                                    lineHeight:
                                        "1.5",
                                    marginBottom:
                                        "17px",
                                }}
                            >
                                <AlertCircle
                                    size={16}
                                    style={{
                                        flexShrink: 0,
                                        marginTop:
                                            "1px",
                                    }}
                                />

                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            {/* ==========================
                                PERSONAL INFORMATION
                            ========================== */}

                            <div
                                style={{
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        "700",
                                    color:
                                        "#334155",
                                    marginBottom:
                                        "12px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "6px",
                                }}
                            >
                                <User
                                    size={14}
                                />

                                Personal Information
                            </div>

                            {/* NAME + EMAIL */}

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "12px",
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                {/* NAME */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Full Name
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <User
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            autoComplete="name"
                                            style={
                                                inputStyle
                                            }
                                        />
                                    </div>
                                </div>

                                {/* EMAIL */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Email
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <Mail
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            autoComplete="email"
                                            style={
                                                inputStyle
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ==========================
                                PASSWORD
                            ========================== */}

                            <div
                                style={{
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        "700",
                                    color:
                                        "#334155",
                                    marginBottom:
                                        "12px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "6px",
                                }}
                            >
                                <Lock
                                    size={14}
                                />

                                Security
                            </div>

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "12px",
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                {/* PASSWORD */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Password
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <Lock
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Create password"
                                            value={
                                                form.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            autoComplete="new-password"
                                            style={{
                                                ...inputStyle,
                                                paddingRight:
                                                    "40px",
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            style={{
                                                position:
                                                    "absolute",
                                                right:
                                                    "8px",
                                                top:
                                                    "50%",
                                                transform:
                                                    "translateY(-50%)",
                                                border:
                                                    "none",
                                                background:
                                                    "transparent",
                                                color:
                                                    "#64748b",
                                                cursor:
                                                    "pointer",
                                                padding:
                                                    "4px",
                                            }}
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    size={
                                                        16
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        16
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {/* PASSWORD STRENGTH */}

                                    {form.password && (
                                        <div
                                            style={{
                                                marginTop:
                                                    "7px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height:
                                                        "4px",
                                                    background:
                                                        "#e2e8f0",
                                                    borderRadius:
                                                        "10px",
                                                    overflow:
                                                        "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height:
                                                            "100%",
                                                        width:
                                                            passwordStrength.width,
                                                        background:
                                                            passwordStrength.level ===
                                                            1
                                                                ? "#dc2626"
                                                                : passwordStrength.level ===
                                                                  2
                                                                ? "#d97706"
                                                                : "#16a34a",
                                                        transition:
                                                            "width 0.2s ease",
                                                    }}
                                                />
                                            </div>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginTop:
                                                        "4px",
                                                    fontSize:
                                                        "10px",
                                                    color:
                                                        "#64748b",
                                                }}
                                            >
                                                <span>
                                                    Use 6+
                                                    characters
                                                </span>

                                                <strong
                                                    style={{
                                                        color:
                                                            passwordStrength.level ===
                                                            1
                                                                ? "#dc2626"
                                                                : passwordStrength.level ===
                                                                  2
                                                                ? "#d97706"
                                                                : "#16a34a",
                                                    }}
                                                >
                                                    {
                                                        passwordStrength.label
                                                    }
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Confirm Password
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <Lock
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm password"
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(
                                                e
                                            ) => {
                                                setConfirmPassword(
                                                    e
                                                        .target
                                                        .value
                                                );

                                                if (
                                                    error
                                                ) {
                                                    setError(
                                                        ""
                                                    );
                                                }
                                            }}
                                            autoComplete="new-password"
                                            style={{
                                                ...inputStyle,
                                                paddingRight:
                                                    "40px",
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            style={{
                                                position:
                                                    "absolute",
                                                right:
                                                    "8px",
                                                top:
                                                    "50%",
                                                transform:
                                                    "translateY(-50%)",
                                                border:
                                                    "none",
                                                background:
                                                    "transparent",
                                                color:
                                                    "#64748b",
                                                cursor:
                                                    "pointer",
                                                padding:
                                                    "4px",
                                            }}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    size={
                                                        16
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        16
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {confirmPassword && (
                                        <div
                                            style={{
                                                marginTop:
                                                    "6px",
                                                fontSize:
                                                    "10px",
                                                color:
                                                    form.password ===
                                                    confirmPassword
                                                        ? "#15803d"
                                                        : "#dc2626",
                                            }}
                                        >
                                            {form.password ===
                                            confirmPassword
                                                ? "Passwords match"
                                                : "Passwords do not match"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ==========================
                                EDUCATION
                            ========================== */}

                            <div
                                style={{
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        "700",
                                    color:
                                        "#334155",
                                    marginBottom:
                                        "12px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "6px",
                                }}
                            >
                                <GraduationCap
                                    size={15}
                                />

                                Education & Career
                            </div>

                            {/* EDUCATION + COLLEGE */}

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "12px",
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                {/* EDUCATION */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Education
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <GraduationCap
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            name="education"
                                            placeholder="e.g. B.Tech CSE"
                                            value={
                                                form.education
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={
                                                inputStyle
                                            }
                                        />
                                    </div>
                                </div>

                                {/* COLLEGE */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        College
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <Building2
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            name="college"
                                            placeholder="College name"
                                            value={
                                                form.college
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={
                                                inputStyle
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* YEAR + CAREER */}

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "0.7fr 1.3fr",
                                    gap: "12px",
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                {/* YEAR */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Current Year
                                    </label>

                                    <div
                                        style={
                                            inputWrapperStyle
                                        }
                                    >
                                        <CalendarDays
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <input
                                            name="year"
                                            placeholder="e.g. 2nd"
                                            value={
                                                form.year
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={
                                                inputStyle
                                            }
                                        />
                                    </div>
                                </div>

                                {/* CAREER */}

                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#475569",
                                        }}
                                    >
                                        Target Career
                                    </label>

                                    <div
                                        style={{
                                            position:
                                                "relative",
                                        }}
                                    >
                                        <BriefcaseBusiness
                                            size={
                                                16
                                            }
                                            style={
                                                iconStyle
                                            }
                                        />

                                        <select
                                            name="targetCareer"
                                            value={
                                                form.targetCareer
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={{
                                                width:
                                                    "100%",
                                                boxSizing:
                                                    "border-box",
                                                padding:
                                                    "11px 12px 11px 39px",
                                                border:
                                                    "1px solid #cbd5e1",
                                                borderRadius:
                                                    "8px",
                                                background:
                                                    "#ffffff",
                                                color:
                                                    form.targetCareer
                                                        ? "#0f172a"
                                                        : "#94a3b8",
                                                fontSize:
                                                    "13px",
                                                outline:
                                                    "none",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            <option value="">
                                                Select career
                                            </option>

                                            <option value="Software Developer">
                                                Software Developer
                                            </option>

                                            <option value="Full Stack Developer">
                                                Full Stack Developer
                                            </option>

                                            <option value="Data Scientist">
                                                Data Scientist
                                            </option>

                                            <option value="AI/ML Engineer">
                                                AI/ML Engineer
                                            </option>

                                            <option value="DevOps Engineer">
                                                DevOps Engineer
                                            </option>

                                            <option value="Cloud Engineer">
                                                Cloud Engineer
                                            </option>

                                            <option value="Data Analyst">
                                                Data Analyst
                                            </option>

                                            <option value="Cybersecurity Analyst">
                                                Cybersecurity Analyst
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* TERMS */}

                            <label
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "flex-start",
                                    gap: "8px",
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "11px",
                                    lineHeight:
                                        "1.5",
                                    cursor:
                                        "pointer",
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        agreeTerms
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setAgreeTerms(
                                            e
                                                .target
                                                .checked
                                        )
                                    }
                                    style={{
                                        width:
                                            "15px",
                                        height:
                                            "15px",
                                        margin:
                                            "1px 0 0",
                                        accentColor:
                                            "#2563eb",
                                        cursor:
                                            "pointer",
                                        flexShrink: 0,
                                    }}
                                />

                                <span>
                                    I agree to the{" "}
                                    <Link
                                        to="/terms"
                                        style={{
                                            color:
                                                "#2563eb",
                                            textDecoration:
                                                "none",
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        to="/privacy"
                                        style={{
                                            color:
                                                "#2563eb",
                                            textDecoration:
                                                "none",
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                style={{
                                    width:
                                        "100%",
                                    height:
                                        "44px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    gap: "8px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "8px",
                                    background:
                                        loading
                                            ? "#93c5fd"
                                            : "#2563eb",
                                    color:
                                        "#ffffff",
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "600",
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                {loading ? (
                                    "Creating account..."
                                ) : (
                                    <>
                                        Create Account

                                        <ArrowRight
                                            size={
                                                16
                                            }
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* LOGIN */}

                        <div
                            style={{
                                textAlign:
                                    "center",
                                marginTop:
                                    "19px",
                                paddingTop:
                                    "17px",
                                borderTop:
                                    "1px solid #e2e8f0",
                                color:
                                    "#64748b",
                                fontSize:
                                    "12px",
                            }}
                        >
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                style={{
                                    color:
                                        "#2563eb",
                                    textDecoration:
                                        "none",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Sign in
                            </Link>
                        </div>

                        {/* SECURITY */}

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "center",
                                alignItems:
                                    "center",
                                gap: "6px",
                                marginTop:
                                    "15px",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "10px",
                            }}
                        >
                            <ShieldCheck
                                size={13}
                            />

                            Your information is
                            securely protected.
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================
                RESPONSIVE STYLES
            ================================== */}

            <style>
                {`
                    @media (max-width: 850px) {
                        div[style*="0.85fr 1.15fr"] {
                            grid-template-columns: 1fr !important;
                        }

                        div[style*="background: #0f172a"] {
                            display: none !important;
                        }
                    }

                    @media (max-width: 600px) {
                        div[style*="1fr 1fr"] {
                            grid-template-columns: 1fr !important;
                        }

                        div[style*="0.7fr 1.3fr"] {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    input:focus,
                    select:focus {
                        border-color: #2563eb !important;
                        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
                    }

                    button[type="submit"]:hover:not(:disabled) {
                        background: #1d4ed8 !important;
                    }
                `}
            </style>
        </div>
    );
}

export default Signup;