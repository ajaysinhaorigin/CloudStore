import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { utils } from "../../../../lib/utils/server-utils";
import connectDB from "../../../../lib/dbConnection";
import File from "../../../../lib/models/file.model";
import mongoose from "mongoose";

export const GET = asyncHandler(
  verifyJWT(async (req, { params }) => {
    try {
      await connectDB();

      const type = (await params)?.type || [];
      const { searchParams } = new URL(req.url);
      const searchText = searchParams.get("searchText");
      const sort = searchParams.get("sort");

      const sortOrder = sort === "desc" ? -1 : 1;
      const searchPattern = searchText ? new RegExp(searchText, "i") : null;
      const query = {
        $or: [
          { owner: new mongoose.Types.ObjectId(req.user._id) },
          { users: { $in: [req.user.email] } },
        ],
      };

      // also have to find files which are shared with the user
      if (type.length > 0) {
        query.type = { $in: type.split(",") || [] };
      }

      if (searchPattern) {
        query.name = { $regex: searchPattern };
      }

      const files = await File.aggregate([
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
          $addFields: {
            owner: {
              $first: "$owner",
            },
          },
        },
        {
          $sort: {
            createdAt: sortOrder,
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      console.log({ files });

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
  })
);
