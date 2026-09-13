import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  try {
    const isLoggedIn = Boolean(req.auth);
  const pathname = req.nextUrl.pathname;
  const isLandingPage = pathname === "/";
  const isLoginPage = pathname.startsWith("/login");
  const isSignupPage = pathname.startsWith("/signup");
  const isAuthPage = isLoginPage || isSignupPage;
  const isAuthApi = pathname.startsWith("/api/auth");

  if (isAuthApi) {
    return NextResponse.next();
  }

  // Allow brand assets, icons, and social preview images publicly
  if (
    pathname.startsWith("/og-image") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/apple-touch-icon") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/icons/") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Public Landing Page: logged out users see landing page, logged in users go straight to /app
  if (isLandingPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/app", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // If already logged in and visiting login or signup, go straight to /app
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/app", req.nextUrl.origin));
  }

  // If unauthenticated and trying to access protected routes
  if (!isLoggedIn) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
  } catch (error) {
    console.error("Middleware caught error:", error);
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|og-image|opengraph-image|twitter-image|manifest\\.json|sw\\.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
