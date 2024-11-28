import User from "../../../../lib/models/user.model";
import { utils } from "../../../../lib/utils.ts";

export const POST = async (req, res) => {
  try {
    const { fullName, email } = await req.json();

    const isFieldEmpty = [fullName, email].some(
      (field) => field?.trim() === ""
    );

    if (isFieldEmpty) {
      return new Response(
        JSON.stringify({
          message: "All fields are required",
        }),
        {
          status: 400,
        }
      );
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return new Response(
        JSON.stringify({
          message: "User with email or username already exists",
        }),
        {
          status: 409,
        }
      );
    }

    const otpDetails = await utils.sendEmailOTP(email);

    if (!otpDetails) {
      return new Response(
        JSON.stringify({
          message: "Something went wrong while sending OTP",
        }),
        {
          status: 500,
        }
      );
    }

    const { otp, expiration } = otpDetails;

    const user = await User.create({
      fullName,
      email,
      otp: {
        code: otp,
        expiration,
        verified: false,
      },
    });

    const createdUser = await User.findById(user._id).select("-refreshToken");

    if (!createdUser) {
      return new Response(
        JSON.stringify({
          message: "Something went wrong while registering the user",
        }),
        {
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify(createdUser.otp), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
