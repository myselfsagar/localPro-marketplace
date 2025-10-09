const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();

//Middlewares
app.use(express.json());

// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the directory for EJS templates
app.set("views", path.join(__dirname, "src", "views"));

// Serve static files (CSS, client-side JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "src", "public")));

// --- Routes --- //

// A simple route for the homepage
app.get("/", (req, res) => {
  // Render the index.ejs template from the 'views/pages' directory
  res.render("pages/index", {
    pageTitle: "Welcome to LocalPro",
  });
});

// --- Start the Server --- //
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
