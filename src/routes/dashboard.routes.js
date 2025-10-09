const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard", isAuthenticated, dashboardController.getDashboardPage);

module.exports = router;
