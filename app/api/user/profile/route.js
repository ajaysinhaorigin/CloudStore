import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { utils } from "../../../../lib/utils/server-utils";
import jwt from "jsonwebtoken";
import User from "../../../../lib/models/user.model";
import { mongodbConfig } from "../../../../lib/dbConnection/config";
import connectDB from "../../../../lib/dbConnection";

const verify = (req) => {
  const token =
    req.cookies?.get("accessToken")?.value ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) throw new Error("Authorization token is missing");
  try {
    return jwt.verify(token, mongodbConfig.accessTokenSecret);
  } catch (error) {
    throw new Error("Token verification failed: " + error.message);
  }
};

const fetchUser = async (decodedToken) => {
  try {
    return await User.findById(decodedToken._id)
      .select("_id email fullName avatar")
      .lean();
  } catch (error) {
    throw new Error("Failed to fetch user: " + error.message);
  }
};

export const GET = asyncHandler(async (req, _) => {
  try {
    await connectDB();

    const decodedToken = verify(req);
    const user = await fetchUser(decodedToken);

    return utils.responseHandler({
      message: "User profile fetched successfully",
      data: {
        user: user,
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
});
