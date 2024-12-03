import User from "../../../../lib/models/user.model";
import { utils } from "../../../../lib/utils/server-utils";
import { cookies } from "next/headers";

const POST = async (req) => {
  try {
    const { email, code } = await req.json();
    const isFieldEmpty = [email, code].some((field) => field?.trim() === "");

    if (isFieldEmpty) {
      return utils.responseHandler({
        message: "All fields are required",
        status: 400,
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return utils.responseHandler({
        message: "User not found",
        status: 404,
        success: false,
      });
    }
    if (user.otp.expiration < new Date()) {
      return utils.responseHandler({
        message: "OTP has expired",
        status: 400,
        success: false,
      });
    }

    if (user.otp.code !== code) {
      return utils.responseHandler({
        message: "Invalid OTP",
        status: 400,
        success: false,
      });
    }

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          otp: {
            code: null,
            expiration: null,
            verified: true,
          },
        },
      }
    );

    const loggedInUser = await User.findById(user._id).select(
      "-otp -refreshToken -createdAt -updatedAt -__v"
    );

    const { accessToken, refreshToken } =
      await utils.generateAccessAndRefreshToken(user._id);

    const options = {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    (await cookies()).set("accessToken", accessToken, options);
    (await cookies()).set("refreshToken", refreshToken, options);

    return utils.responseHandler({
      message: "OTP verified successfully",
      status: 200,
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: loggedInUser,
      },
    });
  } catch (error) {
    return utils.responseHandler({
      message: error.message,
      status: 500,
      success: false,
    });
  }
};

export { POST };
