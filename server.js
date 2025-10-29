require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// --- Config Imports ---
const sequelize = require("./src/config/db.config");
const sessionMiddleware = require("./src/config/session.config");

// --- Middleware Imports ---
const setupAppMiddleware = require("./src/middleware/setup.middleware");

// --- Model & Route Imports ---
require("./src/models/index"); // Load models and associations
const routes = require("./src/routes/index");

// --- Socket.IO Setup ---
const configureSocketIO = require("./src/config/socketio.config");

// --- Initialization ---
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- Core Middleware ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json());

// --- Session Middleware ---
app.use(sessionMiddleware);

// --- Passport, Flash, Locals Middleware ---
setupAppMiddleware(app);

// --- Routes ---
app.use(routes);

// --- Socket.IO Configuration ---
const emitNotification = configureSocketIO(io, sessionMiddleware); // Configure Socket.IO
app.set("emitNotification", emitNotification); // Make emit function available

// --- Start Server ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");
    await sequelize.sync({
      /* alter: true */
    }); // Use alter if needed to update model
    console.log("✅ Models synchronized.");

    server.listen(process.env.PORT || 4000, () => {
      console.log(
        `🚀 Server running on http://localhost:${process.env.PORT || 4000}`
      );
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
  }
}

startServer();
