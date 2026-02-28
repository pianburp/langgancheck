import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE_PREFIX = "better-auth";

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith(AUTH_COOKIE_PREFIX));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasSessionCookie(request);

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    (pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/signup")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/signup", "/dashboard/:path*"],
};
