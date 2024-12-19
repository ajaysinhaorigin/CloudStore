import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { NextResponse } from "next/server";
import { mongodbConfig } from "../dbConnection/config";
import nodemailer from "nodemailer";

// utils/responseHelper.js
export function responseHandler({
  message = "",
  status,
  success = true,
  data = {},
}: {
  message: string;
  status: number;
  success?: boolean;
  data?: any;
}) {
  return NextResponse.json(
    {
      message,
      success,
      ...data,
    },
    { status }
  );
}

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Something went wrong while generating refresh and access token",
      },
      {
        status: 500,
      }
    );
  }
};

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 5 minutes
  return { otp, expiration };
};

const emailTemplate = (firstName: string, otp: string) => {
  return `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <p>Hello, ${firstName}!</p>
            <p>Enter the following verification code if prompted to securely sign-in/sign-up to your account. This code is valid for 10 minutes.</p>
            <div style="border: 1px solid #ccc; padding: 10px; margin: 20px 0; display: inline-block; text-align: center; font-size: 1.5em; font-weight: bold; color: #333;">
              ${otp.split("").join(" ")}
            </div>
            <p>If you did not request this code, please ignore this email.</p>
          </div>`;
};

const sendEmailOTP = async (email: string, firstName: string) => {
  const { otp, expiration } = generateOtp();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mongodbConfig.gmailUser,
        pass: mongodbConfig.gmailPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: mongodbConfig.gmailUser,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: emailTemplate(firstName, otp),
    };

    const data = await transporter.sendMail(mailOptions);
    return data ? { otp, expiration } : null;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

const clearCookies = (cookieStore: any) => {
  cookieStore.set("accessToken", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });

  cookieStore.set("refreshToken", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });
};

const verifyJWT = (req: any) => {
  const token =
    req.cookies?.get("accessToken")?.value ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) throw new Error("Authorization token is missing");
  try {
    return jwt.verify(token, mongodbConfig.accessTokenSecret);
  } catch (error: any) {
    throw new Error("Token verification failed: " + error.message);
  }
};

const fetchCurrentUser = async (decodedToken: any) => {
  try {
    return await User.findById(decodedToken._id)
      .select("_id email fullName avatar")
      .lean();
  } catch (error: any) {
    throw new Error("Failed to fetch user: " + error.message);
  }
};

export const utils = {
  responseHandler,
  generateAccessAndRefreshToken,
  sendEmailOTP,
  clearCookies,
  verifyJWT,
  fetchCurrentUser,
};
