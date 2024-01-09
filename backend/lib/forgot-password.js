const {
  generateVerificationHash,
  verifyHash,
} = require("dbless-email-verification");

const { sendUserEmail } = require(".");
const { frontend_url } = require("../utils");
const User = require("../models/users.models");
const bcrypt = require("bcryptjs");

// Function to send email verification link to the user
const generateForgotPasswordLink = async (user) => {
  const resetPasswordHash = generateVerificationHash(
    user.email,
    process.env.JWT_SECRET_KEY,
    30
  );

  //generate a verification url and send email to client
  const resetPasswordLink = `${frontend_url}/reset-password?verification=${resetPasswordHash}-${user._id}`;

  const emailContent = `
              <p>Hello, ${user.username},</p>
              <p>Please click on the link below to reset your PTM account password</p>
              <p>Reset password link: <a href='${resetPasswordLink}'>Reset Password</a></p>
              <p>or copy and paste this link into your browser: ${resetPasswordLink}</p>
              <p>Ignore this message if you did not request a password reset.</p>
              `;

  const messageSent = await sendUserEmail(
    user.email,
    "Reset Your Password",
    emailContent
  );

  return {
    messageSent,
    resetPasswordHash,
  };
};

// Function to send email verification link to the user
const resetAccountPassword = async (resetPasswordHash, email, password) => {
  const verifyResetPasswordHash = verifyHash(
    resetPasswordHash,
    email,
    process.env.JWT_SECRET_KEY
  );

  if (!verifyResetPasswordHash) {
    return {
      message:
        "The email verification link is either invalid or expired. Try again later",
      success: false,
      messageSent: null,
    };
  }

  //   update user's password with the correct one
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  )
    .lean()
    .exec();

  if (!updatedUser) {
    return {
      success: false,
      message:
        "There was a problem updating the new password. Please try again later!",
      messageSent: null,
    };
  }

  //send a confirmation email to the user
  const emailContent = `
    <p>Hello, ${updatedUser.username},</p>
    <p>Your PTM account password has been reset successfully!</p>
    <p>You can now log with your new password here: <a href="${frontend_url}/login">Login</a></p>
    `;

  const messageSent = await sendUserEmail(
    updatedUser.email,
    "Password Reset Successful",
    emailContent
  );

  return {
    success: true,
    message: "Your account password has been reset successfully!",
    messageSent,
  };
};

module.exports = { generateForgotPasswordLink, resetAccountPassword };
