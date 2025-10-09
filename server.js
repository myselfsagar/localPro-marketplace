const express = require("express");
require("dotenv").config();
const path = require("path");
const sequelize = require("./src/config/db.config");
const authRoutes = require("./src/routes/auth.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const session = require("express-session");
const passport = require("passport");
const app = express();

//models
const User = require("./src/models/user.model");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session Configuration --- //
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hhdshi$&jhdh>:@!)jfj045+-j75",
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      httpOnly: true, // Best practice for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // Session expires in 24 hours
    },
  })
);

// --- Initialize Passport and Session --- //
require("./src/config/passport.config"); // This executes the passport config file
app.use(passport.initialize());
app.use(passport.session());

// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the directory for EJS templates
app.set("views", path.join(__dirname, "src", "views"));

// Serve static files (CSS, client-side JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "src", "public")));

// --- Custom Middleware to Make User Available in All Views --- //
app.use((req, res, next) => {
  res.locals.user = req.user; // Makes user object available in all EJS templates
  next();
});

// --- Routes --- //
app.use(authRoutes);
app.use(dashboardRoutes);

// A simple route for the homepage
app.get("/", (req, res) => {
  // Render the index.ejs template from the 'views/pages' directory
  res.render("pages/index", {
    pageTitle: "Welcome to LocalPro",
  });
});

// --- Database Connection Test & Start Server --- //
const PORT = process.env.PORT || 4001;
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
    await sequelize.sync();
    console.log("✅ All models were synchronized successfully.");

    app.listen(PORT, () => {
      console.log("Listening on PORT", PORT);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();
