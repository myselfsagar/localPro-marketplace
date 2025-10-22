const authService = require("../services/auth.service"); // Import the service

const getSignupPage = async (req, res) => {
  res.render("pages/signup", {
    pageTitle: "Signup",
  });
};

const postSignup = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    req.flash("success_msg", "You are now registered and can log in!");
    res.redirect("/login");
  } catch (error) {
    console.log("Error during signup:", error.message);
    res.redirect("/signup");
  }
};

// --- Login Functions --- //
const getLoginPage = (req, res) => {
  res.render("pages/login", {
    pageTitle: "Login",
  });
};

// --- Logout Function --- //
const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You have been logged out.");
    res.redirect("/");
  });
};

// --- PASSWORD RESET CONTROLLERS --- //

const getForgotPasswordPage = (req, res) => {
  res.render("pages/forgot-password", {
    pageTitle: "Forgot Password",
  });
};

const postForgotPassword = async (req, res) => {
  try {
    await authService.generateResetToken(req.body.email);
    req.flash(
      "success_msg",
      "If your email is registered, you will receive a password reset link."
    );
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Something went wrong. Please try again.");
    res.redirect("/forgot-password");
  }
};

const getResetPasswordPage = async (req, res) => {
  try {
    const token = req.params.token;
    // Check if the token is valid before rendering the page
    const user = await authService.validateResetToken(token);

    if (!user) {
      req.flash("error_msg", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot-password");
    }

    // If valid, render the page and pass the token to the view
    res.render("pages/reset-password", {
      pageTitle: "Reset Password",
      token: token,
    });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Something went wrong.");
    res.redirect("/forgot-password");
  }
};

const postResetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error_msg", "Passwords do not match.");
    return res.redirect(`/reset-password/${token}`); // Redirect back to the same form
  }

  try {
    await authService.resetPassword(token, password);
    req.flash(
      "success_msg",
      "Your password has been reset! You can now log in."
    );
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash(
      "error_msg",
      "Failed to reset password. The token may be invalid or expired."
    );
    res.redirect("/forgot-password");
  }
};

module.exports = {
  getSignupPage,
  postSignup,
  getLoginPage,
  logout,
  getForgotPasswordPage,
  postForgotPassword,
  getResetPasswordPage,
  postResetPassword,
};
