const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// This function contains all the logic for registering a user
async function registerUser(userData) {
  const { firstName, lastName, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // Return the created user (without the password)
  return newUser;
}

// Export the function so the controller can use it
module.exports = {
  registerUser,
};
