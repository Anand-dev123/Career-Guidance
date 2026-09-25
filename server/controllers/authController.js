const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ======================================================
// SIGNUP
// ======================================================

const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            education,
            college,
            year,
            targetCareer
        } = req.body;

        // ==========================
        // Required Fields
        // ==========================

        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        // ==========================
        // Check Existing User
        // ==========================

        const existingUser =
            await User.findOne({
                email: email.toLowerCase().trim()
            });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User already exists"
            });
        }

        // ==========================
        // Hash Password
        // ==========================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // ==========================
        // Create User
        // ==========================

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            education,
            college,
            year,
            targetCareer
        });

        // ==========================
        // Generate JWT
        // ==========================

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // ==========================
        // Response
        // ==========================

        res.status(201).json({
            message:
                "Signup successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetCareer:
                    user.targetCareer,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Signup error:",
            error.message
        );

        res.status(500).json({
            message:
                "Signup failed"
        });
    }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // ==========================
        // Required Fields
        // ==========================

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        // ==========================
        // Find User
        // ==========================

        const user =
            await User.findOne({
                email: email.toLowerCase().trim()
            });

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        // ==========================
        // Compare Password
        // ==========================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        // ==========================
        // Generate JWT
        // ==========================

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // ==========================
        // Login Response
        // ==========================

        res.json({
            message:
                "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetCareer:
                    user.targetCareer,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        res.status(500).json({
            message:
                "Login failed"
        });
    }
};


// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        // ==========================
        // Validate Email
        // ==========================

        if (!email) {
            return res.status(400).json({
                message:
                    "Email is required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        // ==========================
        // Find User
        // ==========================

        const user =
            await User.findOne({
                email: normalizedEmail
            });

        if (!user) {
            return res.status(404).json({
                message:
                    "No account found with this email address."
            });
        }

        // ==========================
        // Generate Secure Token
        // ==========================

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        // ==========================
        // Hash Token
        // ==========================

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

        // ==========================
        // Save Token
        // ==========================

        user.resetPasswordToken =
            hashedToken;

        // Token valid for 15 minutes
        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        // ==========================
        // Create Frontend Reset URL
        // ==========================

        const resetUrl =
            `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

        // ==========================
        // Response
        // ==========================

        res.json({
            message:
                "Account verified. Continue to reset your password.",

            resetUrl
        });

    } catch (error) {

        console.error(
            "Forgot password error:",
            error.message
        );

        res.status(500).json({
            message:
                "Unable to process password reset request"
        });
    }
};


// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
    try {

        const { token } = req.params;

        const { password } = req.body;

        // ==========================
        // Validate Token
        // ==========================

        if (!token) {
            return res.status(400).json({
                message:
                    "Reset token is required"
            });
        }

        // ==========================
        // Validate Password
        // ==========================

        if (!password) {
            return res.status(400).json({
                message:
                    "New password is required"
            });
        }

        // ==========================
        // Password Length
        // ==========================

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        // ==========================
        // Hash Received Token
        // ==========================

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

        // ==========================
        // Find Valid User
        // ==========================

        const user =
            await User.findOne({
                resetPasswordToken:
                    hashedToken,

                resetPasswordExpires: {
                    $gt: Date.now()
                }
            });

        // ==========================
        // Invalid / Expired Token
        // ==========================

        if (!user) {
            return res.status(400).json({
                message:
                    "Password reset link is invalid or expired."
            });
        }

        // ==========================
        // Hash New Password
        // ==========================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // ==========================
        // Update Password
        // ==========================

        user.password =
            hashedPassword;

        // ==========================
        // Remove Reset Token
        // ==========================

        user.resetPasswordToken = null;

        user.resetPasswordExpires = null;

        await user.save();

        // ==========================
        // Success Response
        // ==========================

        res.json({
            message:
                "Password reset successful. You can now login with your new password."
        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error.message
        );

        res.status(500).json({
            message:
                "Unable to reset password"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
};