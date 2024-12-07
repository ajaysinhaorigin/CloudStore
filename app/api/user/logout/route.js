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

    const cookieStore = await cookies();

    // Setting cookies with expired maxAge to clear them
    cookieStore.set("accessToken", "", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0,
    });

    cookieStore.set("refreshToken", "", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0,
    });

    return utils.responseHandler({
      message: "User logged out Successfully",
      status: 200,
      success: true,
      data: {},
    });
  })
);
