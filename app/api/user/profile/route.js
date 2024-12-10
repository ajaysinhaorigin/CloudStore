import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";
import connectDB from "../../../../lib/dbConnection";

export const GET = asyncHandler(
  verifyJWT(async (req, _) => {
    try {
      await connectDB();

      return utils.responseHandler({
        message: "User profile fetched successfully",
        data: {
          user: req.user,
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
