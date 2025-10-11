const router = (express = require("express").Router());

//routes
const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const providerRoutes = require("./provider.routes");

router.use(authRoutes);
router.use(dashboardRoutes);
router.use("/provider", providerRoutes);

module.exports = router;
