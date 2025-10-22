const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const brevoApi = require("../config/brevo.config");

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

async function generateResetToken(email) {
  // 1. Find the user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // We don't throw an error, for security reasons.
    // Just pretend we sent the email.
    return;
  }

  // 2. Generate a secure token
  const token = crypto.randomBytes(32).toString("hex");

  // 3. Set expiry time (1 hour from now)
  const expiry = new Date(Date.now() + 3600000);

  // 4. Save token and expiry to the user in the DB
  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  // 5. Create the reset link
  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

  // 6. Send the email via Brevo
  const sendSmtpEmail = {
    to: [{ email: user.email, name: user.firstName }],
    sender: { email: "ssahu6244@gmail.com", name: "LocalPro Support" },
    subject: "Your Password Reset Link for LocalPro",
    htmlContent: `
      <p>Hello ${user.firstName},</p>
      <p>You requested a password reset. Click the link below to set a new password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}">Reset Your Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await brevoApi.sendTransacEmail(sendSmtpEmail);
}

async function validateResetToken(token) {
  // Find a user with this token AND where the token hasn't expired
  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: { [Op.gt]: Date.now() },
    },
  });

  return user; // Will be null if token is invalid or expired
}

async function resetPassword(token, newPassword) {
  // 1. Validate the token again
  const user = await validateResetToken(token);
  if (!user) {
    throw new Error("Token is invalid or has expired.");
  }

  // 2. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // 3. Update user's password and clear the token fields
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return user;
}

module.exports = {
  registerUser,
  generateResetToken,
  validateResetToken,
  resetPassword,
};
