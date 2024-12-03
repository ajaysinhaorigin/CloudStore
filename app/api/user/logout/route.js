import { cookies } from "next/headers";
import User from "../../../../lib/models/user.model";
import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";

export const POST = asyncHandler(
  verifyJWT(async (req, _) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    (await cookies()).clearCookie("accessToken", accessToken, options);
    (await cookies()).clearCookie("refreshToken", refreshToken, options);

    return utils.responseHandler({
      message: "User logged out Successfully",
      status: 200,
      success: true,
      data: {},
    });
  })
);
