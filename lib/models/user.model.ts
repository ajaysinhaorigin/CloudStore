import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    otp: {
      code: { type: String }, // The actual OTP
      expiration: { type: Date }, // Expiry time for the OTP
      verified: { type: Boolean, default: false }, // Status of OTP verification
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model("User", userSchema);

export default User;
