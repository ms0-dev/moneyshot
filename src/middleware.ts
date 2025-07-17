import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = ["/sign-in", "/sign-up"].includes(pathname);
  const isProtectedRoute = ["/dashboard", "/create"].includes(pathname);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// causes infinite redirects https://nextjs.org/docs/app/api-reference/file-conventions/middleware#:~:text=to%2Dregexp%20documentation.-,Good%20to%20know%3A,-The%20matcher%20values
//const protectedRoutes = ["/dashboard", "/create"];
//const authRoutes = ["/sign-in", "/sign-up"];

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard", "/create"], // Specify the routes the middleware applies to
};

/*import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard"], // Apply middleware to specific routes
};*/
