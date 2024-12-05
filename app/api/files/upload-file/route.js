import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";

export const POST = asyncHandler(
  verifyJWT(async (req, _) => {
    return utils.responseHandler({
      message: "User profile fetched successfully",
      data: {
        user: req.user,
      },
      status: 200,
      success: true,
    });
  })
);
