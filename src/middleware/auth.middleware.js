// This function checks if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  // req.isAuthenticated() is a method added by Passport.js
  if (req.isAuthenticated()) {
    // If user is logged in, proceed to the next function in the chain
    return next();
  }

  // If user is not logged in, redirect them to the login page
  res.redirect("/login");
};
