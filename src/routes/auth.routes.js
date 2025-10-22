const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const passport = require("passport");

// Signup routes
router.get("/signup", authController.getSignupPage);
router.post("/signup", authController.postSignup);

// --- Login Routes --- //
router.get("/login", authController.getLoginPage);

// This route uses passport.authenticate() as middleware
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard", // Redirect to dashboard on successful login
    failureRedirect: "/login", // Redirect back to login on failure
    failureFlash: true,
  })
);

// --- Logout Route --- //
router.get("/logout", authController.logout);

// --- PASSWORD RESET ROUTES --- //

// GET /forgot-password - Show form to request reset
router.get("/forgot-password", authController.getForgotPasswordPage);

// POST /forgot-password - Handle the email submission
router.post("/forgot-password", authController.postForgotPassword);

// GET /reset-password/:token - Show form to set new password
router.get("/reset-password/:token", authController.getResetPasswordPage);

// POST /reset-password - Handle the new password submission
router.post("/reset-password", authController.postResetPassword);

module.exports = router;
