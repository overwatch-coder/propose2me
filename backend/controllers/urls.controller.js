const Url = require("../models/urls.model");

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

const saveUserUrls = async (req, res) => {
    const {url} = req.body;
  try {
    if(!url || url === ""){
        return res.status(400).json({message: 'No url was provided to be saved', success: false})
    }

    const user = req.user;
    console.log(user);
    const newUrl = new Url({
        user: user._id,
        url: url
    });

    const savedUrl = await newUrl.save();

    if(!savedUrl) {
        return res.status(500).json({success: false, message: 'There was a problem adding the link to the database'})
    };

    res.status(200).json({success: true, message: 'Link successfully added to database'})

  } catch (error) {
    res.status(500).json({
      stack: process.env.NODE_ENV !== "production" ? error : "",
      success: false,
      message: "There was a problem retrieving your generated links!",
    });
  }
};

module.exports = { getUserUrls, saveUserUrls };
