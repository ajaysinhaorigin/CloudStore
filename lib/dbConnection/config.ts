export const mongodbConfig = {
  mongodbUri: process.env.NEXT_PUBLIC_MONGODB_URI!,
  dbName: process.env.NEXT_PUBLIC_DB_NAME!,
  accessTokenSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!,
  accessTokenExpiry: process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRY!,
  refreshTokenSecret: process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!,
  refreshTokenExpiry: process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY!,
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  cloudinaryApiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  gmailUser: process.env.NEXT_PUBLIC_GMAIL_USER!,
  gmailPassword: process.env.NEXT_PUBLIC_GMAIL_PASS!,
};
