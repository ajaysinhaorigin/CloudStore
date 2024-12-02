import jwt from "jsonwebtoken";
import { mongodbConfig } from "../../../../lib/dbConnection/config";
import { utils } from "../../../../lib/utils";
import User from "../../../../lib/models/user.model";

const GET = async (req) => {
  const accessToken =
    req.cookies?.get("accessToken")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  console.log("accessToken", accessToken);

  if (!accessToken) {
    return utils.responseHandler({
      message: "Authorization header is missing",
      status: 401,
      success: false,
    });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(
      accessToken,
      mongodbConfig.accessTokenSecret
    );
    console.log("Token is valid. Decoded data:", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-otp -refreshToken -createdAt -updatedAt -__v"
    );

    console.log("user", user);

    if (!user) {
      //   To do : discuss about frontend
      return utils.responseHandler({
        message: "Invalid token",
        status: 401,
        success: false,
      });
    }

    return utils.responseHandler({
      message: "User profile fetched successfully",
      data: {
        user,
      },
      status: 200,
      success: true,
    });
  } catch (error) {
    return utils.responseHandler({
      message: "Invalid token",
      status: 401,
      success: false,
    });
  }
};

export { GET };
