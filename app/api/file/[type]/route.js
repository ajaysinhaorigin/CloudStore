import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { utils } from "../../../../lib/utils/server-utils";
import connectDB from "../../../../lib/dbConnection";
import File from "../../../../lib/models/file.model";

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

      const query = { owner: req.user._id };

      if (type.length > 0) {
        query.type = { $in: type }; // Match any value in the `type` array
      }

      if (searchPattern) {
        query.name = { $regex: searchPattern };
      }

      const files = await File.find(query).sort({ createdAt: sortOrder });

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
