import jwt from "jsonwebtoken";
import User from "../models/user.model";
import EmailTemplate from "@/components/EmailTemplate";
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

const htmlContent = (firstName: string, otp: string) => {
  return `<div>
            <h1>Welcome, ${firstName}!</h1>
            <h2>Your Otp is, ${otp}!</h2>
          </div>`;
};

const sendEmailOTP = async (email: string) => {
  const { otp, expiration } = generateOtp();
  console.log("email", email);

  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mongodbConfig.gmailUser, // Access the private env variable here
        pass: mongodbConfig.gmailPassword, // Access the private env variable here
      },
    });

    // Email content
    const mailOptions = {
      from: mongodbConfig.gmailUser, // Using environment variable
      to: email, // Target recipient email
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`, // Plain text content
      html: htmlContent("John Doe", otp), // HTML content
    };

    // Send the email
    const data = await transporter.sendMail(mailOptions);

    console.log("Email sent:", data);

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
