const mongoose = require("mongoose");

const requestschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    senderEmail: {
      type: String,
    },
    senderName: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    senderPhoto: String,
    recipientPhoto: String,
    video: String,
    acceptanceMusic: String,
    customYesResponse: {
      type: String,
      default: "YES, I ACCEPT ❤️",
    },
    customNoResponse: {
      type: String,
      default: "SORRY, NOT INTERESTED 💔",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("strictPopulate", false);

const Request = mongoose.model("Request", requestschema);

module.exports = Request;
