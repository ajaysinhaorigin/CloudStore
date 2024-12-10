import { verifyJWT } from "../../../../lib/middlewares/verifyJwt";
import { asyncHandler } from "../../../../lib/utils/asyncHandler";
import { utils } from "../../../../lib/utils/server-utils";
import connectDB from "../../../../lib/dbConnection";

export const GET = asyncHandler(
  verifyJWT(async (req, { params }) => {
    try {
      await connectDB();

      const type = (await params)?.type || "";
      const { searchParams } = new URL(req.url);
      const searchText = searchParams.get("searchText");
      const sort = searchParams.get("sort");

      const locationPattern = new RegExp(searchText, "i");

      console.log("on server", { searchText, sort });
      console.log("param", type);

      return utils.responseHandler({
        message: "Documents fetched successfully",
        data: {
          user: req.user,
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
