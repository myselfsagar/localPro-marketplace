const session = require("express-session");
require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "hhdshi$&jhdh>:@!)jfj045+-j75",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

module.exports = sessionMiddleware;
