const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  getProfile,
  googleCallback,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Local authentication routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);

// Google OAuth routes
// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false,
  }),
  googleCallback
);

module.exports = router;
