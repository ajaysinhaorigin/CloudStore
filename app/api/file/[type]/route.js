import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { utils } from "../../../../lib/utils/server-utils";
import connectDB from "../../../../lib/dbConnection";
import File from "../../../../lib/models/file.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../../../lib/models/user.model";
import { mongodbConfig } from "../../../../lib/dbConnection/config";

export const verify = (req) => {
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

export const fetchUser = async (decodedToken) => {
  try {
    return await User.findById(decodedToken._id)
      .select("_id email fullName avatar")
      .lean();
  } catch (error) {
    throw new Error("Failed to fetch user: " + error.message);
  }
};

export const GET = asyncHandler(async (req, { params }) => {
  try {
    await connectDB();

    const decodedToken = verify(req);
    const user = await fetchUser(decodedToken);

    const typeParam = (await params)?.type || [];
    const { searchParams } = new URL(req.url);
    const searchText = searchParams.get("searchText") || "";
    const sort = searchParams.get("sort") || "createdAt-desc";
    // Number of recent files to fetch (can be passed as a query param)
    const limit = searchParams.get("limit");
    const [sortBy, orderBy] = sort.split("-");
    const sortOrder = orderBy === "desc" ? { [sortBy]: -1 } : { [sortBy]: 1 };

    const searchPattern = new RegExp(searchText.trim(), "i");

    const query = {
      $or: [
        { owner: new mongoose.Types.ObjectId(user._id) },
        { users: { $in: [user.email] } },
      ],
    };

    if (typeParam) {
      const typeArray = typeParam.split(",").filter((t) => t.trim() !== "");
      if (typeArray.length > 0 && typeArray[0] !== "all") {
        query.type = { $in: typeArray };
      }
    }

    if (searchPattern) {
      query.$and = [
        {
          $or: [
            { name: { $regex: searchPattern } },
            { type: { $regex: searchPattern } },
          ],
        },
      ];
    }

    const aggregatePipline = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                fullName: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "email",
          as: "users",
          pipeline: [
            {
              $project: {
                fullName: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
      {
        $addFields: {
          users: {
            $map: {
              input: "$users",
              as: "user",
              in: {
                email: "$$user.email",
                fullName: "$$user.fullName",
                avatar: "$$user.avatar",
              },
            },
          },
        },
      },
      {
        $sort: sortOrder,
      },
      {
        $project: {
          __v: 0,
        },
      },
    ];

    if (limit) {
      aggregatePipline.push({
        $limit: 10,
      });
    }

    const files = await File.aggregate(aggregatePipline);

    return utils.responseHandler({
      message: "files fetched successfully",
      data: {
        total: files.length,
        files: files,
      },
      status: 200,
      success: true,
    });
  } catch (error) {
    return utils.responseHandler({
      message: error.message || "Internal Server Error while fetching files",
      status: error.status || 500,
      success: false,
    });
  }
});
