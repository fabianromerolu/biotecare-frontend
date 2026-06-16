import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "biotecare_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionMarker = request.cookies.get(SESSION_COOKIE)?.value === "active";

  if (pathname.startsWith("/login") && hasSessionMarker) {
    return NextResponse.redirect(new URL("/patients", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patients/:path*", "/model/:path*", "/subfenotipos-ivcm/:path*", "/login"],
};
