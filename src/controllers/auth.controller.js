const authService = require("../services/auth.service"); // Import the service

const getSignupPage = async (req, res) => {
  res.render("pages/signup", {
    pageTitle: "Signup",
  });
};

const postSignup = async (req, res) => {
  try {
    await authService.registerUser(req.body);

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
    res.redirect("/");
  });
};

module.exports = {
  getSignupPage,
  postSignup,
  getLoginPage,
  logout,
};
