import { cookies } from "next/headers";
import User from "../../../../lib/models/user.model";
import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import {
  utils,
} from "../../../../lib/utils/server-utils";
import { mongodbConfig } from "../../../../lib/dbConnection/config";

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     const user = await User.findById(decodedToken?._id);

//     if (!user) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     if (incomingRefreshToken !== user?.refreshToken) {
//       throw new ApiError(401, "Refresh token is expired or used");
//     }

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
//       user._id
//     );

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", refreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });

export const POST = asyncHandler(
  verifyJWT(async (req, _) => {
    const incomingRefreshToken =
      req.cookies?.get("refreshToken")?.value || req.body.refreshToken;

    console.log("incomingRefreshToken --", incomingRefreshToken);

    if (!incomingRefreshToken) {
      return utils.responseHandler({
        message: "unauthorized request",
        status: 401,
        success: false,
      });
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        mongodbConfig.refreshTokenSecret
      );

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        return utils.responseHandler({
          message: "Invalid refresh token",
          status: 401,
          success: false,
        });
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        return utils.responseHandler({
          message: "Refresh token is expired or used",
          status: 401,
          success: false,
        });
      }

      const options = {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };

      const { accessToken, refreshToken } = await utils.generateAccessAndRefreshToken(
        user._id
      );

      (await cookies()).set("accessToken", accessToken, options);
      (await cookies()).set("refreshToken", refreshToken, options);

      return utils.responseHandler({
        message: "Access token refreshed",
        status: 200,
        success: true,
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      return utils.responseHandler({
        message: "Invalid refresh token",
        status: 500,
        success: false,
      });
    }
  })
);
