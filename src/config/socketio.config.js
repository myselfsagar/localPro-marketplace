// src/config/socketio.config.js
const passport = require("passport");

function configureSocketIO(io, sessionMiddleware) {
  const connectedUsers = {}; // { userId: socketId }

  // Make session available to Socket.IO
  io.engine.use(sessionMiddleware);
  io.engine.use(passport.initialize());
  io.engine.use(passport.session());

  io.on("connection", (socket) => {
    const user = socket.request.user;
    if (user) {
      console.log(
        `User connected: ${user.firstName} (ID: ${user.id}), Socket ID: ${socket.id}`
      );
      connectedUsers[user.id] = socket.id;

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${user.firstName} (ID: ${user.id})`);
        if (connectedUsers[user.id] === socket.id) {
          delete connectedUsers[user.id];
        }
      });
    } else {
      console.log("Unauthenticated socket connection attempt.");
      socket.disconnect();
    }
  });

  // Function to Emit Notifications
  function emitNotification(userId, eventName, data) {
    const socketId = connectedUsers[userId];
    if (socketId) {
      io.to(socketId).emit(eventName, data);
      console.log(
        `Emitted '${eventName}' to User ID: ${userId} (Socket ID: ${socketId})`
      );
    } else {
      console.log(`User ID: ${userId} not connected for notification.`);
    }
  }

  return emitNotification; // Return the function for use in the app
}

module.exports = configureSocketIO;
