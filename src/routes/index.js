const router = (express = require("express").Router());

//routes
const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const providerRoutes = require("./provider.routes");
const publicRoutes = require("./public.routes");
const bookingRoutes = require("./booking.routes");

router.use(authRoutes);
router.use(dashboardRoutes);
router.use("/provider", providerRoutes);
router.use(publicRoutes);
router.use("/book", bookingRoutes);

module.exports = router;
