import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/bookings",
  "/messages",
  "/equipment",
  "/payments",
  "/reviews",
  "/admin",
  "/listings/new",
];

const AUTH_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest): NextResponse {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  const isProtected =
    PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) || /^\/listings\/[^/]+\/edit(\/.*)?$/.test(pathname);

  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
