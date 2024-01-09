const {
  generateVerificationHash,
  verifyHash,
} = require("dbless-email-verification");
const { sendUserEmail } = require(".");
const { frontend_url } = require("../utils");
const User = require("../models/users.models");

// Function to send email verification link to the user
const sendEmailVerification = async (user) => {
  const verifyEmailHash = generateVerificationHash(
    user.email,
    process.env.JWT_SECRET_KEY,
    30
  );

  //generate a verification url and send email to client
  const verificationURL = `${frontend_url}/verify?verification=${verifyEmailHash}&email=${user.email}`;

  const emailContent = `
            <p>Hello, ${user.username},</p>
            <p>Please click on the link below to verify your PTM account</p>
            <p>Verification link: <a href='${verificationURL}'>Verify Account</a></p>
            <p>or copy and paste this link into your browser: ${verificationURL}</p>
            `;

  const messageSent = await sendUserEmail(
    user.email,
    "Verify your account",
    emailContent
  );

  return {
    messageSent,
    verificationURL,
  };
};

// function to verify the email address with the verification link from their email
const verifyEmailAddress = async (verification, email, user) => {
  //verify the email
  const isEmailVerified = verifyHash(
    verification,
    email,
    process.env.JWT_SECRET_KEY
  );

  if (!isEmailVerified)
    return {
      messageSent:
        "The email verification link is either invalid or expired. Try again later",
      success: false,
    };

  await User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );

  const emailContent = `
    <p>Hello, ${user.username},</p>
    <p>Your PTM account has been verified successfully!</p>
    <p>You can now log in using the link: <a href="${frontend_url}/login">Login</a></p>
    `;

  const messageSent = await sendUserEmail(
    user.email,
    "Account Status Confirmation",
    emailContent
  );

  return {
    messageSent,
    success: true,
  };
};

module.exports = {
  sendEmailVerification,
  verifyEmailAddress,
};
