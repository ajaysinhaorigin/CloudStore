import User from "../../../../lib/models/user.model";
import { utils } from "../../../../lib/utils/server-utils";

export const POST = async (req, res) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return utils.responseHandler({
        message: "Email is required",
        status: 400,
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return utils.responseHandler({
        message: "User with this email does not exist",
        status: 404,
        success: false,
      });
    }

    const otpDetails = await utils.sendEmailOTP(email);

    if (!otpDetails) {
      return utils.responseHandler({
        message: "Something went wrong while sending OTP",
        status: 500,
        success: false,
      });
    }
    const { otp, expiration } = otpDetails;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          otp: {
            code: otp,
            expiration: expiration,
            verified: false,
          },
        },
      },
      { returnDocument: "after" }
    );
    return utils.responseHandler({
      message: "OTP sent successfully",
      status: 200,
      success: true,
      data: updatedUser.otp,
    });
  } catch (error) {
    return utils.responseHandler({
      message: error.message,
      status: 500,
      success: false,
    });
  }
};
