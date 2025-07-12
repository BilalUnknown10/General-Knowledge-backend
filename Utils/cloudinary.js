const {v2 : cloudinary} = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type : "image",
        folder : "general knowledge website"
    });
    
    fs.unlinkSync(localFilePath);
    return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
  };

  const deleteOnCloudinary = async (oldFilePath) => {
    try {
        if(!oldFilePath) return null;
        const response = await cloudinary.uploader.destroy(oldFilePath);
        console.log(response);
        return response;
    } catch (error) {
        console.log("error in cloudinary delete image : ", error);
    }
  }



  module.exports = {uploadOnCloudinary, deleteOnCloudinary}