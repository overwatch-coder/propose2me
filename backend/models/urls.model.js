const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model("Url", UrlSchema);

module.exports = Url;
