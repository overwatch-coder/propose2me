//import packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//model imports
const User = require("../models/users.models");
const Request = require("../models/requests.models");

//library imports
const { sendEmailVerification, verifyEmailAddress } = require("../lib/email");
const { uploadFile } = require("../middleware/fileUpload");
const {
  generateForgotPasswordLink,
  resetAccountPassword,
} = require("../lib/forgot-password");

// POST - Register a new User
const register = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Register a new user and send verification email'

  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            username: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            password: {
                                type: "string",
                            }
                        },
                        required: ["username", "email", "password"]
                    }
                }
            } 
        }
    */

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
    const { messageSent, verificationURL } = await sendEmailVerification(user);

    if (messageSent === "" || !messageSent)
      return res.status(500).json({
        success: false,
        message:
          "There was a problem sending the verification link. Try later or enter a valid email",
      });

    res.status(200).json({
      success: true,
      message: "Account successfully created!",
      verification: verificationURL,
      message_sent: messageSent,
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'Verify an existing user whose email is not verified'
  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            verification: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            }
                        },
                        required: ["verification", "email"]
                    }
                }
            } 
        }
    */

  const { verification, email } = req.body;

  //check if the user with the email actually exists
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User with this email does not exist!",
    });

  // check if user is already verified
  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: "Email is already verified. Continue to login",
    });
  }

  const { messageSent, success } = await verifyEmailAddress(
    verification,
    email,
    user
  );

  if (!success) {
    res.status(400).json({
      success,
      message: messageSent,
    });
  }

  res.status(200).json({
    success,
    message: "Email has been successfully verified. You can log in now",
    message_sent: messageSent,
  });
};

// POST - User Login
const login = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Log in an existing user'

  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: {
                              type: "string"
                            },
                            password: {
                              type: "string",
                            }
                        },
                        required: ["email", "password"]
                    }
                }
            } 
        }
    */

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
        .json({ success: false, message: "Incorrect user credentials!" });

    // verify user's password
    if (!bcrypt.compareSync(password, user.password))
      return res
        .status(400)
        .json({ success: false, message: "Incorrect user credentials!" });

    //check if the user is already verified
    if (user.isEmailVerified === false) {
      //add email verification hash to response
      const { messageSent, verificationURL } = await sendEmailVerification(
        user
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
          user: {
            username: user.username,
            email: user.email,
            id: user._id,
            profilePicture: user.profilePicture,
            isEmailVerified: user.isEmailVerified,
          },
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update the details of an existing user'

  const { id } = req.params;

  try {
    const user = req.user;

    const { username, password, dob, firstName, lastName, gender, email } =
      req.body;

    if (!(id === user._id.toString()))
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this page",
      });

    //verify password and respond with error if it's the same
    const savedUser = await User.findOne({ email: user.email });
    if (!savedUser) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    //compare details to saved data in the database
    if (email && email === user.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be the same as previously used email",
      });
    }

    if (password && bcrypt.compareSync(password, savedUser.password)) {
      return res.status(400).json({
        success: false,
        message: "Cannot use a previously used password!",
      });
    }

    //verify validity and strongness of the password and email
    if (password !== undefined && !validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Password is not strong enough!" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
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
      username: username ? username : savedUser.username,
      email: email ? email : savedUser.email,
      password: password !== undefined ? hashedPassword : savedUser.password,
      dob: dob ? dob : savedUser.dob,
      firstName: firstName ? firstName : savedUser.firstName,
      lastName: lastName ? lastName : savedUser.lastName,
      gender: gender ? gender : savedUser.gender,
      isEmailVerified: email ? false : savedUser.isEmailVerified,
    };

    const saved = await User.findOneAndUpdate({ _id: id }, userToSave, {
      new: true,
    })
      .select("-password")
      .lean()
      .exec();

    //send response to browser
    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      user: saved,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem updating your details",
    });
  }
};

//DELETE - Delete a user from the database
const deleteUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'remove an existing user account'

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

    // if user is deleted, delete the user's request as well
    if (deletedUser) {
      const requestsToDelete = await Request.find({
        user: user._id.toString(),
      });
      requestsToDelete.forEach(async (request) => {
        await Request.findOneAndDelete({ _id: request._id.toString() });
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
  // #swagger.tags = ['Users']
  req.user = "";
  res
    .clearCookie("access_token")
    .status(200)
    .json({ success: true, message: "You've successfully logged out!" });
};

// UPDATE - update user profile picture
const updateProfilePicture = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Update the profile picture of a user'

  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            profilePicture: {
                              type: "string",
                              format: "binary"
                            },
                        },
                        required: ["profilePicture"]
                    }
                }
            } 
        }
    */

  try {
    const user = req.user;

    if (!req?.files?.profilePicture) {
      return res.status(404).json({
        success: false,
        message: "Please add image to be uploaded!",
      });
    }

    const profilePicture = await uploadFile(
      req.files.profilePicture,
      "ptm/ptm-user-profile"
    );

    await User.findOneAndUpdate(
      { email: user.email },
      { profilePicture },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture,
    });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem changing your profile picture",
    });
  }
};

// Get User specific details
const getSpecificUserDetails = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get a single requests made by a specific user'
  const user = req.user;
  try {
    const userDetails = await User.findOne({ email: user.email })
      .select("-password")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      user: userDetails,
    });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem retrieving user details",
    });
  }
};

const sendCustomEmailVerificationLink = async (req, res) => {
  const user = req.user;
  // #swagger.tags = ['Users']
  // #swagger.description = 'Send verification email from already logged in user account'
  try {
    // check if user is already verified
    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified.",
      });
    }

    const { messageSent, verificationURL } = await sendEmailVerification(user);

    // set a new cookie and return success message
    res.status(200).json({
      success: true,
      message: "Verification details generated!",
      verification: verificationURL,
      message_sent: messageSent,
    });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem sending the verification email",
    });
  }
};

// @POST - send a link to current user's email address to reset the password
const sendForgotPasswordLink = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'send a link to the user to reset the password containing the password reset link'

  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: {
                              type: "string",
                            },
                        },
                        required: ["email"]
                    }
                }
            } 
        }
    */

  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user with this email address exists!",
      });
    }

    const { messageSent, resetPasswordHash } = await generateForgotPasswordLink(
      user
    );

    res.status(200).json({
      success: true,
      message:
        "A reset password link has been sent to your email address. Check your inbox",
      resetPasswordHash,
      messageSent,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "An error occured while sending the password reset link",
    });
  }
};

// @PATCH - Reset the user's password based on the verication details provided
const updateAccountPassword = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Reset the user's password based on the verication details provided'

  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            verification: {
                              type: "string",
                            },
                            userId: {
                              type: "string",
                            },
                        },
                        required: ["verification", "userId"]
                    }
                }
            } 
        }
    */

  try {
    const { verificationID, password } = req.body;

    if (!verificationID) {
      return res.status(400).json({
        success: false,
        message: "Password reset failed. No verification ID present!",
      });
    }

    if (!password || !validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a strong password!",
      });
    }

    const verification = verificationID.split("-")[0];
    const userId = verificationID.split("-")[1];

    const user = await User.findOne({ _id: userId }).lean().exec();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user with this email address exists!",
      });
    }

    const { success, message, messageSent } = await resetAccountPassword(
      verification,
      user.email,
      password
    );

    res.status(success ? 200 : 400).json({
      success,
      message,
      messageSent,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "An error occured while sending the password reset link",
    });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  logout,
  verifyEmail,
  updateProfilePicture,
  getSpecificUserDetails,
  sendCustomEmailVerificationLink,
  sendForgotPasswordLink,
  updateAccountPassword,
};
