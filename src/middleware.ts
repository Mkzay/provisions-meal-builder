import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const DEFAULT_SECRET = "32f3c9046052408d9107cc3459dc736db39e23517214acbc7c903cf9027f0a22";

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  process.env.AUTH_SECRET = DEFAULT_SECRET;
}

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  try {
    const isLoggedIn = Boolean(req.auth);
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth");

  if (isAuthApi) {
    return NextResponse.next();
  }

  // Allow brand assets, icons, and social preview images publicly
  const pathname = req.nextUrl.pathname;
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

  if (!isLoggedIn && !isLoginPage) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.nextUrl.origin);
    if (req.nextUrl.pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
  } catch (error) {
    console.error("Middleware caught error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|og-image|opengraph-image|twitter-image|manifest\\.json|sw\\.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
