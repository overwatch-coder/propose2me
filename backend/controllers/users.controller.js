//import packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const {
  generateVerificationHash,
  verifyHash,
} = require("dbless-email-verification");

//model imports
const User = require("../models/users.models");
const Post = require("../models/posts.models");

//library imports
const { sendUserEmail } = require("../lib");

// POST - Register a new User
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //validate user info
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address!" });
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Password is not strong enough!" });
    }

    //check to see if user already exists
    const savedUser = await User.findOne({ email });
    if (savedUser)
      return res
        .status(400)
        .json({ success: false, message: "Email address already exists!" });

    // hash password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //save user to database
    const userToSave = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await userToSave.save();

    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "Account creation not successful!" });

    //add email verification hash to response
    const verifyEmailHash = generateVerificationHash(
      user.email,
      process.env.JWT_SECRET_KEY,
      30
    );

    //generate a verification url and send email to client
    const verificationURL = `${process.env.FRONTEND_URL}/verify?verification=${verifyEmailHash}&email=${user.email}`;

    const emailContent = `
        <p>Hello, ${user.username},</p>
        <p>Please click on the link below to verify your account</p>
        <p>Verification link: <a href='${verificationURL}'>Verify Account</a></p>
        `;

    const messageSent = await sendUserEmail(
      user.email,
      "Verify your account",
      emailContent
    );

    if (messageSent === "" || !messageSent)
      return res.status(500).json({
        success: false,
        message:
          "There was a problem sending the verification link. Try later or enter a valid email",
      });

    // generate token and set a new cookie and return success message
    const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET_KEY);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 900000),
        secure: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Account successfully created!",
        verification: verificationURL,
        message_sent: messageSent,
        token,
      });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem creating your account!",
    });
  }
};

//GET - Verify email address
const verifyEmail = async (req, res) => {
  const { verification, email } = req.query;

  //check if the user with the email actually exists
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User with this email does not exist!",
    });

  //verify the email
  const isEmailVerified = verifyHash(
    verification,
    email,
    process.env.JWT_SECRET_KEY
  );

  if (!isEmailVerified)
    return res
      .status(400)
      .json({ success: false, message: "Email verification failed!" });

  await User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );

  const emailContent = `
    <p>Hello, ${user.username},</p>
    <p>Your account has been verified successfully!</p>
    <p>You can now log in using the link: <a href="${process.env.FRONTEND_URL}/login">Login</a></p>
    `;

  const messageSent = await sendUserEmail(
    user.email,
    "Account Status Confirmation",
    emailContent
  );

  res.status(200).json({
    success: true,
    message: "Email has been successfully verified. You can log in now",
    message_sent: messageSent,
  });
};

// POST - User Login
const login = async (req, res) => {
  //get data from req.body
  const { email, password } = req.body;
  try {
    //validate user info
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address!" });
    }

    //check to see if user already exists
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email address does not exist!" });

    // verify user's password
    if (!bcrypt.compareSync(password, user.password))
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });

    //check if the user is already verified
    if (user.isEmailVerified === false) {
      //add email verification hash to response
      const verifyEmailHash = generateVerificationHash(
        user.email,
        process.env.JWT_SECRET_KEY,
        30
      );

      //generate a verification url and send email to client
      const verificationURL = `${process.env.FRONTEND_URL}/verify?verification=${verifyEmailHash}&email=${user.email}`;

      const emailContent = `
            <p>Hello, ${user.username},</p>
            <p>Please click on the link below to verify your account</p>
            <p>Verification link: <a href='${verificationURL}'>Verify Account</a></p>
            `;

      const messageSent = await sendUserEmail(
        user.email,
        "Verify your account",
        emailContent
      );

      // set a new cookie and return success message
      res.status(200).json({
        success: true,
        message: "Verification details generated!",
        verification: verificationURL,
        message_sent: messageSent,
      });
    } else {
      const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET_KEY);

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 900000),
          secure: true,
        })
        .status(200)
        .json({
          success: true,
          message: "You have successfully signed in!",
          token,
        });
    }
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem signing into your account!",
    });
  }
};

//PATCH - Update the details of an existing user
const updateUser = async (req, res) => {
  const { id } = req.params;

  const { username, email, password } = req.body;

  try {
    const user = req.user;

    if (!(id === user._id.toString()))
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this user's data",
      });

    //verify password and respond with error if it's the same
    const savedUser = await User.findOne({ email: user.email });
    if (!savedUser)
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });

    //compare details to saved data in the database
    if (email !== undefined && email === user.email)
      return res.status(400).json({
        success: false,
        message: "New email must be different from the previous one!",
      });

    if (username !== undefined && username === user.username)
      return res.status(400).json({
        success: false,
        message: "Username has to be different from the previous one!",
      });

    if (
      password !== undefined &&
      bcrypt.compareSync(password, savedUser.password)
    )
      return res.status(400).json({
        success: false,
        message: "Password cannot the same as previous one!",
      });

    //verify validity and strongness of email and password
    if (email !== undefined && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address!" });
    }

    if (password !== undefined && !validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Password is not strong enough!" });
    }

    //encrypt password if different from previous one
    let salt = "";
    let hashedPassword = "";
    if (password !== undefined) {
      salt = bcrypt.genSaltSync(12);
      hashedPassword = bcrypt.hashSync(password, salt);
    }

    //update user based on new information
    const userToSave = {
      username,
      email,
      password: password !== undefined ? hashedPassword : savedUser.password,
    };
    await User.findOneAndUpdate({ _id: id }, userToSave, { new: true });

    //send response to browser
    res
      .status(200)
      .json({ success: true, message: "Account updated successfully" });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem updating your details",
    });
  }
};

//DELETE - Delete a user from the database
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // access authenticated user id and compare with id from request parameters
    const user = req.user;
    if (!(id === user._id.toString()))
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this user's data",
      });

    //delete user from database
    const deletedUser = await User.findOneAndDelete({ _id: id });

    // if user is deleted, delete the user's post as well
    if (deletedUser) {
      const postsToDelete = await Post.find({ user: user._id.toString() });
      postsToDelete.forEach(async (post) => {
        await Post.findOneAndDelete({ _id: post._id.toString() });
      });
    }

    //send response back to client
    req.user = "";
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem deleting your account",
    });
  }
};

// POST - Logout a user
const logout = async (req, res) => {
  req.user = "";
  res
    .clearCookie("access_token")
    .status(200)
    .json({ success: true, message: "You've successfully logged out!" });
};

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  logout,
  verifyEmail,
};
