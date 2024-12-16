import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";
import connectDB from "../../../../lib/dbConnection";
import File from "../../../../lib/models/file.model";

export const GET = asyncHandler(
  verifyJWT(async (req, _) => {
    try {
      await connectDB();

      const files = await File.find({ owner: req.user._id });

      if (!files) {
        return utils.responseHandler({
          message: "User not found",
          status: 404,
          success: false,
        });
      }

      const totalSpace = {
        image: { size: 0, latestDate: "" },
        document: { size: 0, latestDate: "" },
        video: { size: 0, latestDate: "" },
        audio: { size: 0, latestDate: "" },
        other: { size: 0, latestDate: "" },
        used: 0,
        all: 2 * 1024 * 1024 * 1024,
      };

      files.forEach((file) => {
        const fileType = file.type;
        totalSpace[fileType].size += file.size;
        totalSpace.used += file.size;
        totalSpace[fileType].latestDate = file.updatedAt;

        if (
          !totalSpace[fileType].latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
        ) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      });

      return utils.responseHandler({
        message: "Total space fetched successfully",
        data: {
          totalSpace,
        },
        status: 200,
        success: true,
      });
    } catch (error) {
      return utils.responseHandler({
        message:
          error.message ||
          "Internal Server Error while fetching total space of files",
        status: error.status || 500,
        success: false,
      });
    }
  })
);
