import { NextResponse, type NextRequest } from "next/server";
import { clearAuthTokens, getAuthTokens } from "../lib/cookies";

function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = ["/dashboard", "/events", "/profile"];
  return protectedPaths.some(path => pathname.startsWith(path));
}

export async function auth(req: NextRequest, res: NextResponse) {
  if (!isProtectedRoute(req.nextUrl.pathname)) return res;
  
  const { accessToken, refreshToken } = await getAuthTokens();
  if (!accessToken || !refreshToken) {
    await clearAuthTokens();
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}
