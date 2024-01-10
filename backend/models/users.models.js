const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: String,
    lastName: String,
    dob: String,
    gender: String,
    profilePicture: String,
    resetPassword: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("strictPopulate", false);

const User = mongoose.model("User", userSchema);

module.exports = User;
