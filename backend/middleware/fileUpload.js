const fs = require("fs");

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Upload
const uploadFile = async (file, folderName) => {
  let fileToUpload =
    file === undefined || file === "" ? undefined : file?.tempFilePath;

  if (fileToUpload !== undefined) {
    try {
      const response = await cloudinary.uploader.upload(fileToUpload, {
        folder: folderName,
        resource_type: "auto",
      });

      if (!response.public_id) {
        throw new Error(`There was an error uploading the file: ${file}`);
      }

      //delete file from temp folder (ptm-uploads) :: DEV MODE
      if (process.env.NODE_ENV === "development") {
        fs.rmSync(fileToUpload);
      }

      //return the url of the uploaded file
      return response.secure_url;
    } catch (error) {
      throw new Error(error?.message);
    }
  }
};

module.exports = {
  uploadFile,
};
