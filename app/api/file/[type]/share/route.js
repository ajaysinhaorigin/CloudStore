import { asyncHandler } from "../../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../../lib/utils/server-utils";
import connectDB from "../../../../../lib/dbConnection";
import File from "../../../../../lib/models/file.model";

export const PUT = asyncHandler(
  verifyJWT(async (req, { params }) => {
    try {
      await connectDB();
      const { type: id } = (await params) || [];
      const { emails } = await req.json();

      console.log("emails", emails);

      if (!emails) {
        return utils.responseHandler({
          message: "Emails are missing",
          status: 400,
          success: false,
        });
      }

      const file = await File.findById(id);

      if (!file) {
        return utils.responseHandler({
          message: "File not found",
          status: 404,
          success: false,
        });
      }

      if (file.owner.toString() !== req.user._id.toString()) {
        return utils.responseHandler({
          message: "You are not authorized to share this file",
          status: 401,
          success: false,
        });
      }

      file.users = [...file.users, ...emails];
      await file.save();

      return utils.responseHandler({
        message: "User profile fetched successfully",
        data: {
          file: file,
        },
        status: 200,
        success: true,
      });
    } catch (error) {
      return utils.responseHandler({
        message: error.message || "Internal Server Error while fetching user",
        status: error.status || 500,
        success: false,
      });
    }
  })
);
