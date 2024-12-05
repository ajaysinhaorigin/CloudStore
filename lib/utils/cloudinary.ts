import { v2 as cloudinary } from "cloudinary";
import { mongodbConfig } from "../dbConnection/config";

// Configuration
cloudinary.config({
  cloud_name: mongodbConfig.cloudinaryCloudName,
  api_key: mongodbConfig.cloudinaryApiKey,
  api_secret: mongodbConfig.cloudinaryApiSecret,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  // Upload an image
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "cloud-store",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    return response;
  } catch (error) {
    return null;
  }
};

const deleteFromCloudinary = async (publicURL: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicURL);
    return result;
  } catch (error) {
    console.log("error at cloudinarydelete function", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
