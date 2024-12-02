import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log("Requested Path:", pathname);

  // If the user is already on the sign-in or sign-up page, don't apply the middleware
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Get the accessToken from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken || !accessToken.value) {
      console.log("No access token found, redirecting to /sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url)); // Redirect to sign-in page
    }

    console.log("Access token found:", accessToken.value);

    // If the token exists, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error while processing the middleware:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url)); // In case of error, redirect to sign-in
  }
}

export const config = {
  matcher: ["/profile", "/",], // Only apply to protected routes, not sign-in or sign-up
};
