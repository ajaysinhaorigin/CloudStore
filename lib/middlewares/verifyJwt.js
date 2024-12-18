import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { mongodbConfig } from "../dbConnection/config";
import { utils } from "../utils/server-utils";
import { cookies } from "next/headers";

export const verifyJWT = (cb) => async (req, res) => {
  const cookieStore = await cookies();
  try {
    const token =
      req.cookies?.get("accessToken")?.value ||
      req.headers?.authorization?.replace("Bearer ", "");

    if (!token) throw new Error("Authorization token is missing");

    const decodedToken = jwt.verify(token, mongodbConfig.accessTokenSecret);

    const user = await User.findById(decodedToken._id)
      .select(
        "-password -emailVerificationToken -emailVerificationExpiry -isEmailVerified -refreshToken -createdAt -updatedAt -__v"
      )
      .lean();
    if (!user) {
      utils.clearCookies(cookieStore);
      throw new Error("Invalid token or user not found");
    }

    req.user = user;
    return await cb(req, res);
  } catch (error) {
    return utils.responseHandler({
      message: error.message || "Token verification failed",
      status: 401,
      success: false,
    });
  }
};
