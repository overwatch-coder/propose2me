//module imports
const Request = require("../models/requests.models");
const { frontend_url } = require("../utils");

// middleware for file uploads
const { uploadFile } = require("../middleware/fileUpload");
const { shortenUrl } = require("../lib");
const Url = require("../models/urls.model");

// GET all requests regardless of user
const adminGetsAllRequests = async (req, res) => {
  // #swagger.tags = ['Requests']
  // #swagger.description = 'Only Admin can see all the requests regardless of user'
  // #swagger.ignore = true
  const { admin } = req.body;
  try {
    if (admin !== process.env.PTM_ADMIN) {
      return res.status(403).json({ success: false, message: "Forbidden!" });
    }

    const requests = await Request.find({}).sort({ createdAt: -1 });

    if (!requests) {
      return res
        .status(404)
        .json({ success: false, message: "No requests found!" });
    }

    res.status(200).json({
      success: true,
      requests,
      message: "Requests retrieved successfully",
    });
  } catch (error) {
    return res.status(403).json({ success: false, message: "Forbidden!" });
  }
};

// GET all user requests
const getAllUserRequests = async (req, res) => {
  // #swagger.tags = ['Requests']
  // #swagger.description = 'Get all requests made by a specific user'

  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    const requests = await Request.find({ user: user._id.toString() })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "_id email" })
      .exec();

    if (!requests)
      return res
        .status(404)
        .json({ success: true, message: "No requests found!" });

    res.status(200).json({
      success: true,
      requests,
      message: "Requests retrieved successfully",
    });
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

// GET single user request
const getSingleRequest = async (req, res) => {
  // #swagger.tags = ['Requests']
  // #swagger.description = 'Get a single requests made by a specific user'
  const { id } = req.params;

  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    //retrieve user's request using user id and request id
    const singleRequest = await Request.findOne({
      $and: [{ _id: id }, { user: user._id.toString() }],
    }).exec();

    //return error message if request is unavailable
    if (!singleRequest)
      return res
        .status(404)
        .json({ success: false, message: "No request found!" });

    res.status(200).json({
      success: true,
      requests: singleRequest,
      message: "Request retrieved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

// REQUEST - Create a new request
const createRequest = async (req, res) => {
  // #swagger.tags = ['Requests']
  // #swagger.description = 'Create and save a new request and generate a url for it'
  const {
    title,
    message,
    senderEmail,
    senderName,
    recipientName,
    video,
    customYesResponse,
    customNoResponse,
  } = req.body;
  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    if (!title || !senderName || !recipientName) {
      return res.status(404).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const requestCreated = new Request({
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
      video,
      customYesResponse,
      customNoResponse,
    });

    const request = await requestCreated.save();
    if (!request)
      res.status(500).json({
        success: false,
        message: "Request creation unsuccessful. Try again later!",
      });

    //generate actual url
    const urlToShorten = `${frontend_url}/recipient?p=${request._id.toString()}&u=${request.user.toString()}`;

    //shorten the url to hide the name
    const shortenedUrl = await shortenUrl(
      urlToShorten,
      "PTM Recipient - Say Yes!",
      new Date().setDate(new Date().getDate() + 5)
    );

    //url to send to client
    const recipientUrl =
      shortenedUrl?.status !== true ? urlToShorten : shortenedUrl?.data?.link;

    res.status(200).json({
      success: true,
      url: recipientUrl,
      requestId: request._id,
      message: "Request creation successful!",
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      success: false,
      message: "An unexpected error has occurred!",
    });
  }
};

//PATCH - Update a request
const updateRequest = async (req, res) => {
  // #swagger.tags = ['Requests']
  // #swagger.description = 'update already saved request'
  const { id } = req.params;
  const {
    title,
    message,
    senderEmail,
    senderName,
    recipientName,
    video,
    customYesResponse,
    customNoResponse,
    senderPhoto,
    recipientPhoto,
    acceptanceMusic,
    backgroundImage,
  } = req.body;

  try {
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    //find the original request
    const originalRequest = await Request.findOne({
      $and: [{ _id: id }, { user: user._id.toString() }],
    });

    let newRecipientPhoto = recipientPhoto
      ? recipientPhoto
      : await uploadFile(req?.files?.recipientPhoto, "ptm/ptm-photos");

    let newAcceptanceMusic = acceptanceMusic
      ? acceptanceMusic
      : await uploadFile(req?.files?.acceptanceMusic, "ptm/ptm-music");

    // let newBackgroundImage = backgroundImage
    //   ? backgroundImage
    //   : await uploadFile(req?.files?.backgroundImage, "ptm/ptm-bg-photos");

    let newSenderPhoto = senderPhoto
      ? senderPhoto
      : await uploadFile(req?.files?.senderPhoto, "ptm/ptm-photos");

    //create an object for the data to update
    const locallyUpdatedInfo = {
      video: video ? video : originalRequest.video,
      customYesResponse: customYesResponse
        ? customYesResponse
        : originalRequest.customYesResponse,
      customNoResponse: customNoResponse
        ? customNoResponse
        : originalRequest.customNoResponse,
      title:
        title === undefined || title === "" ? originalRequest.title : title,
      message:
        message === undefined || message === ""
          ? originalRequest.message
          : message,
      senderName:
        senderName === undefined || senderName === ""
          ? originalRequest.senderName
          : senderName,
      recipientName:
        recipientName === undefined || recipientName === ""
          ? originalRequest.recipientName
          : recipientName,
      senderEmail:
        senderEmail === undefined || senderEmail === ""
          ? originalRequest.senderEmail
          : senderEmail,
      user: originalRequest.user,
      senderPhoto:
        newSenderPhoto === "" ? originalRequest.senderPhoto : newSenderPhoto,
      recipientPhoto:
        newRecipientPhoto === ""
          ? originalRequest.recipientPhoto
          : newRecipientPhoto,
      acceptanceMusic:
        newAcceptanceMusic === ""
          ? originalRequest.acceptanceMusic
          : newAcceptanceMusic,
      // backgroundImage:
      //   newBackgroundImage === ""
      //     ? originalRequest.backgroundImage
      //     : newBackgroundImage,
    };

    const updatedRequest = await Request.findOneAndUpdate(
      { $and: [{ _id: id }, { user: user._id.toString() }] },
      locallyUpdatedInfo,
      { new: true }
    );

    if (!updatedRequest)
      return res.status(500).json({
        success: false,
        message: "There was an error updating this request!",
      });

    res
      .status(200)
      .json({ success: true, message: `Request updated successfully!` });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

//DELETE - Delete a request
const deleteRequest = async (req, res) => {
  // #swagger.tags = ['Requests']
  // #swagger.description = 'Delete a specific request by a user'
  const { id } = req.params;

  try {
    //find the user from the request parameters
    const user = req.user;
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access!" });

    //delete the user's request
    const deletedRequests = await Request.findOneAndDelete({ _id: id })
      .lean()
      .exec();

    if (!deletedRequests) {
      return res.status(500).json({
        success: false,
        message: "There was a problem deleting this request",
      });
    }

    const deletedUrl = await Url.findOneAndDelete({
      requestId: deletedRequests._id,
    });

    if (!deletedUrl) {
      return res.status(500).json({
        success: false,
        message: "There was a problem deleting the url for this request",
      });
    }

    res.status(200).json({
      success: true,
      message: `Request and associated url deleted successfully!`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An unexpected error has occurred!" });
  }
};

module.exports = {
  adminGetsAllRequests,
  getAllUserRequests,
  getSingleRequest,
  createRequest,
  updateRequest,
  deleteRequest,
};
