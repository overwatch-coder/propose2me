const fs = require('fs');

const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Upload
const uploadFile = async (file, folderName) => {
    let fileToUpload = (file === undefined) || file === "" ? undefined : file?.tempFilePath;

    if(fileToUpload !== undefined){
        try {
            const res = await cloudinary.uploader.upload(fileToUpload, {folder: folderName, resource_type: 'auto'});

            if(!res.public_id) throw Error({success: false, message: 'Error uploading file'});

            //delete file from temp folder (ptm-uploads)
            fs.unlinkSync(fileToUpload);    

            //return the url of the uploaded file
            return res.secure_url;

        } catch (error) {
            res.status(500).json({success: false, message: 'Error uploading file. Try again later!'});
        }
    }else{
        return "";
    }
}

module.exports = {
    uploadFile
}