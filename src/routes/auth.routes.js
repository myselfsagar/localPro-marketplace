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
    // failureFlash: true // Optional: if we want to show flash messages
  })
);

// --- Logout Route --- //
router.get("/logout", authController.logout);

module.exports = router;
