import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return "";

    if (password.length < 6) {
      return "Weak";
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const passwordStrength =
    getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================
    // Validate Token
    // ==========================

    if (!token) {
      setError(
        "Invalid password reset link."
      );
      return;
    }

    // ==========================
    // Validate Password
    // ==========================

    if (!password) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // ==========================
    // Confirm Password
    // ==========================

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setSuccess(
        response.data.message ||
          "Password reset successful."
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Left Section */}
        <div style={styles.leftSection}>

          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <ShieldCheck size={24} />
            </div>

            <span>CareerGuide</span>
          </div>

          <div style={styles.leftContent}>

            <h1 style={styles.leftTitle}>
              Create a new password.
            </h1>

            <p style={styles.leftText}>
              Choose a strong password to protect
              your CareerGuide account.
            </p>

            <div style={styles.feature}>
              <CheckCircle2 size={20} />
              <span>At least 6 characters</span>
            </div>

            <div style={styles.feature}>
              <CheckCircle2 size={20} />
              <span>Use a unique password</span>
            </div>

            <div style={styles.feature}>
              <CheckCircle2 size={20} />
              <span>Keep your account secure</span>
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div style={styles.rightSection}>

          <div style={styles.formWrapper}>

            <div style={styles.iconContainer}>
              <Lock size={26} />
            </div>

            <h2 style={styles.title}>
              Reset Password
            </h2>

            <p style={styles.subtitle}>
              Enter your new password below.
            </p>

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={styles.successBox}>
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* New Password */}
              <label style={styles.label}>
                New Password
              </label>

              <div style={styles.inputWrapper}>

                <Lock
                  size={19}
                  style={styles.inputIcon}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  style={styles.input}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              {/* Password Strength */}
              {password && (
                <div
                  style={{
                    ...styles.strength,
                    color:
                      passwordStrength === "Strong"
                        ? "#15803D"
                        : passwordStrength === "Medium"
                        ? "#B45309"
                        : "#B91C1C",
                  }}
                >
                  Password strength:{" "}
                  <strong>
                    {passwordStrength}
                  </strong>
                </div>
              )}

              {/* Confirm Password */}
              <label style={styles.label}>
                Confirm Password
              </label>

              <div style={styles.inputWrapper}>

                <Lock
                  size={19}
                  style={styles.inputIcon}
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  style={styles.input}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}

                {!loading && (
                  <ArrowRight size={19} />
                )}
              </button>

            </form>

            <Link
              to="/login"
              style={styles.loginLink}
            >
              Back to Login
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    minHeight: "650px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "18px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.08)",
  },

  leftSection: {
    background: "#0F172A",
    color: "#FFFFFF",
    padding: "52px",
    display: "flex",
    flexDirection: "column",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    fontSize: "21px",
    fontWeight: "700",
  },

  brandIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  leftContent: {
    marginTop: "120px",
    maxWidth: "400px",
  },

  leftTitle: {
    fontSize: "38px",
    lineHeight: "1.15",
    margin: "0 0 18px",
    fontWeight: "700",
    letterSpacing: "-0.8px",
  },

  leftText: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#CBD5E1",
    marginBottom: "32px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#E2E8F0",
    fontSize: "15px",
    marginBottom: "18px",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
  },

  formWrapper: {
    width: "100%",
    maxWidth: "420px",
  },

  iconContainer: {
    width: "54px",
    height: "54px",
    borderRadius: "12px",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "22px",
  },

  title: {
    fontSize: "30px",
    color: "#0F172A",
    margin: "0 0 10px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#64748B",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 28px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  },

  inputWrapper: {
    position: "relative",
    marginBottom: "10px",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94A3B8",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "50px",
    border: "1px solid #CBD5E1",
    borderRadius: "9px",
    padding: "0 45px",
    fontSize: "15px",
    outline: "none",
    color: "#0F172A",
  },

  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#64748B",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  strength: {
    fontSize: "12px",
    marginBottom: "18px",
  },

  button: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "9px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    marginTop: "12px",
  },

  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    background: "#FEF2F2",
    color: "#B91C1C",
    border: "1px solid #FECACA",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    marginBottom: "20px",
  },

  successBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    background: "#F0FDF4",
    color: "#15803D",
    border: "1px solid #BBF7D0",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    marginBottom: "20px",
  },

  loginLink: {
    display: "block",
    textAlign: "center",
    marginTop: "24px",
    color: "#475569",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default ResetPassword;