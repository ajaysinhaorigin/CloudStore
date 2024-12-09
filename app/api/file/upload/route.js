import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";
import { uploadOnCloudinary } from "../../../../lib/utils/cloudinary";
import {
  constructFileUrl,
  getFileType,
  parseStringify,
} from "../../../../lib/utils/utils";

export const POST = asyncHandler(
  verifyJWT(async (req, _) => {
    console.log("req --------- file upload route");
    try {
      const formData = await req.formData();
      const file = await formData.get("file");
      console.log("file", file);

      const fileUrl = await uploadOnCloudinary(file);
      console.log("file urls", fileUrl);

      // const fileDocument = {
      //   type: getFileType(fileUrl.name).type,
      //   name: bucketFile.name,
      //   url: constructFileUrl(bucketFile.$id),
      //   extension: getFileType(bucketFile.name).extension,
      //   size: bucketFile.sizeOriginal,
      //   owner: ownerId,
      //   users: [],
      //   bucketFileId: bucketFile.$id,
      // };

      return utils.responseHandler({
        message: "File uploaded successfully",
        status: 200,
        success: true,
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
