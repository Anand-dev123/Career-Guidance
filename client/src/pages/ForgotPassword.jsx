import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================================
    // Validate Email
    // ==========================================

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      // ==========================================
      // Success Message
      // ==========================================

      setSuccess(
        response.data.message ||
          "Account verified successfully."
      );

      // ==========================================
      // Get Reset URL
      // ==========================================

      const resetUrl = response.data.resetUrl;

      if (resetUrl) {
        /*
         * Small delay so user can see
         * the success message before
         * moving to the reset page.
         */

        setTimeout(() => {
          try {
            const resetPath =
              new URL(resetUrl).pathname;

            navigate(resetPath);
          } catch (error) {
            console.error(
              "Reset URL error:",
              error
            );

            setError(
              "Unable to open the password reset page."
            );
          }
        }, 800);
      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* ==================================
            LEFT SECTION
        ================================== */}

        <div style={styles.leftSection}>

          {/* Brand */}

          <div style={styles.brand}>

            <div style={styles.brandIcon}>
              <ShieldCheck size={24} />
            </div>

            <span>CareerGuide</span>

          </div>


          {/* Content */}

          <div style={styles.leftContent}>

            <h1 style={styles.leftTitle}>
              Get back into your account.
            </h1>

            <p style={styles.leftText}>
              Reset your password and continue
              your personalized career journey.
            </p>


            <div style={styles.feature}>
              <CheckCircle2 size={20} />
              <span>
                Secure password recovery
              </span>
            </div>


            <div style={styles.feature}>
              <CheckCircle2 size={20} />
              <span>
                Quick account recovery
              </span>
            </div>


            <div style={styles.feature}>
              <CheckCircle2 size={20} />
              <span>
                Your existing data stays safe
              </span>
            </div>

          </div>

        </div>


        {/* ==================================
            RIGHT SECTION
        ================================== */}

        <div style={styles.rightSection}>

          <div style={styles.formWrapper}>

            {/* Icon */}

            <div style={styles.iconContainer}>
              <Mail size={26} />
            </div>


            {/* Title */}

            <h2 style={styles.title}>
              Forgot Password?
            </h2>


            <p style={styles.subtitle}>
              Enter the email address associated
              with your CareerGuide account.
            </p>


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (
              <div style={styles.errorBox}>

                <AlertCircle size={18} />

                <span>
                  {error}
                </span>

              </div>
            )}


            {/* ==================================
                SUCCESS MESSAGE
            ================================== */}

            {success && (
              <div style={styles.successBox}>

                <CheckCircle2 size={18} />

                <span>
                  {success}
                </span>

              </div>
            )}


            {/* ==================================
                FORM
            ================================== */}

            <form onSubmit={handleSubmit}>

              <label style={styles.label}>
                Email Address
              </label>


              <div style={styles.inputWrapper}>

                <Mail
                  size={19}
                  style={styles.inputIcon}
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  style={styles.input}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>


              {/* ==================================
                  SUBMIT BUTTON
              ================================== */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >

                {loading
                  ? "Checking Account..."
                  : "Continue to Reset Password"}

                {!loading && (
                  <ArrowRight size={19} />
                )}

              </button>

            </form>


            {/* ==================================
                BACK TO LOGIN
            ================================== */}

            <Link
              to="/login"
              style={styles.backLink}
            >

              <ArrowLeft size={17} />

              Back to Login

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

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


  // ==========================================
  // LEFT
  // ==========================================

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


  // ==========================================
  // RIGHT
  // ==========================================

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


  // ==========================================
  // FORM
  // ==========================================

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  },


  inputWrapper: {
    position: "relative",
    marginBottom: "20px",
  },


  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94A3B8",
    pointerEvents: "none",
  },


  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "50px",
    border: "1px solid #CBD5E1",
    borderRadius: "9px",
    padding: "0 15px 0 45px",
    fontSize: "15px",
    outline: "none",
    color: "#0F172A",
  },


  button: {
    width: "100%",
    minHeight: "50px",
    border: "none",
    borderRadius: "9px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "0 16px",
  },


  // ==========================================
  // ERROR
  // ==========================================

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


  // ==========================================
  // SUCCESS
  // ==========================================

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


  // ==========================================
  // BACK LINK
  // ==========================================

  backLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    marginTop: "24px",
    color: "#475569",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

};


export default ForgotPassword;