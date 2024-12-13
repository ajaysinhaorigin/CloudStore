import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";
import { uploadOnCloudinary } from "../../../../lib/utils/cloudinary";
import { getFileType, parseStringify } from "../../../../lib/utils/utils";
import connectDB from "../../../../lib/dbConnection";
import File from "../../../../lib/models/file.model";

export const POST = asyncHandler(
  verifyJWT(async (req, _) => {
    try {
      await connectDB();

      const formData = await req.formData();
      const formDataFile = await formData.get("file");
      const ownerId = req.user._id;

      if (!formDataFile) {
        return utils.responseHandler({
          message: "File is missing",
          status: 400,
          success: false,
        });
      }

      const fileResponse = await uploadOnCloudinary(formDataFile);

      if (!fileResponse) {
        return utils.responseHandler({
          message: "Failed to upload file",
          status: 500,
          success: false,
        });
      }

      const fileDocument = {
        type: getFileType(formDataFile.name).type,
        name: formDataFile.name,
        url: fileResponse.url,
        extension: getFileType(formDataFile.name).extension,
        size: fileResponse.bytes,
        owner: ownerId,
        users: [],
      };

      const createdFile = await File.create(fileDocument);
      const existedFile = await File.findById(createdFile._id).select(
        "-createdAt -updatedAt -__v"
      );

      if (!existedFile) {
        return utils.responseHandler({
          message: "Something went wrong while uploading video",
          status: 500,
          success: false,
        });
      }

      return utils.responseHandler({
        message: "File uploaded successfully",
        status: 200,
        success: true,
        data: {
          file: parseStringify(existedFile),
        },
      });
    } catch (error) {
      return utils.responseHandler({
        message: error.message || "Internal Server Error while uploading file",
        status: error.status || 500,
        success: false,
      });
    }
  })
);
