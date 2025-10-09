const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// The 'local' strategy for username/password authentication
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Using email as the "username"
    async (email, password, done) => {
      try {
        // 1. Find the user with the given email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          // 'done' is a callback. First arg is error, second is user, third is message.
          return done(null, false, { message: "Incorrect email or password." });
        }

        // 2. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // 3. If everything is correct, return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Stores user ID in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieves user details from the session using the ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
