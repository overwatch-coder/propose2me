const fs = require("fs");

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Upload
const uploadFile = async (res, file, folderName) => {
  let fileToUpload =
    file === undefined || file === "" ? undefined : file;

  if (fileToUpload !== undefined) {
    try {
      const response = await cloudinary.uploader.upload(fileToUpload, {
        folder: folderName,
        resource_type: "auto",
      });

      if (!response.public_id) {
        return res.status(500).json({success: false, message: `There was an error uploading the file: ${file}`})
      }

      //delete file from temp folder (ptm-uploads) :: DEV MODE
      if(process.env.NODE_ENV === "development"){
        fs.rmSync(fileToUpload);
      }

      //return the url of the uploaded file
      return response.secure_url;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading file. Try again later!",
      });
    }
  } else {
    return "";
  }
};

module.exports = {
  uploadFile,
};
