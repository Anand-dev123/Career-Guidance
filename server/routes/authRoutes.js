const express = require("express");

const {
    signup,
    login,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const router = express.Router();

// ==========================
// AUTH
// ==========================

router.post("/signup", signup);

router.post("/login", login);

// ==========================
// PASSWORD RESET
// ==========================

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);

module.exports = router;