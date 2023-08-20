//module imports
const Post = require("../models/posts.models");
const ls = require("tiny-url-generator");

// middleware for file uploads
const { uploadFile } = require("../middleware/imageUpload");

// GET all posts regardless of user
const adminGetsAllPosts = async (req, res) => {
  const {admin} = req.body;
  try {
    if (admin !== "Overwatch") {
      return res.status(403).json({ success: false, message: "Forbidden!" });
    }

    const posts = await Post.find({}).sort({ createdAt: -1 });

    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found!" });
    }

    res
      .status(200)
      .json({ success: true, posts, message: "Posts retrieved successfully" });
  } catch (error) {
    return res.status(403).json({ success: false, message: "Forbidden!" });
  }
};

// GET all user posts
const getAllUserPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    const posts = await Post.find({ user: user._id.toString() })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "_id email" })
      .exec();

    if (!posts)
      return res
        .status(404)
        .json({ success: true, message: "No posts found!" });

    res
      .status(200)
      .json({ success: true, posts, message: "Posts retrieved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

// GET single user post
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    //retrieve user's post using user id and post id
    const singlePost = await Post.findOne({
      $and: [{ _id: id }, { user: user._id.toString() }],
    }).exec();

    //return error message if post is unavailable
    if (!singlePost)
      return res
        .status(404)
        .json({ success: false, message: "No post found!" });

    res
      .status(200)
      .json({
        success: true,
        posts: singlePost,
        message: "Post retrieved successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

// POST - Create a new post
const createPost = async (req, res) => {
  const { title, message, senderEmail, senderName, recipientName } = req.body;

  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    if (!title || !message || !senderName || !recipientName) {
      return res.status(404).json({
        success: false,
        message: "All fields marked with * are required",
      });
    }

    const postCreated = new Post({
      title,
      message,
      senderName,
      recipientName,
      senderEmail:
        senderEmail === undefined || senderEmail === ""
          ? user.email
          : senderEmail,
      user: user._id,
      senderPhoto: await uploadFile(req?.files?.senderPhoto, "ptm/ptm-photos"),
      recipientPhoto: await uploadFile(
        req?.files?.recipientPhoto,
        "ptm/ptm-photos"
      ),
      acceptanceMusic: await uploadFile(
        req?.files?.acceptanceMusic,
        "ptm/ptm-music"
      ),
      backgroundImage: await uploadFile(
        req?.files?.backgroundImage,
        "ptm/ptm-bg-photos"
      ),
    });

    const post = await postCreated.save();
    if (!post)
      res.status(500).json({
        success: false,
        message: "Post creation unsuccessful. Try again later!",
      });

    //generate actual url
    const urlToShorten = `${
      process.env.FRONTEND_URL
    }/recipient?p=${post._id.toString()}&u=${post.user.toString()}`;

    //shorten the url to hide the name
    const shortenedUrl = await ls.generate({
      url: urlToShorten,
      title: "PTM Recipient - Say Yes!",
      expiry: new Date().setDate(new Date().getDate() + 5),
    });

    //url to send to client
    const recipientUrl =
      shortenedUrl.status !== true ? urlToShorten : shortenedUrl.data.link;

    res.status(200).json({
      success: true,
      url: recipientUrl,
      message: "Post creation successful!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

//PATCH - Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, senderEmail, senderName, recipientName } = req.body;

  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    //find the original post
    const originalPost = await Post.findOne({
      $and: [{ _id: id }, { user: user._id.toString() }],
    });

    let newSenderPhoto = await uploadFile(
      req?.files?.senderPhoto,
      "ptm/ptm-photos"
    );
    let newRecipientPhoto = await uploadFile(
      req?.files?.recipientPhoto,
      "ptm/ptm-photos"
    );
    let newAcceptanceMusic = await uploadFile(
      req?.files?.acceptanceMusic,
      "ptm/ptm-music"
    );
    let newBackgroundImage = await uploadFile(
      req?.files?.backgroundImage,
      "ptm/ptm-bg-photos"
    );

    //create an object for the data to update
    const locallyUpdatedInfo = {
      title: title === undefined || title === "" ? originalPost.title : title,
      message:
        message === undefined || message === ""
          ? originalPost.message
          : message,
      senderName:
        senderName === undefined || senderName === ""
          ? originalPost.senderName
          : senderName,
      recipientName:
        recipientName === undefined || recipientName === ""
          ? originalPost.recipientName
          : recipientName,
      senderEmail:
        senderEmail === undefined || senderEmail === ""
          ? originalPost.senderEmail
          : senderEmail,
      user: originalPost.user,
      senderPhoto:
        newSenderPhoto === "" ? originalPost.senderPhoto : newSenderPhoto,
      recipientPhoto:
        newRecipientPhoto === ""
          ? originalPost.recipientPhoto
          : newRecipientPhoto,
      acceptanceMusic:
        newAcceptanceMusic === ""
          ? originalPost.acceptanceMusic
          : newAcceptanceMusic,
      backgroundImage:
        newBackgroundImage === ""
          ? originalPost.backgroundImage
          : newBackgroundImage,
    };

    const updatedPost = await Post.findOneAndUpdate(
      { $and: [{ _id: id }, { user: user._id.toString() }] },
      locallyUpdatedInfo,
      { new: true }
    );

    if (!updatedPost)
      return res.status(500).json({
        success: false,
        message: "There was an error updating this post!",
      });

    res
      .status(200)
      .json({ success: true, message: `Post updated successfully!` });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

//DELETE - Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    //find the user from the request parameters
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    //delete the user's post
    await Post.findOneAndDelete({ _id: id });

    res
      .status(200)
      .json({ success: true, message: `Post deleted successfully!` });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

module.exports = {
  adminGetsAllPosts,
  getAllUserPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
};
