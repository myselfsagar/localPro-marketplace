const express = require("express");
const publicController = require("../controllers/public.controller");
const router = express.Router();

// GET /providers - The main page to browse all providers
router.get("/providers", publicController.getAllProvidersPage);

// GET /providers/:id - The detail page for a single provider
router.get("/providers/:id", publicController.getProviderById);

module.exports = router;
