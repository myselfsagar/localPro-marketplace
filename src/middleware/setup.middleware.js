const passport = require("passport");
const flash = require("connect-flash");

function setupMiddleware(app) {
  // Initialize Passport and Session
  require("../config/passport.config"); // Executes passport config
  app.use(passport.initialize());
  app.use(passport.session());

  // Flash Message Middleware
  app.use(flash());

  // Custom middleware for flash messages and user locals
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error");
    res.locals.user = req.user; // Make user available in all views
    next();
  });
}

module.exports = setupMiddleware;
