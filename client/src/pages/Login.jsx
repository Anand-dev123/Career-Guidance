import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [rememberMe, setRememberMe] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] =
        useState(false);

    // ==========================================
    // HANDLE INPUT
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
    // VALIDATION
    // ==========================================

    const validateForm = () => {
        if (!form.email.trim()) {
            return "Please enter your email address.";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            return "Please enter a valid email address.";
        }

        if (!form.password) {
            return "Please enter your password.";
        }

        if (form.password.length < 6) {
            return "Password must contain at least 6 characters.";
        }

        return "";
    };

    // ==========================================
    // LOGIN
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
                    "/auth/login",
                    {
                        email:
                            form.email
                                .trim()
                                .toLowerCase(),
                        password:
                            form.password,
                    }
                );

            const user =
                response.data.user;

            const token =
                response.data.token;

            // ==================================
            // SAVE AUTH DATA
            // ==================================

            if (rememberMe) {
                localStorage.setItem(
                    "token",
                    token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );
            } else {
                // Current application uses
                // localStorage for protected routes.
                localStorage.setItem(
                    "token",
                    token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                localStorage.removeItem(
                    "rememberMe"
                );
            }

            // ==================================
            // ROLE BASED REDIRECT
            // ==================================

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                    "Invalid email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
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
                    maxWidth: "1040px",
                    minHeight: "620px",
                    background: "#ffffff",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
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
                        padding: "50px",
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
                                    "70px",
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
                                    letterSpacing:
                                        "-0.3px",
                                }}
                            >
                                CareerGuide
                            </span>
                        </div>

                        <h2
                            style={{
                                margin: "0 0 18px",
                                fontSize:
                                    "34px",
                                lineHeight:
                                    "1.2",
                                letterSpacing:
                                    "-0.7px",
                            }}
                        >
                            Build your career
                            with confidence.
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#cbd5e1",
                                fontSize:
                                    "15px",
                                lineHeight:
                                    "1.7",
                                maxWidth:
                                    "390px",
                            }}
                        >
                            Discover career paths,
                            assess your skills,
                            build learning roadmaps
                            and find opportunities
                            that match your goals.
                        </p>
                    </div>

                    {/* FEATURES */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: "13px",
                        }}
                    >
                        {[
                            "Personalized career guidance",
                            "Skill assessment and gap analysis",
                            "Internship recommendations",
                        ].map(
                            (feature) => (
                                <div
                                    key={feature}
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "9px",
                                        color:
                                            "#cbd5e1",
                                        fontSize:
                                            "13px",
                                    }}
                                >
                                    <CheckCircle2
                                        size={16}
                                        color="#60a5fa"
                                    />

                                    {feature}
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* ==================================
                    RIGHT LOGIN SECTION
                ================================== */}

                <div
                    style={{
                        padding: "50px",
                        display: "flex",
                        flexDirection:
                            "column",
                        justifyContent:
                            "center",
                    }}
                >
                    <div
                        style={{
                            maxWidth:
                                "390px",
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        {/* HEADING */}

                        <div
                            style={{
                                marginBottom:
                                    "30px",
                            }}
                        >
                            <h1
                                style={{
                                    margin:
                                        "0 0 8px",
                                    fontSize:
                                        "28px",
                                    color:
                                        "#0f172a",
                                    letterSpacing:
                                        "-0.5px",
                                }}
                            >
                                Welcome back
                            </h1>

                            <p
                                style={{
                                    margin: 0,
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                Sign in to continue
                                to your account.
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
                                        "11px 12px",
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
                                        "18px",
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
                            {/* EMAIL */}

                            <div
                                style={{
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "7px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "600",
                                        color:
                                            "#334155",
                                    }}
                                >
                                    Email address
                                </label>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <Mail
                                        size={17}
                                        style={{
                                            position:
                                                "absolute",
                                            left:
                                                "12px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            color:
                                                "#94a3b8",
                                        }}
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
                                        style={{
                                            width:
                                                "100%",
                                            boxSizing:
                                                "border-box",
                                            padding:
                                                "12px 12px 12px 40px",
                                            border:
                                                "1px solid #cbd5e1",
                                            borderRadius:
                                                "8px",
                                            fontSize:
                                                "14px",
                                            color:
                                                "#0f172a",
                                            outline:
                                                "none",
                                            background:
                                                "#ffffff",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}

                            <div
                                style={{
                                    marginBottom:
                                        "12px",
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        marginBottom:
                                            "7px",
                                    }}
                                >
                                    <label
                                        style={{
                                            fontSize:
                                                "13px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#334155",
                                        }}
                                    >
                                        Password
                                    </label>

                                    {/* FORGOT PASSWORD */}

                                    <Link
                                        to="/forgot-password"
                                        style={{
                                            color:
                                                "#2563eb",
                                            textDecoration:
                                                "none",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <Lock
                                        size={17}
                                        style={{
                                            position:
                                                "absolute",
                                            left:
                                                "12px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            color:
                                                "#94a3b8",
                                        }}
                                    />

                                    <input
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={
                                            form.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="current-password"
                                        style={{
                                            width:
                                                "100%",
                                            boxSizing:
                                                "border-box",
                                            padding:
                                                "12px 42px 12px 40px",
                                            border:
                                                "1px solid #cbd5e1",
                                            borderRadius:
                                                "8px",
                                            fontSize:
                                                "14px",
                                            color:
                                                "#0f172a",
                                            outline:
                                                "none",
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
                                                "10px",
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
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={
                                                    17
                                                }
                                            />
                                        ) : (
                                            <Eye
                                                size={
                                                    17
                                                }
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* REMEMBER ME */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    marginBottom:
                                        "22px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "8px",
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            "12px",
                                        color:
                                            "#64748b",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            rememberMe
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setRememberMe(
                                                e.target
                                                    .checked
                                            )
                                        }
                                        style={{
                                            width:
                                                "15px",
                                            height:
                                                "15px",
                                            accentColor:
                                                "#2563eb",
                                            cursor:
                                                "pointer",
                                        }}
                                    />

                                    Remember me
                                </label>
                            </div>

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                style={{
                                    width:
                                        "100%",
                                    height:
                                        "45px",
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
                                        "14px",
                                    fontWeight:
                                        "600",
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                {loading ? (
                                    "Signing in..."
                                ) : (
                                    <>
                                        Sign in

                                        <ArrowRight
                                            size={
                                                17
                                            }
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* SIGNUP */}

                        <div
                            style={{
                                textAlign:
                                    "center",
                                marginTop:
                                    "24px",
                                paddingTop:
                                    "20px",
                                borderTop:
                                    "1px solid #e2e8f0",
                                fontSize:
                                    "13px",
                                color:
                                    "#64748b",
                            }}
                        >
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                style={{
                                    color:
                                        "#2563eb",
                                    textDecoration:
                                        "none",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Create an account
                            </Link>
                        </div>

                        {/* SECURITY NOTE */}

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
                                    "20px",
                                color:
                                    "#94a3b8",
                                fontSize:
                                    "11px",
                            }}
                        >
                            <ShieldCheck
                                size={14}
                            />

                            Your account is
                            securely protected.
                        </div>
                    </div>
                </div>
            </div>

            {/* RESPONSIVE */}

            <style>
                {`
                    @media (max-width: 800px) {
                        div[style*="grid-template-columns: 1fr 1fr"] {
                            grid-template-columns: 1fr !important;
                            min-height: auto !important;
                        }
                    }

                    @media (max-width: 500px) {
                        div[style*="grid-template-columns: 1fr 1fr"] {
                            border-radius: 10px !important;
                        }
                    }

                    input:focus {
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

export default Login;