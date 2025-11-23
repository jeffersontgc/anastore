import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "./app/middlewares/auth";
import { MiddlewareStatus } from "./app/types/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow /api without auth enforcement here
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow access to login; if already logged in, redirect home
  if (pathname === "/login") {
    const { canContinue } = await authenticate(request);
    if (canContinue) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const { canContinue, status } = await authenticate(request);

  if (canContinue) return NextResponse.next();

  if (status === MiddlewareStatus.EXPIRED_TOKEN) {
    return NextResponse.redirect(new URL("/session-expired", request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|session-expired|api/auth).*)",
  ],
};
