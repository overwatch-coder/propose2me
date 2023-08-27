const Post = require("../models/posts.models");
const Url = require("../models/urls.model");

// get all links of a user
const getUserUrls = async (req, res) => {
  try {
    const user = req.user;
    const existingUrls = await Url.find({ user: user._id }).exec();

    if (!existingUrls) {
      return res
        .status(404)
        .json({ success: false, message: "No urls found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "Links have been generated successfully",
      data: existingUrls,
    });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem retrieving your generated links!",
    });
  }
};

// save a new link of a user
const saveUserUrls = async (req, res) => {
  const { url, postId } = req.body;
  try {
    if (!url || url === "" || !postId) {
      return res
        .status(400)
        .json({ message: "No url or post id was provided", success: false });
    }

    const user = req.user;

    const newUrl = new Url({
      user: user._id,
      url: url,
      postId,
    });

    const savedUrl = await newUrl.save();

    if (!savedUrl) {
      return res.status(500).json({
        success: false,
        message: "There was a problem adding the link to the database",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Link successfully added to database" });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem retrieving your generated links!",
    });
  }
};

// update url responded status
const deletedRespondedUrl = async (req, res) => {
  const { id: postId } = req.params;
  const { user } = req.query;

  try {
    if (!id || !user) {
      return res.status(400).json({
        message: "Either link id or user id is invalid",
        success: false,
      });
    }

    const deletedUrl = await Url.findOneAndDelete({
      $and: [{ user }, { postId }],
    });

    if (!deletedUrl) {
      return res.status(500).json({
        success: false,
        message: "There was a problem deleting the responded url",
      });
    }

    // delete post that created the url
    const deletedPost = await Post.findOneAndDelete({
      $and: [{ user: user }, { _id: deletedUrl.postId }],
    });

    if (!deletedPost) {
      return res.status(500).json({
        success: false,
        message: "There was a problem deleting the link's post",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Response sent, post and link deleted successfully from database",
    });
  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem retrieving your generated links!",
    });
  }
};

module.exports = { getUserUrls, saveUserUrls, deletedRespondedUrl };
