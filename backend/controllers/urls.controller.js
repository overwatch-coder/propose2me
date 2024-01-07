const Request = require("../models/requests.models");
const Url = require("../models/urls.model");

// get all links of a user
const getUserUrls = async (req, res) => {
  // #swagger.tags = ['Urls']

  // #swagger.description = 'Get All Urls of a specific user'
  try {
    const user = req.user;
    const existingUrls = await Url.find({ user: user._id })
      .populate("requestId", '_id title')
      .sort({ createdAt: -1 })
      .select('-__v -updatedAt')
      .lean()
      .exec();

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
  // #swagger.tags = ['Urls']
  // #swagger.description = 'Save a new url that a user generates'
  /*	#swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            url: {
                                type: "string"
                            },
                            requestId: {
                                type: "string",
                            }
                        },
                        required: ["url", "requestId"]
                    }
                }
            } 
        }
    */

  const { url, requestId } = req.body;

  try {
    if (!url || url === "" || !requestId) {
      return res
        .status(400)
        .json({ message: "No url or request id was provided", success: false });
    }

    const user = req.user;

    const newUrl = new Url({
      user: user._id,
      url: url,
      requestId,
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

// delete url
const deletedRespondedUrl = async (req, res) => {
  // #swagger.tags = ['Urls']
  // #swagger.description = 'Delete saved url and its related request when recipient has responded'
  const { userId, requestId } = req.query;

  try {
    if (!userId || !requestId) {
      return res.status(400).json({
        message: "Either request id or user id is invalid",
        success: false,
      });
    }

    const deletedUrl = await Url.findOneAndDelete({
      $and: [{ user: userId }, { requestId: requestId }],
    });

    if (!deletedUrl) {
      return res.status(500).json({
        success: false,
        message: "There was a problem deleting the responded url",
      });
    }

    // delete request that created the url
    const deletedRequest = await Request.findOneAndDelete({
      $and: [{ user: deletedUrl.user }, { _id: deletedUrl.requestId }],
    });

    if (!deletedRequest) {
      return res.status(500).json({
        success: false,
        message: "There was a problem deleting the link's request",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Response sent, request and link deleted successfully from database",
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
