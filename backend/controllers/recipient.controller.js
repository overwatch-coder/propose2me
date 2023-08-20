const Post = require("../models/posts.models");

const retrieveMessage = async (req, res) => {
  const { p: id, u: user } = req?.query;
  if (!id || !user)
    return res
      .status(400)
      .json({
        success: false,
        message: "Cannot retrieve message without a query param",
      });

  try {
    //retrieve the sender's message
    const retrievedMessage = await Post.findOne({
      $and: [{ _id: id }, { user: user }],
    }).exec();

    if (!retrievedMessage)
      return res
        .status(404)
        .json({ success: false, message: "No message available!" });

    res.status(200).json({ success: true, data: retrievedMessage, message: 'Available message retrieved successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: "There was an error retrieving the message!" });
  }
};

module.exports = {
  retrieveMessage,
};
